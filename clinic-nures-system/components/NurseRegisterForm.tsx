"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NurseRegisterForm() {
  const router = useRouter();
  const [patient, setPatient] = useState({
    hn: "",
    firstName: "",
    lastName: "",
    idCard: "",
    phone: "",
    dob: "",
    gender: "",
  });

  useEffect(() => {
    async function generateHN() {
      const { data } = await supabase
        .from("patients")
        .select("hn")
        .order("created_at", { ascending: false })
        .limit(1);
      let nextNumber = 1;
      if (data && data.length > 0 && data[0].hn) {
        const match = data[0].hn.match(/HN(\d+)/);
        if (match) nextNumber = parseInt(match[1]) + 1;
      }
      setPatient((p) => ({ ...p, hn: `HN${nextNumber.toString().padStart(4, "0")}` }));
    }
    generateHN();
  }, []);

  const handleRegister = async () => {
    if (!patient.firstName || !patient.lastName || !patient.idCard) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const { error } = await supabase.from("patients").insert({
      hn: patient.hn,
      first_name: patient.firstName,
      last_name: patient.lastName,
      id_card: patient.idCard,
      phone: patient.phone,
      dob: patient.dob,
      gender: patient.gender,
      created_at: new Date().toISOString(),
    });
    if (error) {
      alert("บันทึกข้อมูลไม่สำเร็จ: " + error.message);
    } else {
      alert("บันทึกข้อมูลผู้ป่วยใหม่สำเร็จ!");
      router.push("/triage");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl border p-8 shadow">
      <h2 className="text-xl font-bold mb-6">ลงทะเบียนผู้ป่วยใหม่</h2>
      <form className="space-y-4">
        <div><label className="block mb-1 font-semibold">HN</label><input value={patient.hn} readOnly className="border rounded px-3 py-2 w-full bg-gray-100" /></div>
        <div><label className="block mb-1 font-semibold">ชื่อ</label><input value={patient.firstName} onChange={e => setPatient({ ...patient, firstName: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
        <div><label className="block mb-1 font-semibold">นามสกุล</label><input value={patient.lastName} onChange={e => setPatient({ ...patient, lastName: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
        <div><label className="block mb-1 font-semibold">เลขบัตรประชาชน</label><input value={patient.idCard} onChange={e => setPatient({ ...patient, idCard: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
        <div><label className="block mb-1 font-semibold">เบอร์โทร</label><input value={patient.phone} onChange={e => setPatient({ ...patient, phone: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
        <div><label className="block mb-1 font-semibold">วันเกิด</label><input type="date" value={patient.dob} onChange={e => setPatient({ ...patient, dob: e.target.value })} className="border rounded px-3 py-2 w-full" /></div>
        <div><label className="block mb-1 font-semibold">เพศ</label>
          <select value={patient.gender} onChange={e => setPatient({ ...patient, gender: e.target.value })} className="border rounded px-3 py-2 w-full">
            <option value="">เลือกเพศ</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
          </select>
        </div>
        <button type="button" className="bg-green-600 text-white w-full px-4 py-2 rounded font-bold mt-4" onClick={handleRegister}>
          บันทึกข้อมูลผู้ป่วยใหม่
        </button>
      </form>
    </div>
  );
}