"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://YOUR_PROJECT_ID.supabase.co";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PatientSearchPanel({ onSelect }: { onSelect: (patient: any) => void }) {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPatients() {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name, dob, gender, phone");
      if (!error && data) setPatients(data);
    }
    fetchPatients();
  }, []);

  const filtered = patients.filter(
    (p) =>
      (p.name && p.name.includes(search)) ||
      (p.id && p.id.includes(search)) ||
      (p.phone && p.phone.includes(search))
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="font-semibold mb-2">ค้นหาชื่อผู้ป่วย</div>
      <input
        className="w-full border rounded p-2 mb-2"
        placeholder="พิมพ์ชื่อ, HN, เบอร์"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {filtered.map((p) => (
          <li
            key={p.id}
            className="p-2 rounded hover:bg-blue-100 cursor-pointer mb-1"
            onClick={() => onSelect(p)}
          >
            <div className="font-bold">{p.name}</div>
            <div className="text-xs text-gray-600">
              เกิด {p.dob} {p.gender} {p.phone}
            </div>
            <div className="text-xs text-gray-500">{p.id}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}