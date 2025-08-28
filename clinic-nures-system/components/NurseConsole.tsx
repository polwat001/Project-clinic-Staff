"use client";

import React, { useMemo, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PatientRegisterForm from "./nurse/PatientRegisterForm";
import AppointmentList from "./nurse/AppointmentList";
import QueueBoard from "./nurse/QueueBoard";
import TriageForm from "./nurse/TriageForm";
import SearchPatientSection from "./nurse/SearchPatientSection";
import CaseHistorySection from "./nurse/CaseHistorySection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";


interface DoctorDiagnosis {
  caseId: string;
  idCard: string;
  name: string;
  chief: string;
  diagnosis: string;
  medicines: Array<{
    name: string;
    dosage: string;
    instructions: string; 
  }>;
  notes?: string;
  appointment?: {
    id: string;
    date: string;
    room?: string;
  };
}
// Type definitions
interface Appointment {
  id: string;
  hn: string;
  patient_name?: string;
  name?: string;
  scheduled_at?: string;
  chief?: string;
  chief_complaint?: string;
  flags?: string[];
  room?: string;
}

interface QueueItem {
  q: string;
  hn: string;
  name: string;
  type: string;
  status: string;
  room: string;
  apptId: string | null;
  triage: string;
}

interface Patient {
  hn: string;
  name: string;
  phone: string;
  dob: string;
  apptId: string;
  chief: string;
  allergies: string;
  pmh: string;
  meds: string;
  urgency: string;
  // New Patient fields
  idCard?: string;
  prefix?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  address?: string;
  province?: string;
  district?: string;
  rights?: string;
  email?: string;
  lineId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  // Existing Patient fields
  additionalSymptom?: string;
}

interface Vitals {
  sys: string;
  dia: string;
  hr: string;
  rr: string;
  temp: string;
  spo2: string;
  wt: string;
  ht: string;
}

const pad = (n: number) => n.toString().padStart(2, "0");
const nowStr = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const todayISODate = () => new Date().toISOString().slice(0, 10);



const ranges = { bpSys:[90,180], bpDia:[60,110], hr:[50,110], rr:[10,24], temp:[36.0,37.9], spo2:[94,100], bmi:[18.5,29.9] };
const computeBMI = (wt: any, ht: any) => { const w=+wt, h=+ht; if(!w||!h) return ""; const bmi=w/Math.pow(h/100,2); return isFinite(bmi)?bmi.toFixed(1):""; };
const nextWalkInCode = (queue: any[]) => `W${(queue.filter(x=>x.type==='walkin').length+1).toString().padStart(3,'0')}`;
const vitalFlags = (v:any, r= ranges) => {
  const f:string[]=[]; const n=(x:any)=>parseFloat(x); const inR=(val:number,[lo,hi]:number[])=>!(isNaN(val))&&(val<lo||val>hi);
  if(inR(n(v.sys),r.bpSys)) f.push("BP Systolic out of range");
  if(inR(n(v.dia),r.bpDia)) f.push("BP Diastolic out of range");
  if(inR(n(v.hr),r.hr)) f.push("Pulse out of range");
  if(inR(n(v.rr),r.rr)) f.push("Respiratory rate out of range");
  if(inR(n(v.temp),r.temp)) f.push("Temperature out of range");
  if(inR(n(v.spo2),r.spo2)) f.push("SpO2 out of range");
  if(inR(n(v.bmi),r.bmi)) f.push("BMI out of range");
  return f;
};

const STATUS_LABELS: Record<string,string> = { ARRIVED: "มาถึง", READY_FOR_NURSE: "รอคัดกรอง", READY_FOR_DOCTOR: "รอพบแพทย์", IN_EXAM: "ตรวจอยู่" };

function RangeFlag({ value, range, label }:{value:any, range:number[], label:string}) {
  const out = value !== "" && (value < range[0] || value > range[1]);
  return (<div className="flex items-center gap-2">
    <Badge variant={out?"destructive":"secondary"} className="rounded-xl">{label}: {value!==""?value:"-"}</Badge>
    {out&&<AlertTriangle className="h-4 w-4"/>}
  </div>);
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!url || !key) return null;
  return createClient(url, key);
}

// เปลี่ยน SelfTest จาก async เป็นฟังก์ชันปกติ
function SelfTest({ queue }: { queue: any[] }) {
  const tests = [
    { name: 'BMI 72/173 => 24.1', pass: computeBMI(72,173)==='24.1' },
    { name: 'Flags normal', pass: vitalFlags({sys:120,dia:80,hr:80,rr:18,temp:36.8,spo2:98,bmi:22}).length===0 },
    { name: 'Flags high temp', pass: vitalFlags({sys:120,dia:80,hr:80,rr:18,temp:38.5,spo2:98,bmi:22}).includes('Temperature out of range') },
    { name: 'BMI empty', pass: computeBMI('', '')==='' },
    { name: 'Low SpO2 flagged', pass: vitalFlags({sys:120,dia:80,hr:80,rr:18,temp:36.7,spo2:90,bmi:22}).includes('SpO2 out of range') },
    { name: 'Next walk-in code W002', pass: nextWalkInCode(queue)==='W002' },
    { name: 'Status mapping IN_EXAM → ตรวจอยู่', pass: STATUS_LABELS.IN_EXAM==='ตรวจอยู่' },
  ];
  return (
    <Card className="shadow-sm">
      <CardHeader><CardTitle>Self-test</CardTitle></CardHeader>
      <CardContent>
        <ul className="text-xs space-y-1">
          {tests.map((t:any)=> <li key={t.name} className={t.pass?"text-green-600":"text-red-600"}>{t.pass?'✔':'✘'} {t.name}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function NurseConsole() {
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState<any>({});
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // ฟังก์ชันบันทึกผู้ใช้งานใหม่ลง Supabase
  const handleRegisterPatient = async () => {
    const sb = await getSupabase();
    if (!sb) {
      alert('เชื่อมต่อ Supabase ไม่สำเร็จ');
      return;
    }
    // เตรียมข้อมูลสำหรับบันทึก
    const data = {
      hn: patient.hn || null,
      id_card: patient.idCard || null,
      prefix: patient.prefix || null,
      first_name: patient.firstName || null,
      last_name: patient.lastName || null,
      gender: patient.gender || null,
      dob: patient.dob || null,
      phone: patient.phone || null,
      address: patient.address || null,
      province: patient.province || null,
      district: patient.district || null,
      rights: patient.rights || null,
      email: patient.email || null,
      line_id: patient.lineId || null,
      emergency_contact: patient.emergencyContact || null,
      emergency_phone: patient.emergencyPhone || null,
      allergies: patient.allergies || null,
      pmh: patient.pmh || null,
      created_at: new Date().toISOString() // วันเวลาที่ลงทะเบียน
    };
    const { error } = await sb.from('patients').insert(data);
    if (error) {
      alert('บันทึกข้อมูลผู้ป่วยไม่สำเร็จ: ' + error.message);
    } else {
      alert('บันทึกข้อมูลผู้ป่วยสำเร็จ!');
    }
  };
  const [casesFromDoctor, setCasesFromDoctor] = useState<DoctorDiagnosis[]>([]);

  const [casesSent, setCasesSent] = useState<DoctorDiagnosis[]>([]);
  // โหลดเคสจากฐานข้อมูล Supabase
  useEffect(() => {
    const fetchCases = async () => {
      const sb = await getSupabase();
      if (!sb) return;
      // ดึงเคสที่หมอส่งมา (ตัวอย่าง: table 'cases', status 'from_doctor')
      const { data: fromDoctor, error: errFrom } = await sb.from('cases').select('*').eq('status', 'from_doctor');
      if (!errFrom && fromDoctor) {
        setCasesFromDoctor(fromDoctor.map((c: any) => ({
          caseId: c.id,
          idCard: c.id_card,
          name: c.name,
          chief: c.chief,
          diagnosis: c.diagnosis,
          medicines: c.medicines || [],
          notes: c.notes,
          appointment: c.appointment ? {
            id: c.appointment.id,
            date: c.appointment.date,
            room: c.appointment.room
          } : undefined
        })));
      }
      const { data: sentCases, error: errSent } = await sb.from('cases').select('*').eq('status', 'sent');
      if (!errSent && sentCases) {
        setCasesSent(sentCases.map((c: any) => ({
          caseId: c.id,
          idCard: c.id_card,
          name: c.name,
          chief: c.chief,
          diagnosis: c.diagnosis,
          medicines: c.medicines || [],
          notes: c.notes,
          appointment: c.appointment ? {
            id: c.appointment.id,
            date: c.appointment.date,
            room: c.appointment.room
          } : undefined
        })));
      }
    };
    fetchCases();
  }, []);

  // เคสที่เลือกดูรายละเอียด
  const [selectedCase, setSelectedCase] = useState<DoctorDiagnosis | null>(null);
  const [clientTime, setClientTime] = useState<string>("");
  const [queue,setQueue]=useState<QueueItem[]>([]);
  const [appointments,setAppointments]=useState<Appointment[]>([]);

  // โหลดข้อมูล appointments และ queue จาก Supabase เมื่อเปิดหน้า
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sb = await getSupabase();
        if (!sb) return;
        // ดึง appointments
        const { data: apptData, error: apptErr } = await sb.from('appointments').select('*').order('scheduled_at', { ascending: true });
        if (apptErr) console.error('Appointments error:', apptErr);
        if (apptData) setAppointments(apptData);
        // ดึง queue
        const { data: queueData, error: queueErr } = await sb.from('queues').select('*').order('queue_no', { ascending: true });
        if (queueErr) console.error('Queue error:', queueErr);
        if (queueData) setQueue(queueData);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    };
    fetchData();
  }, []);
  const [selected,setSelected]=useState<QueueItem|null>(null);
  const [isWalkIn,setIsWalkIn]=useState<boolean>(false);
  const [patientState,setPatientState]=useState<Patient>({
    hn:'', name:'', phone:'', dob:'', apptId:'',
    chief:'', allergies:'', pmh:'', meds:'', urgency:'P3',
    idCard:'', prefix:'', firstName:'', lastName:'', gender:'', address:'', province:'', district:'', rights:'', email:'', lineId:'', emergencyContact:'', emergencyPhone:'', additionalSymptom:''
  });

  // โหลดข้อมูล vital signs จาก Supabase เมื่อกรอก HN
  useEffect(() => {
    const fetchVitals = async () => {
      if (!patientState.hn) return;
      try {
        const sb = await getSupabase();
        if (!sb) return;
        const { data, error } = await sb.from('vitals').select('*').eq('hn', patientState.hn).order('id', { ascending: false }).limit(1);
        if (error) console.error('Vitals error:', error);
        if (data && data.length > 0) {
          const v = data[0];
          setVitals({
            sys: v.sys ?? '',
            dia: v.dia ?? '',
            hr: v.hr ?? '',
            rr: v.rr ?? '',
            temp: v.temp_c ?? '',
            spo2: v.spo2 ?? '',
            wt: v.weight_kg ?? '',
            ht: v.height_cm ?? ''
          });
        }
      } catch (e) {
        console.error('Fetch vitals error:', e);
      }
    };
    fetchVitals();
  }, [patientState.hn]);
  // ฟังก์ชันบันทึกข้อมูล vital signs ลง Supabase
  const handleSaveVitals = async () => {
    const sb = await getSupabase();
    if (!sb) {
      alert('เชื่อมต่อ Supabase ไม่สำเร็จ');
      return;
    }
    const parseOrNull = (x:any)=>{ const n=parseFloat(String(x)); return isNaN(n)?null:n; };
    const data = {
      sys: parseOrNull(vitals.sys),
      dia: parseOrNull(vitals.dia),
      hr: parseOrNull(vitals.hr),
      rr: parseOrNull(vitals.rr),
      temp_c: parseOrNull(vitals.temp),
      spo2: parseOrNull(vitals.spo2),
      weight_kg: parseOrNull(vitals.wt),                              
      height_cm: parseOrNull(vitals.ht),
      bmi: bmiDerived ? parseFloat(bmiDerived) : null,
      hn: patientState.hn,
      name: patientState.name
    };
    const { error } = await sb.from('vitals').insert(data);
    if (error) {
      alert('บันทึกข้อมูลไม่สำเร็จ: ' + error.message);
    } else {
      alert('บันทึกข้อมูล vital signs สำเร็จ!');
    }
  };
  const [vitals, setVitals] = useState<Vitals>({ sys:'', dia:'', hr:'', rr:'', temp:'', spo2:'', wt:'', ht:'' });
  const [noteS, setNoteS] = useState('');
  const [noteO, setNoteO] = useState('');
  const [noteA, setNoteA] = useState('Stable');
  const [noteP, setNoteP] = useState('ส่งต่อแพทย์');

  const bmiDerived = useMemo(()=> computeBMI(vitals.wt, vitals.ht), [vitals.wt, vitals.ht]);
  const flags = useMemo(()=> vitalFlags({ ...vitals, bmi: bmiDerived }), [vitals, bmiDerived]);
  useEffect(() => {
    if (flags.length > 0) {

    }
  }, [flags]);

  // export ข้อมูลผู้ป่วยในคิวเป็น CSV
  const handleExportQueue = () => {
    const csv = [
      ['Queue', 'HN', 'Name', 'Type', 'Status', 'Room', 'Urgency'].join(','),
      ...queue.map(q => [q.q, q.hn, q.name, q.type, q.status, q.room, q.triage].map(x => `"${x||''}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'queue_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // รีเฟรชคิวจากฐานข้อมูล และ appointments
  const handleRefreshQueue = async () => {
    const sb = getSupabase();
    if (sb) {
      // รีเฟรช appointments
      const { data: apptData, error: apptErr } = await sb.from('appointments').select('*').order('scheduled_at', { ascending: true });
      if (apptErr) console.error('Appointments error:', apptErr);
      if (apptData) setAppointments(apptData);

      // รีเฟรช queue
      const { data: queueData, error: queueErr } = await sb.from('queues').select('*').order('queue_no', { ascending: true });
      if (queueErr) console.error('Queue error:', queueErr);
      if (queueData) setQueue(queueData);
    }
  };
  // ลบคิว
  const handleRemoveQueue = (appt: Appointment) => {
    setAppointments(prev => prev.filter(a => a.id !== appt.id));
  };

  // ข้ามคิว (เลื่อนไปหลังสุด)
  const handleSkipQueue = (appt: Appointment) => {
    setAppointments(prev => {
      const filtered = prev.filter(a => a.id !== appt.id);
      return [...filtered, appt]; // เพิ่มคิวที่ข้ามไปหลังสุด
    });
  };
 
  useEffect(()=>{ (async()=>{
    const sb = await getSupabase(); if(!sb) return;
    await sb.from('appointments')
      .select('id:appt_code, scheduled_at, patient:patients(full_name,hn), room, doctor, status')
      .gte('scheduled_at', todayISODate())
      .lte('scheduled_at', todayISODate()+ 'T23:59:59');

    const channel = (sb as any).channel('queues-all').on('postgres_changes', { event:'*', schema:'public', table:'queues' }, ()=>{
      sb.from('queues').select('queue_no, kind, status, room, encounters!inner ( patients!inner (hn, full_name) )').then(({data}: {data: any[]}) => {
        if(!data) return;
        const mapped = data.map((row:any)=>({ q: row.queue_no, type: row.kind, status: row.status, hn: row.encounters?.patients?.hn, name: row.encounters?.patients?.full_name, room: row.room, apptId: null, triage: 'P3' }));
        setQueue(mapped);
      });
    }).subscribe();
    return ()=>{ (sb as any).removeChannel(channel); };
  })(); },[]);

  const handleCheckInOnline = async (appt:any)=>{
    setIsWalkIn(false);
    const sel = { q: appt.id.replace('AP-','A'), type:'online', status:'ARRIVED', hn: appt.hn, name: appt.name, room: appt.room, apptId: appt.id, triage:'P3' };
    setSelected(sel); setQueue(q=>[{...sel,q:sel.q},...q]);
    setPatientState((p:any)=>({ ...p, hn: appt.hn, name: appt.name, apptId: appt.id, chief: appt.chief, allergies: (appt.flags||[]).join(', '), urgency:'P3' }));

    const sb = await getSupabase(); if(!sb) return;
    const { data: pat } = await sb.from('patients').select('id').eq('hn', appt.hn).maybeSingle();
    const patient_id = pat?.id;
  const { data: enc } = await sb.from('encounters').insert({ patient_id, urgency:'P3', status:'ARRIVED', created_at: new Date().toISOString() }).select('id').single();
    await sb.from('queues').insert({ encounter_id: enc!.id, queue_no: sel.q, kind:'online', status:'ARRIVED', room: appt.room, priority:3 });
  };

  const handleQuickWalkIn = async ()=>{
    setIsWalkIn(true);
    const code = nextWalkInCode(queue);
    const sel = { q: code, type:'walkin', status:'ARRIVED', hn:'', name:'', room:'Triage', apptId:null as any, triage:'P2' };
    setSelected(sel); setQueue(q=>[sel,...q]);
    setPatientState({ hn:'', name:'', phone:'', dob:'', apptId:'', chief:'', allergies:'', pmh:'', meds:'', urgency:'P2' });
    setVitals({ sys:'', dia:'', hr:'', rr:'', temp:'', spo2:'', wt:'', ht:'' });
    setNoteS(''); setNoteO(''); setNoteA('Stable'); setNoteP('ส่งต่อแพทย์');
    // จะสร้างผู้ป่วย/Encounter ในขั้นตอนส่งต่อเท่านั้น
  };

  const advanceToDoctor = async ()=>{
    const required=[patientState.urgency,vitals.sys,vitals.dia,vitals.hr,vitals.temp];

    if(isWalkIn){
      const sb = await getSupabase();
      if(sb && patientState.hn){
        const { data: exist } = await sb.from('patients').select('id').eq('hn', patientState.hn).maybeSingle();
        if(!exist && !patientState.name){ alert('Walk-in ใหม่ต้องกรอกชื่ออย่างน้อย'); return; }
      } else if(!patientState.name){ alert('Walk-in ใหม่ต้องกรอกชื่ออย่างน้อย'); return; }
    } else {
      if(!patientState.name){ alert('กรอกชื่อผู้ป่วย'); return; }
    }
    if(required.some(x=>!x)){ alert('กรอกข้อมูลสำคัญให้ครบ (Urgency, BP, HR, Temp)'); return; }

    const sb = await getSupabase();
    if(!sb){ alert('บันทึกในเครื่องแล้ว (โหมดไม่มีฐานข้อมูล)'); return; }

    let encounter_id: string | null = null;

    if(isWalkIn){
      let patient_id: string | null = null;
      if(patientState.hn){
        const { data: exist } = await sb.from('patients').select('id').eq('hn', patientState.hn).maybeSingle();
        if(exist) patient_id = exist.id;
      }
      if(!patient_id){
        const { data: pIns } = await sb.from('patients').insert({ full_name: patientState.name||'Walk-in', hn: patientState.hn||null, phone: patientState.phone||null, dob: patientState.dob||null }).select('id').single();
        patient_id = pIns?.id || null;
      }
      const { data: enc } = await sb.from('encounters').insert({ patient_id, urgency: patientState.urgency, status:'ARRIVED' }).select('id').single();
      encounter_id = enc?.id || null;
  if (!selected) { alert('กรุณาเลือกคิวก่อน'); return; }
  await sb.from('queues').insert({ encounter_id, queue_no: selected.q, kind:'walkin', status:'IN_EXAM', room:'Triage', priority: patientState.urgency==='P1'?1:patientState.urgency==='P2'?2:3 });
    } else {
  if (!selected) { alert('กรุณาเลือกคิวก่อน'); return; }
  const { data: encRow } = await sb.from('queues').select('encounter_id').eq('queue_no', selected.q).maybeSingle();
  encounter_id = encRow?.encounter_id || null;
  await sb.from('queues').update({ status: 'IN_EXAM' }).eq('queue_no', selected.q);
    }

    if(!encounter_id){ alert('ไม่พบ Encounter'); return; }

    await sb.from('triage').upsert({ encounter_id, chief_complaint: patientState.chief, allergies: patientState.allergies, medications: patientState.meds, pmh: patientState.pmh, urgency: patientState.urgency }, { onConflict: 'encounter_id' });
    const parseOrNull = (x:any)=>{ const n=parseFloat(String(x)); return isNaN(n)?null:n; };
    await sb.from('vitals').insert({ encounter_id, sys:parseOrNull(vitals.sys), dia:parseOrNull(vitals.dia), hr:parseOrNull(vitals.hr), rr:parseOrNull(vitals.rr), temp_c:parseOrNull(vitals.temp), spo2:parseOrNull(vitals.spo2), weight_kg:parseOrNull(vitals.wt), height_cm:parseOrNull(vitals.ht), bmi: bmiDerived?parseFloat(bmiDerived):null });
    await sb.from('nurse_notes').insert({ encounter_id, s:noteS, o:noteO, a:noteA, p:noteP });

    if (selected) {
      setQueue(q=> q.map(it=> it.q===selected.q ? { ...it, status:'IN_EXAM' } : it));
    }
    alert("ส่งต่อแพทย์แล้ว (สถานะ: ตรวจอยู่) คิว: "+(selected?.q||'-')+" เวลา: "+nowStr());
  };

  // เพิ่มฟังก์ชัน filter คิวแต่ละสถานะ
  const waitingForDoctorQueue = queue.filter(q => q.status === 'READY_FOR_DOCTOR');
  const inExamQueue = queue.filter(q => q.status === 'IN_EXAM');

  // เพิ่ม state สำหรับค้นหา
  const [searchText, setSearchText] = useState('');

  // ฟังก์ชันค้นหา appointments ตามรหัสบัตรประชาชนหรือชื่อ
  const filteredAppointments = useMemo(() => {
    if (!searchText.trim()) return appointments;
    const lower = searchText.trim().toLowerCase();
    return appointments.filter(a =>
      (a.hn && a.hn.toLowerCase().includes(lower)) ||
      (a.patient_name && a.patient_name.toLowerCase().includes(lower)) ||
      (a.name && a.name.toLowerCase().includes(lower)) ||
      (a.chief && a.chief.toLowerCase().includes(lower)) ||
      (a.chief_complaint && a.chief_complaint.toLowerCase().includes(lower))
    );
  }, [appointments, searchText]);

  // ฟังก์ชันสร้าง HN อัตโนมัติ (HN + running number เช่น HN0001, HN0002)
const generateHN = async () => {
  const sb = getSupabase();
  if (!sb) return '';
  // ดึง HN ล่าสุดจากฐานข้อมูล
  const { data, error } = await sb.from('patients').select('hn').order('created_at', { ascending: false }).limit(1);
  let nextNumber = 1;
  if (data && data.length > 0 && data[0].hn) {
    const match = data[0].hn.match(/HN(\d+)/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }
  // HN รูปแบบ HN + running number เช่น HN0001
  return `HN${nextNumber.toString().padStart(4, '0')}`;
};

// เมื่อผู้ใช้กรอกข้อมูลใหม่และ HN ยังไม่ถูกสร้าง ให้สร้าง HN อัตโนมัติ
useEffect(() => {
  if ((isWalkIn || !patientState.hn) && !patientState.hn) {
    generateHN().then(hn => setPatientState(p => ({ ...p, hn })));
  }
}, [isWalkIn, patientState.hn]);

  // เพิ่ม state สำหรับผู้ป่วยที่ลงทะเบียนแล้ว
const [registeredPatients, setRegisteredPatients] = useState<Patient[]>([]);
const [searchPatientText, setSearchPatientText] = useState('');
const [selectedRegisteredPatient, setSelectedRegisteredPatient] = useState<Patient | null>(null);
const [appointmentDate, setAppointmentDate] = useState('');

// โหลดข้อมูลผู้ป่วยที่ลงทะเบียนแล้ว
useEffect(() => {
  const fetchPatients = async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data, error } = await sb.from('patients').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setRegisteredPatients(
        data.map((row: any) => ({
          hn: row.hn ?? '',
          name: row.name ?? `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim(),
          phone: row.phone ?? '',
          dob: row.dob ?? '',
          apptId: '',
          chief: '',
          allergies: row.allergies ?? '',
          pmh: row.pmh ?? '',
          meds: '',
          urgency: '',
          idCard: row.id_card ?? '', // <--- สำคัญ
          prefix: row.prefix ?? '',
          firstName: row.first_name ?? '', // <--- สำคัญ
          lastName: row.last_name ?? '',  // <--- สำคัญ
          gender: row.gender ?? '',
          address: row.address ?? '',
          province: row.province ?? '',
          district: row.district ?? '',
          rights: row.rights ?? '',
          email: row.email ?? '',
          lineId: row.line_user_id ?? '',
          emergencyContact: row.emergency_contact ?? '',
          emergencyPhone: row.emergency_phone ?? '',
          additionalSymptom: '',
        }))
      );
    }
  };
  fetchPatients();
}, []);

// ฟังก์ชันค้นหาผู้ป่วยที่ลงทะเบียนแล้ว
const filteredRegisteredPatients = useMemo(() => {
  if (!searchPatientText.trim()) return registeredPatients;
  const lower = searchPatientText.trim().toLowerCase();
  return registeredPatients.filter(p =>
    (p.hn && p.hn.toLowerCase().includes(lower)) ||
    (p.idCard && p.idCard.toLowerCase().includes(lower)) ||
    (p.firstName && p.firstName.toLowerCase().includes(lower)) ||
    (p.lastName && p.lastName.toLowerCase().includes(lower)) ||
    (p.name && p.name.toLowerCase().includes(lower))
  );
}, [registeredPatients, searchPatientText]);

// ฟังก์ชันเลือกผู้ป่วยเก่าเพื่อสร้างนัดใหม่
const handleSelectRegisteredPatient = (p: Patient) => {
  setSelectedRegisteredPatient(p);
  setPatientState({
    ...patient,
    hn: p.hn,
    name: p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
    phone: p.phone,
    dob: p.dob,
    idCard: p.idCard,
    prefix: p.prefix,
    firstName: p.firstName,
    lastName: p.lastName,
    gender: p.gender,
    address: p.address,
    province: p.province,
    district: p.district,
    rights: p.rights,
    email: p.email,
    lineId: p.lineId,
    emergencyContact: p.emergencyContact,
    emergencyPhone: p.emergencyPhone,
    allergies: p.allergies,
    pmh: p.pmh,
    meds: p.meds,
    urgency: 'P3',
    apptId: '',
    chief: '',
    additionalSymptom: ''
  });
  setIsWalkIn(false);
};

// ฟังก์ชันสร้างนัดใหม่สำหรับผู้ป่วยเก่า
const handleCreateAppointmentForRegistered = async (dateStr?: string) => {
  if (!selectedRegisteredPatient) return;
  const sb = getSupabase();
  if (!sb) return;
  const apptData = {
    hn: selectedRegisteredPatient.hn,
    patient_name: selectedRegisteredPatient.name || `${selectedRegisteredPatient.firstName || ''} ${selectedRegisteredPatient.lastName || ''}`.trim(),
    scheduled_at: dateStr || new Date().toISOString(), // ใช้วันที่ที่เลือก
    chief: patient.chief,
    flags: patient.allergies ? [patient.allergies] : [],
    room: 'Triage',
    status: 'scheduled'
  };
  const { data, error } = await sb.from('appointments').insert(apptData);
  if (error) {
    alert('สร้างนัดไม่สำเร็จ: ' + error.message);
  } else {
    alert('สร้างนัดสำเร็จ!');
    setAppointments(a => [...a, apptData]);
    setSelectedRegisteredPatient(null);
    setPatientState({
      hn: '',
      name: '',
      phone: '',
      dob: '',
      apptId: '',
      chief: '',
      allergies: '',
      pmh: '',
      meds: '',
      urgency: 'P3',
      idCard: '',
      prefix: '',
      firstName: '',
      lastName: '',
      gender: '',
      address: '',
      province: '',
      district: '',
      rights: '',
      email: '',
      lineId: '',
      emergencyContact: '',
      emergencyPhone: '',
      additionalSymptom: ''
    });
  }
};

  // เมื่อเลือกผู้ป่วยเก่า walk-in
const handleWalkInOldPatient = (patient: Patient) => {
  setPatientState({
    ...patient,
    urgency: 'P3',
    apptId: '',
    chief: '',
    additionalSymptom: ''
  });
  setStep(4); // ไปกรอกอาการเบื้องต้น/วัด Vital Signs
};

// เมื่อกด "ส่งเคสไปยังหมอ"
const handleSendCase = async () => {
  // บันทึก triage/vitals ใหม่ทุกครั้ง
  const sb = getSupabase();
  if (!sb) {
    alert('เชื่อมต่อ Supabase ไม่สำเร็จ');
    return;
  }
  // สร้าง encounter ใหม่ (หรือใช้ encounter เดิมถ้ามี)
  let encounter_id = null;
  const { data: enc } = await sb.from('encounters').insert({
    patient_id: patientState.hn, // หรือ patient_id ที่ map จาก hn
    urgency: patientState.urgency,
    status: 'ARRIVED',
    created_at: new Date().toISOString()
  }).select('id').single();
  encounter_id = enc?.id;

  // บันทึก triage
  await sb.from('triage').insert({
    encounter_id,
    chief_complaint: patientState.chief,
    allergies: patientState.allergies,
    medications: patientState.meds,
    pmh: patientState.pmh,
    urgency: patientState.urgency
  });

  // บันทึก vitals
  await sb.from('vitals').insert({
    encounter_id,
    sys: vitals.sys,
    dia: vitals.dia,
    hr: vitals.hr,
    rr: vitals.rr,
    temp_c: vitals.temp,
    spo2: vitals.spo2,
    weight_kg: vitals.wt,
    height_cm: vitals.ht,
    bmi: bmiDerived ? parseFloat(bmiDerived) : null
  });

  setStep(5); // ไปหน้าส่งเคสสำเร็จ
};

  // เพิ่ม state สำหรับดื่มสุราและสูบบุหรี่
  const [drinking, setDrinking] = useState("");
  const [smoking, setSmoking] = useState("");

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col md:flex-row">
      {/* Sidebar เมนูขั้นตอน */}
      <div className="w-full md:w-14 lg:w-20 min-h-[220px] md:min-h-screen bg-white shadow-xl flex flex-col p-4 gap-2 overflow-auto text-black">
        <div className="text-xl md:text-2xl font-bold text-black mb-4 text-center">เมนูระบบคลินิก</div>
        <Button
          variant={step === 1 ? "default" : "outline"}
          className={`w-full text-black bg-gray-500 font-semibold py-3 rounded-lg ${step === 1 ? "bg-blue-500 hover:bg-blue-600" : ""}`}
          onClick={() => setStep(1)}
        >
          ลงทะเบียนผู้ป่วยใหม่
        </Button>
        <Button
          variant={step === 2 ? "default" : "outline"}
          className={`w-full text-black bg-gray-500 font-semibold py-3 rounded-lg ${step === 2 ? "bg-blue-500 hover:bg-blue-600" : ""}`}
          onClick={() => setStep(2)}
        >
          ค้นหา/เลือกผู้ป่วยเก่า
        </Button>

        <Button
          variant={step === 3 ? "default" : "outline"}
          className={`w-full text-black bg-gray-500 font-semibold py-3 rounded-lg ${step === 4 ? "bg-blue-500 hover:bg-blue-600" : ""}`}
          onClick={() => setStep(3)}
        >
          ดูรายการนัดหมาย
        </Button>
        <Button
          variant={step === 4 ? "default" : "outline"}
          className={`w-full text-black bg-gray-500 font-semibold py-3 rounded-lg ${step === 5 ? "bg-blue-500 hover:bg-blue-600" : ""}`}
          onClick={() => setStep(4)}
        >
          กรอกอาการเบื้องต้น/วัด Vital Signs
        </Button>
        <Button
          variant={step === 5 ? "default" : "outline"}
          className={`w-full text-black bg-gray-500 font-semibold py-3 rounded-lg ${step === 6 ? "bg-blue-500 hover:bg-blue-600" : ""}`}
          onClick={() => setStep(5  )}
        >
          ส่งเคสไปยังหมอ
        </Button>
      </div>
      {/* Content ฝั่งขวา */}
      <div className="flex-1 flex items-start p-0 overflow-auto">
        <Card className="w-full max-w-none shadow-2xl rounded-none bg-white">
          <CardHeader>
            <CardTitle className="text-black text-xl md:text-2xl font-bold">
              {step === 1 && "ลงทะเบียนผู้ป่วยใหม่"}
              {step === 2 && "ค้นหา/เลือกผู้ป่วยเก่า"}
              {step === 3 && "รายการนัดหมาย"}
              {step === 4 && "กรอกอาการเบื้องต้น/วัด Vital Signs"}
              {step === 5 && "ส่งเคสไปยังหมอ"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-black text-base">
            {step === 1 && (
              <PatientRegisterForm
                patient={patient}
                setPatient={setPatient}
                isWalkIn={true}
                handleRegisterPatient={() => setStep(3)}
              />
            )}
            {step === 2 && (
              <div>
                {/* ช่องค้นหา */}
                <input
                  type="text"
                  className="border text-black px-2 py-1 rounded mb-2 w-full"
                  placeholder="ค้นหาด้วย HN, ชื่อ, นามสกุล, เลขบัตรประชาชน"
                  value={searchPatientText}
                  onChange={e => setSearchPatientText(e.target.value)}
                />
                {/* รายการผู้ป่วยทั้งหมด */}
                <div className="max-h-64 overflow-auto border rounded mb-4">
                  {filteredRegisteredPatients.length === 0 && (
                    <div className="p-4 text-gray-500">ไม่พบผู้ป่วย</div>
                  )}
                  {filteredRegisteredPatients.map(p => (
                    <div
                      key={p.hn}
                      className={`p-2 cursor-pointer hover:bg-blue-50 ${selectedRegisteredPatient?.hn === p.hn ? "bg-blue-100" : ""}`}
                      onClick={() => handleSelectRegisteredPatient(p)}
                    >
                      <div className="font-bold text-black">{p.name || `${p.firstName || ""} ${p.lastName || ""}`.trim()}</div>
                      <div className="text-xs text-gray-600">
                        HN: {p.hn} | เลขบัตร: {p.idCard} | เบอร์โทร: {p.phone} | วันเกิด: {p.dob} | เพศ: {p.gender} | สิทธิ: {p.rights}
                      </div>
                    </div>
                  ))}
                </div>
                {/* แสดงข้อมูลผู้ป่วยที่เลือก */}
                {selectedRegisteredPatient && (
                  <div className="bg-gray-100 text-black rounded-lg shadow p-4 mb-4">
                    <div className="font-bold text-lg mb-2 text-black">
                      {selectedRegisteredPatient.name || `${selectedRegisteredPatient.firstName || ""} ${selectedRegisteredPatient.lastName || ""}`.trim()}
                    </div>
                    <div className="text-black">HN: {selectedRegisteredPatient.hn}</div>
                    <div className="text-black">เลขบัตรประชาชน: {selectedRegisteredPatient.idCard}</div>
                    <div className="text-black">ชื่อ: {selectedRegisteredPatient.firstName} {selectedRegisteredPatient.lastName}</div>
                    <div className="text-black">เพศ: {selectedRegisteredPatient.gender}</div>
                    <div className="text-black">วันเกิด: {selectedRegisteredPatient.dob}</div>
                    <div className="text-black">เพศ: {selectedRegisteredPatient.gender}</div>
                    <div className="text-black">เบอร์โทร: {selectedRegisteredPatient.phone}</div>
                    <div className="text-black">สิทธิการรักษา: {selectedRegisteredPatient.rights}</div>
                    <div className="text-black">ที่อยู่: {selectedRegisteredPatient.address}</div>
                    <div className="text-black">จังหวัด: {selectedRegisteredPatient.province}</div>
                    <div className="text-black">อำเภอ: {selectedRegisteredPatient.district}</div>
                    <div className="text-black">อีเมล: {selectedRegisteredPatient.email}</div>
                    <div className="text-black">Line ID: {selectedRegisteredPatient.lineId}</div>
                    <div className="text-black font-bold mt-2">ผู้ติดต่อฉุกเฉิน: {selectedRegisteredPatient.emergencyContact}</div>
                    <div className="text-black">เบอร์ฉุกเฉิน: {selectedRegisteredPatient.emergencyPhone}</div>
                    <div className="text-black font-bold mt-2">โรคประจำตัว: <span className="font-normal">{selectedRegisteredPatient.pmh}</span></div>
                    <div className="text-black font-bold mt-2">แพ้ยา: <span className="font-normal">{selectedRegisteredPatient.allergies}</span></div>
                    {/* ปุ่มสร้างนัดหมาย */}
                    <div className="mt-4">
                      <label className="block text-black mb-1">วันและเวลานัดหมาย</label>
                      <input
                        type="datetime-local"
                        className="border px-2 py-1 rounded w-full text-black"
                        value={appointmentDate}
                        onChange={e => setAppointmentDate(e.target.value)}
                      />
                    </div>
                    <button
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded mr-2"
                      onClick={() => handleCreateAppointmentForRegistered(appointmentDate)}
                    >
                      สร้างนัดหมาย
                    </button>
                    {/* ปุ่ม walk-in */}
                    <button
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                      onClick={() => handleWalkInOldPatient(selectedRegisteredPatient)}
                    >
                      Walk-in และตรวจอาการเบื้องต้น
                    </button>
                  </div>
                )}
              </div>
            )}
            {step === 3 && (
              <AppointmentList
                appointments={filteredAppointments.map((a, idx) => ({
      ...a,
      queueNo: idx + 1,
    }))}
                searchText={searchText}
                setSearchText={setSearchText}
                handleCheckInOnline={appt => {
                  setSelectedAppointment(appt);
                  setStep(5);
                }}
                handleRemoveQueue={handleRemoveQueue}      // <--- เพิ่มตรงนี้
    handleSkipQueue={handleSkipQueue}          // <--- เพิ่มตรงนี้
              />
            )}
            {step === 4 && (
              <TriageForm
                patient={patientState}
                setPatient={setPatientState}
                vitals={vitals}
                setVitals={setVitals}
                bmiDerived={bmiDerived}
                flags={flags}
                noteS={noteS}
                setNoteS={setNoteS}
                noteO={noteO}
                setNoteO={setNoteO}
                noteA={noteA}
                setNoteA={setNoteA}
                noteP={noteP}
                setNoteP={setNoteP}
                handleSaveVitals={handleSendCase}
                selected={selected}
                clientTime={clientTime}
                handleQuickWalkIn={handleQuickWalkIn}
                advanceToDoctor={handleSendCase}
                drinking={drinking}
                setDrinking={setDrinking}
                smoking={smoking}
                setSmoking={setSmoking}
              />
            )}
            {step === 5 && (
              <>
                <div className="text-green-600 text-center my-8 text-xl font-bold">ส่งเคสสำเร็จ!</div>
                <Button className="w-full text-black font-semibold py-3 rounded-lg" onClick={() => setStep(1)}>
                  กลับสู่หน้าหลัก
                </Button>
              </>
            )}

            {/* แสดงคิวที่รอหมอรับ */}
            <div className="mb-6">
              <div className="font-bold text-lg mb-2 text-blue-700">คิวที่รอหมอรับ</div>
              {waitingForDoctorQueue.length === 0 ? (
                <div className="text-gray-500">ไม่มีคิวที่รอหมอรับ</div>
              ) : (
                <div className="space-y-2">
                  {waitingForDoctorQueue.map((q, idx) => (
                    <div key={q.q} className="p-2 border rounded bg-blue-50 flex justify-between items-center">
                      <div>
                        <div className="font-bold">คิวที่ {q.q}</div>
                        <div>ชื่อ: {q.name || '-'}</div>
                        <div>HN: {q.hn || '-'}</div>
                        <div>ประเภท: {q.type}</div>
                        <div>ห้อง: {q.room}</div>
                      </div>
                      <div className="text-blue-600 font-bold">รอหมอรับ</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* แสดงคิวที่หมอกำลังรับอยู่ */}
            <div className="mb-6">
              <div className="font-bold text-lg mb-2 text-green-700">คิวที่หมอกำลังรับอยู่</div>
              {inExamQueue.length === 0 ? (
                <div className="text-gray-500">ไม่มีคิวที่หมอกำลังรับอยู่</div>
              ) : (
                <div className="space-y-2">
                  {inExamQueue.map((q, idx) => (
                    <div key={q.q} className="p-2 border rounded bg-green-50 flex justify-between items-center">
                      <div>
                        <div className="font-bold">คิวที่ {q.q}</div>
                        <div>ชื่อ: {q.name || '-'}</div>
                        <div>HN: {q.hn || '-'}</div>
                        <div>ประเภท: {q.type}</div>
                        <div>ห้อง: {q.room}</div>
                      </div>
                      <div className="text-green-600 font-bold">หมอกำลังรับ</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}