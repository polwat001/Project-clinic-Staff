"use client";

import React, { useMemo, useState, useEffect } from "react";
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
// ...existing imports...
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  ChevronRight, UserPlus, ScanLine, Activity, Stethoscope, ClipboardPlus,
  Users, Clock, Thermometer, Gauge, AlertTriangle, Search, CalendarDays
} from "lucide-react";

const pad = (n: number) => n.toString().padStart(2, "0");
// ...existing code...
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

async function getSupabase(){
  try{
    const url = (typeof process!=='undefined'&& (process as any).env?.NEXT_PUBLIC_SUPABASE_URL) || (typeof window!=='undefined'&& (window as any).SUPABASE_URL);
    const key = (typeof process!=='undefined'&& (process as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || (typeof window!=='undefined'&& (window as any).SUPABASE_ANON_KEY);
    if(!url || !key) return null;
    const SUPABASE_ESM = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
    const { createClient } = await import(SUPABASE_ESM);
    return createClient(url, key);
  }catch(e){ console.warn('Supabase unavailable', e); return null; }
}

function SelfTest({ queue }: { queue: any[] }){
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

export default function NurseConsole(){
  // ...existing state declarations...
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
  const [patient,setPatient]=useState<Patient>({
    hn:'', name:'', phone:'', dob:'', apptId:'',
    chief:'', allergies:'', pmh:'', meds:'', urgency:'P3',
    idCard:'', prefix:'', firstName:'', lastName:'', gender:'', address:'', province:'', district:'', rights:'', email:'', lineId:'', emergencyContact:'', emergencyPhone:'', additionalSymptom:''
  });

  // โหลดข้อมูล vital signs จาก Supabase เมื่อกรอก HN
  useEffect(() => {
    const fetchVitals = async () => {
      if (!patient.hn) return;
      try {
        const sb = await getSupabase();
        if (!sb) return;
        const { data, error } = await sb.from('vitals').select('*').eq('hn', patient.hn).order('id', { ascending: false }).limit(1);
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
  }, [patient.hn]);
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
      hn: patient.hn,
      name: patient.name
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

  // รีเฟรชคิวจากฐานข้อมูล
  const handleRefreshQueue = async () => {
    const sb = await getSupabase();
    if(sb) {
      const { data } = await sb.from('queues').select('*');
      if(data) setQueue(data);
    }
  };
  // ลบคิว
  const handleRemoveQueue = async (qItem:any) => {
    setQueue(queue.filter(q => q.q !== qItem.q));
    if(selected?.q === qItem.q) setSelected(queue[0] || null);
    const sb = await getSupabase();
    if(sb) await sb.from('queues').delete().eq('queue_no', qItem.q);
  };

  // ข้ามคิว (เปลี่ยนสถานะเป็น SKIPPED)
  const handleSkipQueue = async (qItem:any) => {
    setQueue(queue.map(q => q.q === qItem.q ? { ...q, status: 'SKIPPED' } : q));
    const sb = await getSupabase();
    if(sb) await sb.from('queues').update({ status: 'SKIPPED' }).eq('queue_no', qItem.q);
  };
  // ...existing code...
 
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
    setPatient((p:any)=>({ ...p, hn: appt.hn, name: appt.name, apptId: appt.id, chief: appt.chief, allergies: (appt.flags||[]).join(', '), urgency:'P3' }));

    const sb = await getSupabase(); if(!sb) return;
    const { data: pat } = await sb.from('patients').select('id').eq('hn', appt.hn).maybeSingle();
    const patient_id = pat?.id;
    const { data: enc } = await sb.from('encounters').insert({ patient_id, urgency:'P3', status:'ARRIVED' }).select('id').single();
    await sb.from('queues').insert({ encounter_id: enc!.id, queue_no: sel.q, kind:'online', status:'ARRIVED', room: appt.room, priority:3 });
  };

  const handleQuickWalkIn = async ()=>{
    setIsWalkIn(true);
    const code = nextWalkInCode(queue);
    const sel = { q: code, type:'walkin', status:'ARRIVED', hn:'', name:'', room:'Triage', apptId:null as any, triage:'P2' };
    setSelected(sel); setQueue(q=>[sel,...q]);
    setPatient({ hn:'', name:'', phone:'', dob:'', apptId:'', chief:'', allergies:'', pmh:'', meds:'', urgency:'P2' });
    setVitals({ sys:'', dia:'', hr:'', rr:'', temp:'', spo2:'', wt:'', ht:'' });
    setNoteS(''); setNoteO(''); setNoteA('Stable'); setNoteP('ส่งต่อแพทย์');
    // จะสร้างผู้ป่วย/Encounter ในขั้นตอนส่งต่อเท่านั้น
  };

  const advanceToDoctor = async ()=>{
    const required=[patient.urgency,vitals.sys,vitals.dia,vitals.hr,vitals.temp];

    if(isWalkIn){
      const sb = await getSupabase();
      if(sb && patient.hn){
        const { data: exist } = await sb.from('patients').select('id').eq('hn', patient.hn).maybeSingle();
        if(!exist && !patient.name){ alert('Walk-in ใหม่ต้องกรอกชื่ออย่างน้อย'); return; }
      } else if(!patient.name){ alert('Walk-in ใหม่ต้องกรอกชื่ออย่างน้อย'); return; }
    } else {
      if(!patient.name){ alert('กรอกชื่อผู้ป่วย'); return; }
    }
    if(required.some(x=>!x)){ alert('กรอกข้อมูลสำคัญให้ครบ (Urgency, BP, HR, Temp)'); return; }

    const sb = await getSupabase();
    if(!sb){ alert('บันทึกในเครื่องแล้ว (โหมดไม่มีฐานข้อมูล)'); return; }

    let encounter_id: string | null = null;

    if(isWalkIn){
      let patient_id: string | null = null;
      if(patient.hn){
        const { data: exist } = await sb.from('patients').select('id').eq('hn', patient.hn).maybeSingle();
        if(exist) patient_id = exist.id;
      }
      if(!patient_id){
        const { data: pIns } = await sb.from('patients').insert({ full_name: patient.name||'Walk-in', hn: patient.hn||null, phone: patient.phone||null, dob: patient.dob||null }).select('id').single();
        patient_id = pIns?.id || null;
      }
      const { data: enc } = await sb.from('encounters').insert({ patient_id, urgency: patient.urgency, status:'ARRIVED' }).select('id').single();
      encounter_id = enc?.id || null;
  if (!selected) { alert('กรุณาเลือกคิวก่อน'); return; }
  await sb.from('queues').insert({ encounter_id, queue_no: selected.q, kind:'walkin', status:'IN_EXAM', room:'Triage', priority: patient.urgency==='P1'?1:patient.urgency==='P2'?2:3 });
    } else {
  if (!selected) { alert('กรุณาเลือกคิวก่อน'); return; }
  const { data: encRow } = await sb.from('queues').select('encounter_id').eq('queue_no', selected.q).maybeSingle();
  encounter_id = encRow?.encounter_id || null;
  await sb.from('queues').update({ status: 'IN_EXAM' }).eq('queue_no', selected.q);
    }

    if(!encounter_id){ alert('ไม่พบ Encounter'); return; }

    await sb.from('triage').upsert({ encounter_id, chief_complaint: patient.chief, allergies: patient.allergies, medications: patient.meds, pmh: patient.pmh, urgency: patient.urgency }, { onConflict: 'encounter_id' });
    const parseOrNull = (x:any)=>{ const n=parseFloat(String(x)); return isNaN(n)?null:n; };
    await sb.from('vitals').insert({ encounter_id, sys:parseOrNull(vitals.sys), dia:parseOrNull(vitals.dia), hr:parseOrNull(vitals.hr), rr:parseOrNull(vitals.rr), temp_c:parseOrNull(vitals.temp), spo2:parseOrNull(vitals.spo2), weight_kg:parseOrNull(vitals.wt), height_cm:parseOrNull(vitals.ht), bmi: bmiDerived?parseFloat(bmiDerived):null });
    await sb.from('nurse_notes').insert({ encounter_id, s:noteS, o:noteO, a:noteA, p:noteP });

    if (selected) {
      setQueue(q=> q.map(it=> it.q===selected.q ? { ...it, status:'IN_EXAM' } : it));
    }
    alert("ส่งต่อแพทย์แล้ว (สถานะ: ตรวจอยู่) คิว: "+(selected?.q||'-')+" เวลา: "+nowStr());
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-6 w-6" />
          <h1 className="text-2xl text-black font-semibold">Nurse Console</h1>
          <Badge className="ml-2 text-black rounded-xl" variant="secondary">Walk-in & Online</Badge>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span className="text-sm text-black">วันนี้</span></div>
          <div className="flex items-center gap-2"><span className="text-sm text-black">Walk-in</span><Switch checked={isWalkIn} onCheckedChange={setIsWalkIn} /><span className="text-sm">Online</span></div>
          <Button className="bg-green-100 text-green-800" onClick={handleRefreshQueue}>รีเฟรชคิว</Button>
          <Button className="bg-blue-100 text-blue-800" onClick={handleExportQueue}>Export ข้อมูลคิว</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-1 text-black space-y-5">
          <Card className="shadow-sm"><CardHeader><CardTitle><span className="flex items-center text-black gap-2"><Users className="h-5 w-5 "/> รายการนัดวันนี้ (Online)</span></CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3"><Input placeholder="ค้นหา HN/ชื่อ/อาการ" /><Button><Search className="h-4 w-4"/></Button></div>
              <div className="space-y-2">
                {appointments.map((a)=> (
                  <div key={a.id + '-' + a.hn} className="flex items-center justify-between rounded-xl border p-3 hover:bg-gray-50">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-sm text-black"><Badge variant="outline" className="rounded-xl">{a.scheduled_at?.slice(11,16) ?? '-'}</Badge><span className="font-medium text-black">{a.patient_name ?? a.name}</span><span className="text-black">({a.hn})</span></div>
                      <div className="text-xs text-black mt-1">CC: {a.chief ?? a.chief_complaint}</div>
                      {a.flags && <div className="flex gap-2 mt-1">{Array.isArray(a.flags) ? a.flags.map((f:string,i:number)=> (<Badge key={i} variant="destructive" className="rounded-xl">{f}</Badge>)) : null}</div>}
                    </div>
                    <Button onClick={()=>handleCheckInOnline(a)}>เช็คอิน <ChevronRight className="ml-1 h-4 w-4"/></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm"><CardHeader><CardTitle><span className="flex items-center text-black gap-2"><Clock className="h-5 w-5"/> Queue Board</span></CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {queue.map((q)=> (
                  <div key={q.q + '-' + (q.hn || '') + '-' + (q.type || '')} className={`flex items-center justify-between rounded-xl border p-3 ${selected?.q===q.q?'ring-2 ring-blue-500':''}`}>
                    <div className="flex items-center gap-3">
                      <Badge className="rounded-xl" variant={q.type==='walkin'?'default':'secondary'}>{q.q}</Badge>
                      <div className="text-sm">
                        <div className="font-medium text-black">{q.name} <span className="text-black">({q.hn||'-'})</span></div>
                        <div className="text-xs text-black">{q.type==='walkin'?'Walk-in':'Online'} · {STATUS_LABELS[q.status]||q.status} · {q.room}</div>
                      </div>
                      <Badge variant={q.triage==='P1'?'destructive':q.triage==='P2'?'default':'outline'} className="rounded-xl">{q.triage}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={()=>{ setSelected(q); setIsWalkIn(q.type==='walkin'); }}>เลือก</Button>
                      <Button className="bg-yellow-100 text-yellow-800" onClick={()=>handleSkipQueue(q)}>ข้ามคิว</Button>
                      <Button className="bg-red-100 text-red-800" onClick={()=>handleRemoveQueue(q)}>ลบ</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <SelfTest queue={queue}/>
        </div>

        <div className="xl:col-span-2 space-y-6">
          {/* ข้อมูลผู้ใช้ */}
          <Card className="shadow-md text-black">
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5"/>
                  {isWalkIn || !patient.hn ? 'ลงทะเบียนผู้ป่วยใหม่' : 'เช็คอินผู้ป่วยเก่า'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isWalkIn || !patient.hn ? (
                <div className="grid text-black grid-cols-1 md:grid-cols-2 gap-4">
                  {/* New Patient Registration Form */}
                  <div><Label>HN (สร้างอัตโนมัติ)</Label><Input value={patient.hn} readOnly placeholder="Auto-generated"/></div>
                  <div><Label>เลขบัตรประชาชน / Passport / ID</Label><Input value={patient.idCard||''} onChange={e=>setPatient({...patient, idCard:e.target.value})} placeholder="เลขบัตรประชาชน หรือ Passport"/></div>
                  <div><Label>คำนำหน้า</Label><Input value={patient.prefix||''} onChange={e=>setPatient({...patient, prefix:e.target.value})} placeholder="นาย/นาง/นางสาว"/></div>
                  <div><Label>ชื่อ</Label><Input value={patient.firstName||''} onChange={e=>setPatient({...patient, firstName:e.target.value})} placeholder="ชื่อ"/></div>
                  <div><Label>นามสกุล</Label><Input value={patient.lastName||''} onChange={e=>setPatient({...patient, lastName:e.target.value})} placeholder="นามสกุล"/></div>
                  <div><Label>วันเดือนปีเกิด</Label><Input type="date" value={patient.dob} onChange={e=>setPatient({...patient, dob:e.target.value})}/></div>
                  <div><Label>อายุ (คำนวณอัตโนมัติ)</Label><Input value={patient.dob ? `${Math.floor((new Date().getTime()-new Date(patient.dob).getTime())/31556952000)}` : ''} readOnly placeholder="Auto"/></div>
                  <div><Label>เพศ</Label>
                    <Select value={patient.gender||''} onValueChange={v=>setPatient({...patient, gender:v})}>
                      <SelectItem value="male">ชาย</SelectItem>
                      <SelectItem value="female">หญิง</SelectItem>
                      <SelectItem value="other">อื่น ๆ</SelectItem>
                    </Select>
                  </div>
                  <div><Label>เบอร์โทรศัพท์</Label><Input value={patient.phone} onChange={e=>setPatient({...patient, phone:e.target.value})} placeholder="081-xxx-xxxx"/></div>
                  <div><Label>ที่อยู่</Label><Input value={patient.address||''} onChange={e=>setPatient({...patient, address:e.target.value})} placeholder="ที่อยู่"/></div>
                  <div><Label>จังหวัด</Label><Input value={patient.province||''} onChange={e=>setPatient({...patient, province:e.target.value})} placeholder="จังหวัด"/></div>
                  <div><Label>เขต/อำเภอ</Label><Input value={patient.district||''} onChange={e=>setPatient({...patient, district:e.target.value})} placeholder="เขต/อำเภอ"/></div>
                  <div><Label>สิทธิการรักษา</Label>
                    <Select value={patient.rights||''} onValueChange={v=>setPatient({...patient, rights:v})}>
                      <SelectItem value="cash">เงินสด</SelectItem>
                      <SelectItem value="social">ประกันสังคม</SelectItem>
                      <SelectItem value="private">ประกันเอกชน</SelectItem>
                    </Select>
                  </div>
                  <div><Label>อีเมล</Label><Input value={patient.email||''} onChange={e=>setPatient({...patient, email:e.target.value})} placeholder="อีเมล"/></div>
                  <div><Label>LINE ID</Label><Input value={patient.lineId||''} onChange={e=>setPatient({...patient, lineId:e.target.value})} placeholder="LINE ID"/></div>
                  <div><Label>ประวัติแพ้ยา</Label><Input value={patient.allergies} onChange={e=>setPatient({...patient, allergies:e.target.value})} placeholder="แพ้ยา"/></div>
                  <div><Label>โรคประจำตัว</Label><Input value={patient.pmh} onChange={e=>setPatient({...patient, pmh:e.target.value})} placeholder="โรคประจำตัว"/></div>
                  <div><Label>ผู้ติดต่อกรณีฉุกเฉิน</Label><Input value={patient.emergencyContact||''} onChange={e=>setPatient({...patient, emergencyContact:e.target.value})} placeholder="ชื่อผู้ติดต่อ"/></div>
                  <div><Label>เบอร์โทรผู้ติดต่อฉุกเฉิน</Label><Input value={patient.emergencyPhone||''} onChange={e=>setPatient({...patient, emergencyPhone:e.target.value})} placeholder="เบอร์โทรผู้ติดต่อ"/></div>
                </div>
              ) : (
                <div className="grid text-black grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Existing Patient Check-in Form */}
                  <div><Label>HN</Label><Input value={patient.hn} readOnly/></div>
                  <div><Label>ชื่อ-นามสกุล</Label><Input value={patient.name} readOnly/></div>
                  <div><Label>เบอร์โทร</Label><Input value={patient.phone} readOnly/></div>
                  <div><Label>เหตุผลการมาพบแพทย์ / Chief Complaint</Label><Input value={patient.chief} onChange={e=>setPatient({...patient, chief:e.target.value})} placeholder="เช่น ไอ/เจ็บคอ/มีไข้"/></div>
                  <div><Label>อาการสำคัญเพิ่มเติม</Label><Input value={patient.additionalSymptom||''} onChange={e=>setPatient({...patient, additionalSymptom:e.target.value})} placeholder="อาการเพิ่มเติม"/></div>
                  <div><Label>อัปเดตแพ้ยา</Label><Input value={patient.allergies} onChange={e=>setPatient({...patient, allergies:e.target.value})} placeholder="แพ้ยา (ถ้ามีการเปลี่ยนแปลง)"/></div>
                  <div><Label>อัปเดตโรคประจำตัว</Label><Input value={patient.pmh} onChange={e=>setPatient({...patient, pmh:e.target.value})} placeholder="โรคประจำตัว (ถ้ามีการเปลี่ยนแปลง)"/></div>
                  <div><Label>สิทธิการรักษา</Label>
                    <Select value={patient.rights||''} onValueChange={v=>setPatient({...patient, rights:v})}>
                      <SelectItem value="cash">เงินสด</SelectItem>
                      <SelectItem value="social">ประกันสังคม</SelectItem>
                      <SelectItem value="private">ประกันเอกชน</SelectItem>
                    </Select>
                  </div>
                  <div><Label>วิธีมา</Label>
                    <Select value={isWalkIn ? 'walkin' : 'online'} onValueChange={v=>setIsWalkIn(v==='walkin')}>
                      <SelectItem value="walkin">Walk-in</SelectItem>
                      <SelectItem value="online">Online Appointment</SelectItem>
                    </Select>
                  </div>
                  <div><Label>เวลานัด (ถ้ามี)</Label><Input value={patient.apptId} readOnly placeholder="AP-xxxx"/></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ตรวจเบื้องต้น */}
          <Card className="shadow-md text-black">
            <CardHeader><CardTitle><span className="flex items-center gap-2"><ClipboardPlus className="h-5 w-5"/> ฟอร์มตรวจเบื้องต้น</span></CardTitle></CardHeader>
            <CardContent>
              <Tabs defaultValue="triage" className="w-full">
                <TabsList className="grid text-black grid-cols-3">
                  <TabsTrigger value="triage" className="rounded-xl">คัดกรอง</TabsTrigger>
                  <TabsTrigger value="vitals" className="rounded-xl">Vital Signs</TabsTrigger>
                  <TabsTrigger value="note" className="rounded-xl">Nurse Note</TabsTrigger>
                </TabsList>

                <TabsContent value="triage" className="mt-4">
                  <div className="grid text-black grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Chief Complaint (อาการนำ)</Label><Input value={patient.chief} onChange={(e)=>setPatient({...patient,chief:e.target.value})} placeholder="เช่น ไอ/เจ็บคอ/มีไข้"/></div>
                    <div><Label>ระดับความเร่งด่วน (Urgency)</Label>
                      <Select value={patient.urgency} onValueChange={(v)=>setPatient({...patient,urgency:v})}>
                        <SelectItem value="P1">P1 (ฉุกเฉิน)</SelectItem>
                        <SelectItem value="P2">P2 (เร่งด่วน)</SelectItem>
                        <SelectItem value="P3">P3 (ทั่วไป)</SelectItem>
                      </Select>
                    </div>
                    <div><Label>Allergies (แพ้ยา/อาหาร)</Label><Input value={patient.allergies} onChange={(e)=>setPatient({...patient,allergies:e.target.value})} placeholder="เช่น Penicillin"/></div>
                    <div><Label>Current Medications (ยาที่ใช้ประจำ)</Label><Input value={patient.meds} onChange={(e)=>setPatient({...patient,meds:e.target.value})} placeholder="ชื่อยา/ขนาดยา"/></div>
                    <div className="md:col-span-2"><Label>Past Medical History (โรคประจำตัว)</Label><Input value={patient.pmh} onChange={(e)=>setPatient({...patient,pmh:e.target.value})} placeholder="DM/HT/CKD/หอบหืด ฯลฯ"/></div>
                  </div>
                </TabsContent>

                <TabsContent value="vitals" className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><Label>BP Sys</Label><div className="flex items-center gap-2"><Input value={vitals.sys} onChange={(e)=>setVitals({...vitals,sys:e.target.value})} inputMode="numeric" placeholder="เช่น 120"/><Gauge className="h-4 w-4"/></div></div>
                    <div><Label>BP Dia</Label><Input value={vitals.dia} onChange={(e)=>setVitals({...vitals,dia:e.target.value})} inputMode="numeric" placeholder="เช่น 80"/></div>
                    <div><Label>Pulse (bpm)</Label><Input value={vitals.hr} onChange={(e)=>setVitals({...vitals,hr:e.target.value})} inputMode="numeric" placeholder="เช่น 80"/></div>
                    <div><Label>Resp (/min)</Label><Input value={vitals.rr} onChange={(e)=>setVitals({...vitals,rr:e.target.value})} inputMode="numeric" placeholder="เช่น 18"/></div>
                    <div><Label>Temp (°C)</Label><div className="flex items-center gap-2"><Input value={vitals.temp} onChange={(e)=>setVitals({...vitals,temp:e.target.value})} inputMode="numeric" placeholder="เช่น 36.7"/><Thermometer className="h-4 w-4"/></div></div>
                    <div><Label>SpO₂ (%)</Label><div className="flex items-center gap-2"><Input value={vitals.spo2} onChange={(e)=>setVitals({...vitals,spo2:e.target.value})} inputMode="numeric" placeholder="เช่น 98"/><Activity className="h-4 w-4"/></div></div>
                    <div><Label>Weight (kg)</Label><Input value={vitals.wt} onChange={(e)=>setVitals({...vitals,wt:e.target.value})} inputMode="numeric" placeholder="เช่น 72"/></div>
                    <div><Label>Height (cm)</Label><Input value={vitals.ht} onChange={(e)=>setVitals({...vitals,ht:e.target.value})} inputMode="numeric" placeholder="เช่น 173"/></div>
                    <div><Label>BMI (auto)</Label><Input value={bmiDerived} readOnly/></div>
                  </div>
                  <div className="mt-4">
                    <Button className="bg-green-600 text-white" onClick={handleSaveVitals}>บันทึกข้อมูล Vital Signs ไป Supabase</Button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <RangeFlag label="SYS" value={vitals.sys?parseFloat(vitals.sys):''} range={ranges.bpSys}/>
                    <RangeFlag label="DIA" value={vitals.dia?parseFloat(vitals.dia):''} range={ranges.bpDia}/>
                    <RangeFlag label="HR" value={vitals.hr?parseFloat(vitals.hr):''} range={ranges.hr}/>
                    <RangeFlag label="RR" value={vitals.rr?parseFloat(vitals.rr):''} range={ranges.rr}/>
                    <RangeFlag label="TEMP" value={vitals.temp?parseFloat(vitals.temp):''} range={ranges.temp}/>
                    <RangeFlag label="SpO₂" value={vitals.spo2?parseFloat(vitals.spo2):''} range={ranges.spo2}/>
                    <RangeFlag label="BMI" value={bmiDerived?parseFloat(bmiDerived):''} range={ranges.bmi}/>
                  </div>

                  {flags.length>0 && (
                    <Alert className="mt-4 border-red-300"><AlertTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4"/> พบค่าวัดผิดเกณฑ์</AlertTitle><AlertDescription className="text-sm">{flags.join(' · ')}</AlertDescription></Alert>
                  )}
                </TabsContent>

                <TabsContent value="note" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label>S — Subjective</Label>
                      <Textarea rows={4} value={noteS} onChange={(e)=>setNoteS(e.target.value)} placeholder="เช่น ไอแห้ง 2 วัน"/>
                      <Label>O — Objective</Label>
                      <Textarea rows={4} value={noteO} onChange={(e)=>setNoteO(e.target.value)} placeholder={`BP ${vitals.sys||'-'}/${vitals.dia||'-'}, HR ${vitals.hr||'-'}, Temp ${vitals.temp||'-'}`}/>
                    </div>
                    <div className="space-y-3">
                      <Label>A — Assessment</Label>
                      <Select value={noteA} onValueChange={setNoteA}>
                        <SelectItem value="Stable">Stable</SelectItem>
                        <SelectItem value="Need Doctor Now">Need Doctor Now</SelectItem>
                        <SelectItem value="Observation">Observation</SelectItem>
                      </Select>
                      <Label>P — Plan</Label>
                      <Textarea rows={6} value={noteP} onChange={(e)=>setNoteP(e.target.value)} placeholder="ส่งต่อแพทย์ / สั่ง Lab"/>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-6"/>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-black"><ScanLine className="h-4 w-4"/> คิวปัจจุบัน: <span className="font-medium text-black">{selected?.q||'-'}</span><span className="mx-2">•</span><span className="text-black">อัปเดต: {clientTime}</span></div>
                <div className="flex items-center gap-2">
                  <Button className="bg-gray-200 text-gray-800" onClick={handleQuickWalkIn}><UserPlus className="h-4 w-4 mr-1"/> Walk-in ใหม่</Button>
                  <Button className="bg-blue-600 text-white" onClick={advanceToDoctor}><ChevronRight className="h-4 w-4 mr-1"/> ส่งต่อแพทย์</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  <div className="mt-6 text-xs text-black"><p>Tab = สลับส่วนฟอร์ม • Ctrl/⌘+K = โฟกัสค้นหา • Enter = บันทึกฟิลด์</p></div>
    </div>
  );
}
