import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Card>

      <CardContent className="text-black">
        <div className="grid grid-cols-2 gap-1 mb-1">
          <Input
            placeholder="BP Systolic"
            value={vitals.sys}
            onChange={e => setVitals({ ...vitals, sys: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="BP Diastolic"
            value={vitals.dia}
            onChange={e => setVitals({ ...vitals, dia: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="HR"
            value={vitals.hr}
            onChange={e => setVitals({ ...vitals, hr: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="RR"
            value={vitals.rr}
            onChange={e => setVitals({ ...vitals, rr: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="Temp"
            value={vitals.temp}
            onChange={e => setVitals({ ...vitals, temp: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="SpO2"
            value={vitals.spo2}
            onChange={e => setVitals({ ...vitals, spo2: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="น้ำหนัก (kg)"
            value={vitals.wt}
            onChange={e => setVitals({ ...vitals, wt: e.target.value })}
            className="text-black"
          />
          <Input
            placeholder="ส่วนสูง (cm)"
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
        <Input
          placeholder="อาการเบื้องต้น"
          value={noteS}
          onChange={e => setNoteS(e.target.value)}
          className="mb-2 text-black"
        />
        <div className="mb-2 flex gap-4">
          <div className="flex-1">
            <label className="block text-black font-bold mb-1">ดื่มสุรา</label>
            <select
              className="border rounded px-2 py-1 text-black w-full"
              value={drinking}
              onChange={e => setDrinking(e.target.value)}
            >
              <option value="">เลือก</option>
              <option value="ไม่ดื่ม">ไม่ดื่ม</option>
              <option value="ดื่ม">ดื่ม</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-black font-bold mb-1">สูบบุหรี่</label>
            <select
              className="border rounded px-2 py-1 text-black w-full"
              value={smoking}
              onChange={e => setSmoking(e.target.value)}
            >
              <option value="">เลือก</option>
              <option value="ไม่สูบ">ไม่สูบ</option>
              <option value="สูบ">สูบ</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Button className="text-black" onClick={handleSaveVitals}>บันทึก Vital Signs</Button>
          <Button className="text-black" onClick={advanceToDoctor}>ส่งต่อแพทย์</Button>
          <Button variant="secondary" className="text-black" onClick={handleQuickWalkIn}>Walk-in</Button>
        </div>
      </CardContent>
    </Card>
  );
}