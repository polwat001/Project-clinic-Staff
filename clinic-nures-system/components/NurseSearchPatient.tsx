"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NurseSearchPatient() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchPatients() {
      const { data } = await supabase.from("patients").select("*");
      setPatients(data || []);
    }
    fetchPatients();
  }, []);

  const filtered = patients.filter(
    p =>
      (p.hn && p.hn.includes(searchText)) ||
      (p.first_name && p.first_name.includes(searchText)) ||
      (p.last_name && p.last_name.includes(searchText)) ||
      (p.id_card && p.id_card.includes(searchText)) ||
      (p.phone && p.phone.includes(searchText))
  );

  return (
    <div className="flex gap-8 px-8 py-8 bg-white min-h-screen font-sans">
      {/* Sidebar ค้นหา */}
      <div className="relative w-[400px]">
        <div className="absolute top-0 left-0 w-full h-[220px] bg-[#EEEEEE] border-2 border-[#D9D9D9] rounded-t-[25px] z-10"></div>
        <div className="absolute top-[220px] left-0 w-full h-[calc(100%-220px)] bg-white border-x-2 border-b-2 border-[#D9D9D9] rounded-b-[25px]"></div>
        <div className="relative z-20 p-8">
          <div className="font-bold text-2xl mb-2">ค้นหาชื่อผู้ป่วย</div>
          <input
            type="text"
            placeholder="พิมพ์ชื่อ, HN, เบอร์"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="border-2 border-[#D9D9D9] rounded-[25px] px-6 py-3 w-full text-lg bg-white placeholder:text-[#B4AAAA] mb-6"
          />
          <div className="space-y-4">
            {filtered.map((p, idx) => (
              <div
                key={p.hn}
                className={`flex justify-between items-center rounded-[25px] px-6 py-4 cursor-pointer border-2 ${
                  selected?.hn === p.hn
                    ? "bg-[#D9E4F1] border-[#D9E4F1]"
                    : "bg-white border-[#D9D9D9]"
                }`}
                onClick={() => setSelected(p)}
              >
                <div>
                  <div className="font-semibold text-xl">{p.first_name} {p.last_name}</div>
                  <div className="text-base mt-1">เกิด {p.dob} {p.gender} {p.phone}</div>
                </div>
                <div className="font-mono text-lg">{p.hn}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {selected ? (
          <div>
            {/* Patient Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="bg-white border-2 border-[#D9D9D9] rounded-[25px] px-8 py-6 flex flex-col gap-2 w-[700px]">
                <div className="flex items-center gap-4">
                  <div className="font-bold text-2xl">{selected.first_name} {selected.last_name}</div>
                  <div className="font-mono text-xl">{selected.hn}</div>
                </div>
                <div className="text-lg">เกิด {selected.dob} {selected.gender} {selected.phone}</div>
                <div className="flex gap-2 mt-2">
                  <span className="bg-[#D7A9A9] text-[#AB1E1E] px-6 py-2 rounded-[25px] text-base font-medium">แพ้ยา : ยาแก้อักเสบ</span>
                  <span className="bg-[#E4CF8B] text-[#84742C] px-6 py-2 rounded-[25px] text-base font-medium">โรคประจำตัว : โรคหัวใจ</span>
                </div>
              </div>
              <div className="text-[#B4AAAA] font-bold text-xl">{new Date().toLocaleString("th-TH")}</div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button className="bg-white border-2 border-[#D9D9D9] rounded-[25px] px-8 py-4 text-lg font-medium">เวชระเบียนล่าสุด</button>
              <button className="bg-[#4C90E3] border-2 border-[#4C90E3] rounded-[25px] px-8 py-4 text-lg font-medium text-white">ตรวจ/วินิจฉัย/แผน</button>
              <button className="bg-white border-2 border-[#E6E5E5] rounded-[25px] px-8 py-4 text-lg font-medium">ใบสั่งยา</button>
              <button className="bg-white border-2 border-[#E6E5E5] rounded-[25px] px-8 py-4 text-lg font-medium">นัดหมาย</button>
              <button className="bg-white border-2 border-[#E6E5E5] rounded-[25px] px-8 py-4 text-lg font-medium">ประวัติก่อนหน้า</button>
            </div>

            {/* Vitals */}
            <div className="bg-white border-2 border-[#D9D9D9] rounded-[25px] mb-6 w-[700px]">
              <div className="bg-[#EEEEEE] rounded-t-[25px] px-8 py-4 border-b-2 border-[#D9D9D9] font-medium text-lg">สัญญาณชีพ (Vitals)</div>
              <div className="px-8 py-6 text-lg">ยังไม่มีการบันทึกสัญญาณชีพ</div>
            </div>

            {/* CC & Diagnosis */}
            <div className="flex gap-8 mb-6">
              <div className="bg-white border-2 border-[#D9D9D9] rounded-[25px] w-[340px]">
                <div className="bg-[#EEEEEE] rounded-t-[25px] px-6 py-4 border-b-2 border-[#D9D9D9] font-medium text-lg">อาการนำ (CC)</div>
                <div className="px-6 py-4 text-[#B4AAAA] text-lg">เช่น ไอ เจ็บคอ 3 วัน มีไข้</div>
                <div className="px-6 pb-2 text-[#B4AAAA] text-right text-base">0 ตัวอักษร</div>
              </div>
              <div className="bg-white border-2 border-[#D9D9D9] rounded-[25px] w-[340px]">
                <div className="bg-[#EEEEEE] rounded-t-[25px] px-6 py-4 border-b-2 border-[#D9D9D9] font-medium text-lg">การวินิจฉัย</div>
                <div className="px-6 py-4 text-[#B4AAAA] text-lg">เช่น ความดันโลหิตสูง</div>
                <div className="px-6 pb-2 text-[#B4AAAA] text-right text-base">0 ตัวอักษร</div>
              </div>
            </div>

            {/* Treatment Plan & Advice */}
            <div className="flex gap-8 mb-6">
              <div className="bg-white border-2 border-[#D9D9D9] rounded-[25px] w-[340px]">
                <div className="bg-[#EEEEEE] rounded-t-[25px] px-6 py-4 border-b-2 border-[#D9D9D9] font-medium text-lg">แผนการรักษา</div>
                <div className="px-6 py-4 text-[#B4AAAA] text-lg">คำสั่งตรวจ/ให้ยา/ติดตามอาการ</div>
                <div className="px-6 pb-2 text-[#B4AAAA] text-right text-base">0 ตัวอักษร</div>
              </div>
              <div className="bg-white border-2 border-[#D9D9D9] rounded-[25px] w-[340px]">
                <div className="bg-[#EEEEEE] rounded-t-[25px] px-6 py-4 border-b-2 border-[#D9D9D9] font-medium text-lg">คำแนะนำ</div>
                <div className="px-6 py-4 text-lg">พักผ่อน ดื่มน้ำมากๆ</div>
                <div className="px-6 pb-2 text-[#B4AAAA] text-right text-base">19 ตัวอักษร</div>
              </div>
            </div>

            {/* ROS & Physical Exam */}
            <div className="flex gap-8 mb-6">
              <div className="bg-white border-2 border-[#D9D9D9] rounded-[25px] w-[340px]">
                <div className="bg-[#EEEEEE] rounded-t-[25px] px-6 py-4 border-b-2 border-[#D9D9D9] font-medium text-lg">ROS</div>
                <div className="px-6 py-4 text-[#B4AAAA] text-lg">ระบบต่างๆ</div>
                <div className="px-6 pb-2 text-[#B4AAAA] text-right text-base">0 ตัวอักษร</div>
              </div>
              <div className="bg-white border-2 border-[#D9D9D9] rounded-[25px] w-[340px]">
                <div className="bg-[#EEEEEE] rounded-t-[25px] px-6 py-4 border-b-2 border-[#D9D9D9] font-medium text-lg">ตรวจร่างกาย</div>
                <div className="px-6 py-4 text-[#B4AAAA] text-lg">GA/HEENT/Chest...</div>
                <div className="px-6 pb-2 text-[#B4AAAA] text-right text-base">0 ตัวอักษร</div>
              </div>
            </div>

            {/* History */}
            <div className="bg-white border-2 border-[#D9D9D9] rounded-[25px] mb-6 w-[700px]">
              <div className="bg-[#EEEEEE] rounded-t-[25px] px-8 py-4 border-b-2 border-[#D9D9D9] font-medium text-lg">ประวัติการเจ็บป่วย/ยา/แพ้</div>
              <div className="px-8 py-6 text-[#B4AAAA] text-lg">ประวัติปัจจุบัน/อดีต/ยาที่ใช้/แพ้ยา ฯลฯ</div>
              <div className="px-8 pb-2 text-[#B4AAAA] text-right text-base">0 ตัวอักษร</div>
            </div>

            {/* Summary & Save */}
            <div className="bg-white border-2 border-[#D9D9D9] rounded-[25px] mb-6 w-[700px]">
              <div className="bg-[#EEEEEE] rounded-t-[25px] px-8 py-4 border-b-2 border-[#D9D9D9] font-medium text-lg">สรุปฉบับผู้ป่วย</div>
              <div className="px-8 py-6 text-lg">
                อาการนำ : -<br />
                การวินิจฉัย : -<br />
                สัญญาณชีพ : -<br />
                ROS : -<br />
                แผนการรักษา : -<br />
                คำแนะนำ : พักผ่อน ดื่มน้ำมากๆ
              </div>
              <div className="px-8 pb-6">
                <button className="bg-[#4C90E3] text-white px-8 py-3 rounded-[25px] font-medium text-lg">บันทึกเวชระเบียน</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center mt-20 text-xl">กรุณาเลือกผู้ป่วยจากด้านซ้าย</div>
        )}
      </div>
    </div>
  );
}