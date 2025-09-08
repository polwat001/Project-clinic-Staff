import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";

interface Vitals {
  sys: string;
  dia: string;
  hr: string;
  rr: string;
  temp: string;
  spo2: string;
  wt: string;
  ht: string;
  noteS: string; // เพิ่มบรรทัดนี้
}

interface Patient {
  hn: string;
  name: string;
  first_name: string; 
  last_name: string;
  prefix: string;
  idCard?: string;
  phone: string;
  dob: string;
  apptId: string;
  chief: string;
  allergies: string;
  pmh: string;
  meds: string;
  urgency: string;
  noteS: string;
  // ...other fields...
}

interface Props {
  patient: Patient;
  setPatient: (p: Patient) => void;
  vitals: Vitals;
  setVitals: (v: Vitals) => void;
  bmiDerived: string;
  flags: string[];
  noteS: string;
  setNoteS: (s: string) => void;
  noteO: string;
  setNoteO: (o: string) => void;
  noteA: string;
  setNoteA: (a: string) => void;
  noteP: string;
  setNoteP: (p: string) => void;
  handleSaveVitals: () => void;
  selected: any;
  clientTime: string;
  handleQuickWalkIn: () => void;
  advanceToDoctor: () => void;
  drinking: string;
  setDrinking: (v: string) => void;
  smoking: string;
  setSmoking: (v: string) => void;
}

export default function TriageForm({
  patient,
  setPatient,
  vitals,
  setVitals,
  bmiDerived,
  flags,
  noteS,
  setNoteS,
  noteO,
  setNoteO,
  noteA,
  setNoteA,
  noteP,
  setNoteP,
  handleSaveVitals,
  selected,
  clientTime,
  handleQuickWalkIn,
  advanceToDoctor,
  drinking,
  setDrinking,
  smoking,
  setSmoking,
}: Props) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  return (
    <Card>
      <CardContent className="text-black">
        {/* เพิ่มช่องแสดง HN และชื่อ-นามสกุลที่เลือก */}
        <div className="mb-2 grid grid-cols-2 gap-2">
          <div>
            <label className="block text-black font-bold mb-0">HN</label>
            <Input
              value={patient.hn || ""}
              readOnly
              className="text-black bg-gray-100"
              placeholder="HN"
            />
          </div>
          <div>
            <label className="block text-black font-bold mb-0">ชื่อ-นามสกุล</label>
            <Input
              value={
                patient.name?.trim() ||
                [
                  patient.prefix || "",
                  patient.first_name || patient.firstName || "",
                  patient.last_name || patient.lastName || ""
                ].filter(Boolean).join(" ")
              }
              readOnly
              className="text-black bg-gray-100"
              placeholder="ชื่อ-นามสกุล"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 mb-0">
          <Input
            placeholder="BP Systolic (90-140 mmHg)"
            value={vitals.sys}
            onChange={e => setVitals({ ...vitals, sys: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="BP Diastolic (60-90 mmHg)"
            value={vitals.dia}
            onChange={e => setVitals({ ...vitals, dia: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="HR (60-100 ครั้ง/นาที)"
            value={vitals.hr}
            onChange={e => setVitals({ ...vitals, hr: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="RR (12-20 ครั้ง/นาที)"
            value={vitals.rr}
            onChange={e => setVitals({ ...vitals, rr: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="Temp (36.0-37.5 °C)"
            value={vitals.temp}
            onChange={e => setVitals({ ...vitals, temp: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="SpO2 (95-100%)"
            value={vitals.spo2}
            onChange={e => setVitals({ ...vitals, spo2: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="น้ำหนัก (kg) ตามเกณฑ์อายุ"
            value={vitals.wt}
            onChange={e => setVitals({ ...vitals, wt: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="ส่วนสูง (cm) ตามเกณฑ์อายุ"
            value={vitals.ht}
            onChange={e => setVitals({ ...vitals, ht: e.target.value })}
            className="text-black"
          />
        </div>
        <div className="mb-2 text-black">
          BMI: <Badge>{bmiDerived || "-"}</Badge>
        </div>
        <div className="mb-2 text-black">
          {flags.length > 0 && ( 
            <div>
              {flags.map(flag => (
                <Badge key={flag} variant="destructive" className="mr-1">{flag}</Badge>
              ))}
            </div>
          )}
        </div>
                {/* เกณฑ์ค่าต่างๆ */}
        <div className="mt-1 p-3 bg-blue-50 rounded text-sm text-black">
          <div className="font-bold mb-2">เกณฑ์ค่าปกติ Vital Signs</div>
          <ul className="list-disc pl-5">
            <li>BP (ความดันโลหิต): 90-140 / 60-90 mmHg</li>
            <li>HR (ชีพจร): 60-100 ครั้ง/นาที</li>
            <li>RR (อัตราการหายใจ): 12-20 ครั้ง/นาที</li>
            <li>Temp (อุณหภูมิ): 36.0-37.5 °C</li>
            <li>SpO₂ (ออกซิเจนในเลือด): 95-100%</li>
            <li>น้ำหนัก/ส่วนสูง: ตามเกณฑ์อายุ</li>
            <li>BMI: 18.5-24.9 (ปกติ)</li>
          </ul>
          <div className="mt-2 text-xs text-slate-600">
            * หากค่าผิดปกติควรแจ้งแพทย์ทันที
          </div>
        </div>
        <Input
          placeholder="อาการเบื้องต้น"
          value={vitals.noteS}
          onChange={e => setVitals({ ...vitals, noteS: e.target.value })}
          className="mb-2 text-black"
        />
        <div className="mb-2 flex gap-4">
          <div className="flex-1">
            <label className="block text-black font-bold mb-1">ดื่มสุรา</label>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={drinking === "ดื่ม"}
                  onChange={e => setDrinking(e.target.checked ? "ดื่ม" : "")}
                />
                ดื่ม
              </label>
              <label className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={drinking === "ไม่ดื่ม"}
                  onChange={e => setDrinking(e.target.checked ? "ไม่ดื่ม" : "")}
                />
                ไม่ดื่ม
              </label>
              <label className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={drinking === "นานๆครั้ง"}
                  onChange={e => setDrinking(e.target.checked ? "นานๆครั้ง" : "")}
                />
                นานๆครั้ง
              </label>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-black font-bold mb-1">สูบบุหรี่</label>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={smoking === "สูบ"}
                  onChange={e => setSmoking(e.target.checked ? "สูบ" : "")}
                />
                สูบ
              </label>
              <label className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={smoking === "ไม่สูบ"}
                  onChange={e => setSmoking(e.target.checked ? "ไม่สูบ" : "")}
                />
                ไม่สูบ
              </label>
              <label className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={smoking === "สูบไม่บ่อย"}
                  onChange={e => setSmoking(e.target.checked ? "สูบไม่บ่อย" : "")}
                />
                สูบไม่บ่อย/นานๆครั้ง
              </label>
            </div>
          </div>
        </div>
        {saveSuccess && (
          <div className="mb-2 p-2 rounded bg-green-100 text-green-700 border border-green-400 text-center font-bold">
            ✔️ บันทึก Vital Signs สำเร็จ
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <Button
            className="text-black"
            onClick={async () => {
              const payload = {
                hn: patient.hn ?? "",
                full_name:
                  (patient.name && patient.name.trim())
                    ? patient.name.trim()
                    : [
                        patient.prefix || "",
                        patient.first_name || (patient as any).firstName || "",
                        patient.last_name || (patient as any).lastName || ""
                      ].filter(Boolean).join(" ").trim() || null,
                sys: Number(vitals.sys) || null,
                dia: Number(vitals.dia) || null,
                hr: Number(vitals.hr) || null,
                rr: Number(vitals.rr) || null,
                temp_c: Number(vitals.temp) || null,
                spo2: Number(vitals.spo2) || null,
                weight_kg: Number(vitals.wt) || null,
                height_cm: Number(vitals.ht) || null,
                bmi: Number(bmiDerived) || null,
                drinking,
                smoking,
                chief_complaint: vitals.noteS || "",
              };
              const { error } = await supabase.from('vitals').insert([payload]);
              if (!error) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2000); // ซ่อนแจ้งเตือนหลัง 2 วินาที
              } else {
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
              }
              // handleSaveVitals(); // ไม่ต้องเรียกซ้ำถ้าในนี้มี insert vitals อีก
            }}
          >
            บันทึก Vital Signs
          </Button>
          <Button className="text-black" variant="outline" onClick={handleQuickWalkIn} disabled={!selected || !clientTime}>
            เพิ่ม Walk-in & เข้าคิว
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}