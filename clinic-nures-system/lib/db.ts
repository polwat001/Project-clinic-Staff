// lib/db.ts
import { supabase } from './supabase'
import type { Appointment, LabResult, Patient, RxItem, Visit } from './types'

const COL_NOT_EXISTS = '42703' // undefined column
const TBL_NOT_EXISTS = '42P01' // undefined table

/** รายชื่อผู้ป่วย (กันคอลัมน์บางตัวไม่อยู่ด้วยการ select *) */
export async function getPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return (data ?? []) as Patient[]
}

/** Bundle: visits / labs / appointments (เรียงฝั่ง JS ให้ยืดหยุ่นกับคอลัมน์เวลา) */
export async function getPatientBundle(
  patientId: string
): Promise<{ visits: Visit[]; labs: LabResult[]; appts: Appointment[] }> {
  const [visitsRes, labsRes, apptsRes] = await Promise.all([
    supabase.from('visits').select('*').eq('patient_id', patientId).limit(200),
    supabase.from('lab_results').select('*').eq('patient_id', patientId).limit(200),
    supabase.from('appointments').select('*').eq('patient_id', patientId).limit(200),
  ])

  if (visitsRes.error) throw visitsRes.error
  if (labsRes.error) throw labsRes.error
  if (apptsRes.error) throw apptsRes.error

  const visits = ((visitsRes.data ?? []) as Visit[]).sort((a: any, b: any) => {
    const ta = new Date(a.visit_at ?? a.visited_at ?? 0).getTime()
    const tb = new Date(b.visit_at ?? b.visited_at ?? 0).getTime()
    return tb - ta
  })

  const labs = ((labsRes.data ?? []) as LabResult[]).sort((a: any, b: any) => {
    const ta = new Date(a.taken_at ?? a.ordered_at ?? 0).getTime()
    const tb = new Date(b.taken_at ?? b.ordered_at ?? 0).getTime()
    return tb - ta
  })

  const appts = ((apptsRes.data ?? []) as Appointment[]).sort(
    (a: any, b: any) =>
      new Date(a.start_at ?? 0).getTime() - new Date(b.start_at ?? 0).getTime()
  )

  return { visits, labs, appts }
}

/** สร้างเวชระเบียน (รองรับคีย์เก่า/ใหม่ + ฟิลด์ละเอียด) */
export async function createVisit(input: {
  patient_id: string

  // core
  chief_complaint?: string | null
  diagnosis?: string | null
  plan?: string | null
  advice?: string | null

  // optional details
  ros?: string | null
  pe?: string | null
  icd10?: string | null
  dept?: string | null

  // vitals
  bp_sys?: number | null
  bp_dia?: number | null
  pulse?: number | null
  temp_c?: number | null
  rr?: number | null
  spo2?: number | null
  height_cm?: number | null
  weight_kg?: number | null
  bmi?: number | null
}): Promise<Visit> {
  const base = {
    patient_id: input.patient_id,
    chief_complaint: input.chief_complaint ?? null,
    diagnosis: input.diagnosis ?? null,
    plan: input.plan ?? null,
    advice: input.advice ?? null,
    ros: input.ros ?? null,
    pe: input.pe ?? null,
    icd10: input.icd10 ?? null,
    dept: input.dept ?? null,
    bp_sys: input.bp_sys ?? null,
    bp_dia: input.bp_dia ?? null,
    pulse: input.pulse ?? null,
    temp_c: input.temp_c ?? null,
    rr: input.rr ?? null,
    spo2: input.spo2 ?? null,
    height_cm: input.height_cm ?? null,
    weight_kg: input.weight_kg ?? null,
    bmi: input.bmi ?? null,
  }

  // 1) ใช้ visit_at
  let { data, error } = await supabase
    .from('visits')
    .insert({ ...base, visit_at: new Date().toISOString() })
    .select('*')
    .single()

  // 2) ถ้า column ไม่อยู่ → ใช้ visited_at
  if (error && (error as any).code === COL_NOT_EXISTS) {
    const retry = await supabase
      .from('visits')
      .insert({ ...base, visited_at: new Date().toISOString() })
      .select('*')
      .single()
    data = retry.data as any
    error = retry.error as any
  }

  if (error) throw error
  return data as Visit
}

/* ------------------------- Helpers: Rx ------------------------- */

const toPosInt = (v: any, def = 1) => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : def
}

const parsePeriodDays = (period?: string | null, fallback?: number | null) => {
  if (typeof fallback === 'number' && fallback > 0) return fallback
  if (!period) return null
  const m = period.match(/(\d+)/)
  return m ? toPosInt(m[1], null as any) : null
}

const calcTotalUnits = (i: {
  qty_per_dose?: number | null
  doses_per_day?: number | null
  period_days?: number | null
}) => {
  const q = toPosInt(i.qty_per_dose ?? 1)
  const d = toPosInt(i.doses_per_day ?? 1)
  const days = toPosInt(i.period_days ?? 1)
  return q * d * days
}

/** ส่งใบสั่งยา (แนบ advice + ผูก visit_id ถ้ามี + รองรับ detailed/sig-days + จำนวนยา) */
export async function sendPrescription(params: {
  patient_id: string
  visit_id?: string
  doctor_id?: string
  advice?: string | null
  items: RxItem[]
}): Promise<{ id: string }> {
  // 1) สร้าง prescription header พร้อมคำแนะนำแพทย์ (advice)
  const { data: pres, error } = await supabase
    .from('prescriptions')
    .insert({
      patient_id: params.patient_id,
      visit_id: params.visit_id ?? null,
      doctor_id: params.doctor_id ?? null,
      advice: params.advice ?? null,
    })
    .select('id')
    .single()
  if (error) throw error

  // 2) แทรกรายการยา (เชื่อม prescription_id)
  if (params.items.length) {
    // เพิ่ม citizen_id และ doctor_advice ให้กับแต่ละรายการ
    const detailedRows = params.items.map((i) => {
      const period_days = (i as any).period_days ?? null;
      return {
        prescription_id: pres.id,
        drug_code: i.drug_code,
        name: i.name,
        strength: (i as any).strength ?? null,
        frequency: (i as any).frequency ?? null,
        period: (i as any).period ?? null,
        note: (i as any).note ?? null,
        qty_per_dose: (i as any).qty_per_dose ?? null,
        doses_per_day: (i as any).doses_per_day ?? null,
        period_days,
        meal_timing: (i as any).meal_timing ?? null,
        citizen_id: (i as any).citizen_id ?? null,
        doctor_advice: (i as any).doctor_advice ?? null, // เพิ่ม doctor_advice
      }
    });

    let ins = await supabase.from('prescription_items').insert(detailedRows);
    if (ins.error) throw ins.error;
  }

  return { id: pres.id }
}

/** โหลดใบสั่งยาล่าสุดของ visit (รวม advice + รายการในทั้งสองตาราง + ฟิลด์จำนวนยา ถ้ามี) */
export async function loadPrescriptionByVisit(visitId: string) {
  // ดึงทั้งสองฝั่ง (ถ้ามีอย่างใดอย่างหนึ่ง)
  const sel =
    'id, created_at, patient_id, doctor_id, visit_id, advice, ' +
    'rx_items(id,drug_code,name,strength,frequency,period,sig,days,note,qty_per_dose,doses_per_day,period_days,total_units), ' +
    'prescription_items(id,drug_code,name,strength,frequency,period,sig,days,note,qty_per_dose,doses_per_day,period_days,total_units)'

  const { data, error } = await supabase
    .from('prescriptions')
    .select(sel)
    .eq('visit_id', visitId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    // บางฐานอาจยังไม่มีคอลัมน์จำนวนยา → ดึงแบบไม่ใส่คอลัมน์พวกนี้
    if ((error as any).code === COL_NOT_EXISTS) {
      const fallbackSel =
        'id, created_at, patient_id, doctor_id, visit_id, advice, ' +
        'rx_items(*), prescription_items(*)'
      const retry = await supabase
        .from('prescriptions')
        .select(fallbackSel)
        .eq('visit_id', visitId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (retry.error) throw retry.error
      return retry.data
    }
    throw error
  }
  return data // อาจเป็น null ถ้ายังไม่มี
}

/** ค้นหายา: med_catalog → medications (เลือกได้ทั้งชื่อ/รหัสยา) */
export async function searchMedicationCatalog(
  q: string,
  limit = 50
): Promise<
  Array<{
    drug_code: string
    name: string
    strength: string | null
    frequency: string | null
    period: string | null
    note: string | null
  }>
> {
  if (!q?.trim()) return []

  const run = (table: string) =>
    supabase
      .from(table)
      .select('drug_code,name,strength,frequency,period,note')
      .or(`name.ilike.%${q}%,drug_code.ilike.%${q}%`)
      .order('name', { ascending: true })
      .limit(limit)

  let { data, error } = await run('med_catalog')
  if (error && (error as any).code === TBL_NOT_EXISTS) {
    const retry = await run('medications')
    data = retry.data
    error = retry.error as any
  }
  if (error) throw error

  return (data ?? []).map((r: any) => ({
    drug_code: r.drug_code,
    name: r.name,
    strength: r.strength ?? null,
    frequency: r.frequency ?? null,
    period: r.period ?? null,
    note: r.note ?? null,
  }))
}

/** สร้างนัดหมายแบบง่าย */export async function createAppointment(input: {
  patient_id: string
  start_at: string // ISO
  reason?: string | null
  note?: string | null
  status?: string | null // scheduled/completed/cancelled
}): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      patient_id: input.patient_id,
      start_at: input.start_at,
      reason: input.reason ?? null,
      note: input.note ?? null,
      status: input.status ?? 'scheduled',
    })
    .select('*')
    .single()

  if (error) throw error
  return data as Appointment
}

/** ดึงสัญญาณชีพล่าสุดของผู้ป่วยจากตาราง visits */
export async function getLastVitalsFromVisits(patientId: string): Promise<Pick<
  Visit,
  'bp_sys' | 'bp_dia' | 'pulse' | 'temp_c' | 'rr' | 'spo2' | 'height_cm' | 'weight_kg' | 'bmi'
> & { taken_at: string } | null> {
  const { data, error } = await supabase
    .from('visits')
    .select('visit_at,visited_at,bp_sys,bp_dia,pulse,temp_c,rr,spo2,height_cm,weight_kg,bmi')
    .eq('patient_id', patientId)
    .order('visit_at', { ascending: false, nullsFirst: false })
    .order('visited_at', { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const taken_at = data.visit_at ?? data.visited_at ?? new Date().toISOString()
  const { bp_sys, bp_dia, pulse, temp_c, rr, spo2, height_cm, weight_kg, bmi } = data as any
  return { taken_at, bp_sys, bp_dia, pulse, temp_c, rr, spo2, height_cm, weight_kg, bmi }
}

