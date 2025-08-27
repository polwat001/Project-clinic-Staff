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
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ตรวจเบื้องต้น/ส่งต่อแพทย์</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Input
            placeholder="BP Systolic"
            value={vitals.sys}
            onChange={e => setVitals({ ...vitals, sys: e.target.value })}
          />
          <Input
            placeholder="BP Diastolic"
            value={vitals.dia}
            onChange={e => setVitals({ ...vitals, dia: e.target.value })}
          />
          <Input
            placeholder="HR"
            value={vitals.hr}
            onChange={e => setVitals({ ...vitals, hr: e.target.value })}
          />
          <Input
            placeholder="RR"
            value={vitals.rr}
            onChange={e => setVitals({ ...vitals, rr: e.target.value })}
          />
          <Input
            placeholder="Temp"
            value={vitals.temp}
            onChange={e => setVitals({ ...vitals, temp: e.target.value })}
          />
          <Input
            placeholder="SpO2"
            value={vitals.spo2}
            onChange={e => setVitals({ ...vitals, spo2: e.target.value })}
          />
          <Input
            placeholder="น้ำหนัก (kg)"
            value={vitals.wt}
            onChange={e => setVitals({ ...vitals, wt: e.target.value })}
          />
          <Input
            placeholder="ส่วนสูง (cm)"
            value={vitals.ht}
            onChange={e => setVitals({ ...vitals, ht: e.target.value })}
          />
        </div>
        <div className="mb-2">
          BMI: <Badge>{bmiDerived || "-"}</Badge>
        </div>
        <div className="mb-2">
          {flags.length > 0 && (
            <div>
              {flags.map(flag => (
                <Badge key={flag} variant="destructive" className="mr-1">{flag}</Badge>
              ))}
            </div>
          )}
        </div>
        <Input
          placeholder="S (อาการ)"
          value={noteS}
          onChange={e => setNoteS(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="O (ตรวจร่างกาย)"
          value={noteO}
          onChange={e => setNoteO(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="A (ประเมิน)"
          value={noteA}
          onChange={e => setNoteA(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="P (แผน)"
          value={noteP}
          onChange={e => setNoteP(e.target.value)}
          className="mb-2"
        />
        <div className="flex gap-2 mt-2">
          <Button onClick={handleSaveVitals}>บันทึก Vital Signs</Button>
          <Button onClick={advanceToDoctor}>ส่งต่อแพทย์</Button>
          <Button variant="secondary" onClick={handleQuickWalkIn}>Walk-in</Button>
        </div>
      </CardContent>
    </Card>
  );
}