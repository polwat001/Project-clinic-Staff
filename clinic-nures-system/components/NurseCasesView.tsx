"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NurseCasesView() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    async function fetchCases() {
      const { data } = await supabase.from("cases").select("*");
      setCases(data || []);
    }
    fetchCases();
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl border p-8 shadow">
      <h2 className="text-xl font-bold mb-6">เคสย้อนหลัง</h2>
      <div className="space-y-2">
        {cases.map(c => (
          <div key={c.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="font-bold">{c.name}</div>
            <div className="text-xs">Case: {c.id} | วันที่: {c.date}</div>
            <div className="text-sm">วินิจฉัย: {c.diagnosis}</div>
            <button className="text-blue-600 underline mt-2" onClick={() => setSelectedCase(c)}>ดูรายละเอียด</button>
          </div>
        ))}
      </div>
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={()=>setSelectedCase(null)}>✕</button>
            <h2 className="text-lg font-bold mb-2">รายละเอียดเคส</h2>
            <div className="mb-2"><span className="font-semibold">Case ID:</span> {selectedCase.id}</div>
            <div className="mb-2"><span className="font-semibold">ชื่อ:</span> {selectedCase.name}</div>
            <div className="mb-2"><span className="font-semibold">วินิจฉัย:</span> {selectedCase.diagnosis}</div>
            <h3 className="font-semibold mt-4 mb-2">รายการยา</h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">ชื่อยา</th>
                  <th className="border px-2 py-1">ขนาดยา</th>
                  <th className="border px-2 py-1">วิธีใช้</th>
                </tr>
              </thead>
              <tbody>
                {(selectedCase.medicines ?? []).map((med, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{med.name}</td>
                    <td className="border px-2 py-1">{med.dosage}</td>
                    <td className="border px-2 py-1">{med.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}