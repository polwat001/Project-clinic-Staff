"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NurseTriageForm() {
  const router = useRouter();
  const [triage, setTriage] = useState({
    chief: "",
    allergies: "",
    pmh: "",
    meds: "",
    urgency: "P3"
  });
  const [vitals, setVitals] = useState({ sys: "", dia: "", hr: "", temp: "" });
  const [note, setNote] = useState("");

  const handleSendToDoctor = async () => {
    if (!triage.chief || !vitals.sys || !vitals.dia || !vitals.hr || !vitals.temp) {
      alert("กรอกข้อมูลสำคัญให้ครบ");
      return;
    }
    // ...บันทึกข้อมูลลง supabase...
    alert("ส่งต่อแพทย์สำเร็จ!");
    router.push("/queue");
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl border p-8 shadow">
      <h2 className="text-xl font-bold mb-6">ตรวจเบื้องต้น/ส่งต่อแพทย์</h2>
      <form className="space-y-4">
        <div><label className="block mb-1 font-semibold">Chief Complaint</label><input value={triage.chief} onChange={e => setTriage({ ...triage, chief: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
        <div><label className="block mb-1 font-semibold">Allergies</label><input value={triage.allergies} onChange={e => setTriage({ ...triage, allergies: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
        <div><label className="block mb-1 font-semibold">Medications</label><input value={triage.meds} onChange={e => setTriage({ ...triage, meds: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
        <div><label className="block mb-1 font-semibold">PMH</label><input value={triage.pmh} onChange={e => setTriage({ ...triage, pmh: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
        <div><label className="block mb-1 font-semibold">Urgency</label>
          <select value={triage.urgency} onChange={e => setTriage({ ...triage, urgency: e.target.value })} className="border rounded px-3 py-2 w-full">
            <option value="P1">P1 (ฉุกเฉิน)</option>
            <option value="P2">P2 (เร่งด่วน)</option>
            <option value="P3">P3 (ทั่วไป)</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block mb-1 font-semibold">BP Sys</label><input value={vitals.sys} onChange={e => setVitals({ ...vitals, sys: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
          <div><label className="block mb-1 font-semibold">BP Dia</label><input value={vitals.dia} onChange={e => setVitals({ ...vitals, dia: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
          <div><label className="block mb-1 font-semibold">HR</label><input value={vitals.hr} onChange={e => setVitals({ ...vitals, hr: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
          <div><label className="block mb-1 font-semibold">Temp</label><input value={vitals.temp} onChange={e => setVitals({ ...vitals, temp: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
        </div>
        <div><label className="block mb-1 font-semibold">Note</label><textarea value={note} onChange={e => setNote(e.target.value)} className="border rounded px-3 py-2 w-full" /></div>
        <button type="button" className="bg-blue-600 text-white w-full px-4 py-2 rounded font-bold mt-4" onClick={handleSendToDoctor}>
          ส่งต่อแพทย์
        </button>
      </form>
    </div>
  );
}