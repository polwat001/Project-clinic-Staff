import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DoctorDiagnosis {
  caseId: string;
  idCard: string;
  name: string;
  chief: string;
  diagnosis: string;
  medicines: Array<{
    name: string;
    dosage: string;
    instructions: string;
  }>;
  notes?: string;
  appointment?: {
    id: string;
    date: string;
    room?: string;
  };
}

interface Props {
  casesFromDoctor: DoctorDiagnosis[];
  casesSent: DoctorDiagnosis[];
  selectedCase: DoctorDiagnosis | null;
  setSelectedCase: (c: DoctorDiagnosis | null) => void;
}

export default function CaseHistorySection({
  casesFromDoctor,
  casesSent,
  selectedCase,
  setSelectedCase,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>เคสย้อนหลัง</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 font-bold">เคสจากแพทย์</div>
        <ul className="space-y-2">
          {casesFromDoctor.map(c => (
            <li
              key={c.caseId}
              className={`p-2 rounded cursor-pointer ${selectedCase?.caseId === c.caseId ? "bg-blue-100" : ""}`}
              onClick={() => setSelectedCase(c)}
            >
              <div>{c.name} | {c.chief}</div>
              <div className="text-xs text-gray-500">{c.diagnosis}</div>
            </li>
          ))}
        </ul>
        <div className="mt-4 mb-2 font-bold">เคสที่ส่งแล้ว</div>
        <ul className="space-y-2">
          {casesSent.map(c => (
            <li
              key={c.caseId}
              className={`p-2 rounded cursor-pointer ${selectedCase?.caseId === c.caseId ? "bg-blue-100" : ""}`}
              onClick={() => setSelectedCase(c)}
            >
              <div>{c.name} | {c.chief}</div>
              <div className="text-xs text-gray-500">{c.diagnosis}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}