"use client";
import React, { useState } from "react";

export default function PatientSearchPanel({ onSelect }: { onSelect: (patient: any) => void }) {
  const [search, setSearch] = useState("");
  const patients = [
    { id: "HN20250001", name: "นาย กร ยนต์", dob: "20 ม.ค. 2536", gender: "ชาย", phone: "0878854551" },
    { id: "HN20250002", name: "นาง ดี อน", dob: "10 ม.ค. 2532", gender: "หญิง", phone: "0625554411" },
  ];
  const filtered = patients.filter(
    (p) =>
      p.name.includes(search) ||
      p.id.includes(search) ||
      p.phone.includes(search)
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