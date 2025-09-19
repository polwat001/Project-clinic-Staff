// lib/types.ts

// ----------------- Patients -----------------
export type Patient = {
  id: string;

  // จากสคีมา Supabase จริงของคุณ
  hn: string | null;
  id_card?: string | null;
  prefix?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  gender?: string | null;        // ตรงกับคอลัมน์ใน DB
  dob: string | null;            // ISO date (YYYY-MM-DD)
  phone: string | null;
  address?: string | null;
  province?: string | null;
  district?: string | null;
  rights?: string | null;
  email?: string | null;
  line_id?: string | null;
  emergency_contact?: string | null;
  emergency_phone?: string | null;
  allergies?: string | null;     // คอลัมน์จริงใน DB
  pmh?: string | null;           // past medical history (คอลัมน์จริงใน DB)
  created_at?: string | null;

  // ความเข้ากันได้ย้อนหลังกับโค้ดเดิม
  name?: string | null;          // บางจุดใน UI อ้าง patient.name
  sex?: "ชาย" | "หญิง" | string | null; // ใช้คู่กับ gender ได้
  allergy?: string | null;       // alias -> allergies
  chronic?: string | null;       // alias -> pmh
};

/** ช่วยให้ UI ใช้ชื่อแบบรวมได้สะดวก (คำนวณฝั่งแอป) */
export type PatientView = Patient & {
  full_name?: string | null; // `${prefix ?? ""}${first_name ?? ""} ${last_name ?? ""}`.trim()
};

// ----------------- Visits -----------------
export type Visit = {
  id: string;
  patient_id: string;
  visit_at: string;              // ISO timestamp

  chief_complaint?: string | null;
  diagnosis?: string | null;
  plan?: string | null;
  advice?: string | null;

  // Vitals
  bp_sys?: number | null;
  bp_dia?: number | null;
  pulse?: number | null;
  temp_c?: number | null;
  rr?: number | null;
  spo2?: number | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  bmi?: number | null;

  // Extra
  ros?: string | null;
  pe?: string | null;
  icd10?: string | null;
  dept?: string | null;          // ให้ตรงฝั่ง client
  orders?: any | null;           // e.g. {cbc:true, ua:false}
  attachments?: any | null;

  // ถ้าคุณ JOIN ผู้ป่วยมาด้วยใน select('*, patient:patients(...)')
  patient?: PatientView | null;
};

// ----------------- Lab -----------------
export type LabResult = {
  id: string;
  patient_id: string;
  name: string;
  status: "pending" | "done" | string;
  result_json?: Record<string, any> | null;  // schema ใหม่
  taken_at?: string | null;
  result?: Record<string, any> | null;       // schema เก่า
  ordered_at?: string | null;
};

// ----------------- Appointment -----------------
export type Appointment = {
  id: string;
  patient_id: string;
  start_at: string;              // ISO timestamp
  note: string | null;
  reason: string | null;
  status?: string | null;        // scheduled/completed/cancelled
};

// ----------------- Prescriptions -----------------
export type Prescription = {
  id: string;
  patient_id: string;
  visit_id?: string | null;
  advice?: string | null;        // แนบคำแนะนำหมอ (Doctor note)
  created_at?: string;
};

/**
 * ✅ RxItem: รองรับทั้งแบบเดิม (sig/days) และแบบใหม่ (strength/frequency/period)
 * ➕ เพิ่มฟิลด์จำนวนยาเพื่อใช้คำนวณและแจ้งเตือนการทานยา
 */
export type RxItem = {
  drug_code: string;
  name: string;

  // แบบใหม่ (อธิบายการใช้ยาในรูปแบบข้อความ)
  strength?: string;
  frequency?: string;
  period?: string;
  note?: string | null;

  // แบบเดิม (ถ้ายังใช้อยู่)
  sig?: string;
  days?: number | null;

  // ➕ ใช้สำหรับแจ้งเตือน/คำนวณ
  qty_per_dose?: number;     // จำนวนต่อครั้ง
  doses_per_day?: number;    // ครั้งต่อวัน
  period_days?: number;      // จำนวนวัน
   // อ่านอย่างเดียว (qty_per_dose * doses_per_day * period_days)
};

export type PrescriptionItem = {
  id: string;
  prescription_id: string;
  drug_code: string;
  name: string;

  // แบบใหม่
  strength?: string | null;
  frequency?: string | null;
  period?: string | null;

  // แบบเดิม
  sig?: string | null;
  days?: number | null;

  note?: string | null;

  // ➕ จำนวนยา (สำหรับจัดจ่าย/เตือนทานยา)
  qty_per_dose?: number | null;
  doses_per_day?: number | null;
  period_days?: number | null;

  // อ่านอย่างเดียว (อาจคำนวณในแอปหรือให้ DB gen)
  total_units?: number | null;
};

/** อ่านสัญญาณชีพล่าสุด (Read-only) สำหรับโชว์ในหน้าจอ */
export type VitalsRO = {
  taken_at: string;
  bp_sys: number | null; bp_dia: number | null; pulse: number | null;
  rr: number | null; temp_c: number | null; spo2: number | null;
  height_cm: number | null; weight_kg: number | null; bmi: number | null;
  note: string | null;
};
