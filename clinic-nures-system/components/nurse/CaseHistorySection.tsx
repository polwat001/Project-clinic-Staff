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

interface CaseHistorySectionProps {
  hn: string;
  patient: any;
  casesFromDoctor?: any[];
  casesSent?: any[];
}

export default function CaseHistorySection({
  hn,
  patient,
  casesFromDoctor = [],
  casesSent = [],
}: CaseHistorySectionProps) {
  const [selectedCase, setSelectedCase] = React.useState<any>(null);

  // รวมผลวินิจฉัยทั้งหมด
  const allCases = [...casesFromDoctor, ...casesSent];

  return (
    <Card>
      <CardHeader>
        <CardTitle>ผลวินิจฉัยย้อนหลัง</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {allCases.length === 0 && (
            <li className="text-gray-400">ไม่พบผลวินิจฉัย</li>
          )}
          {allCases.map(c => (
            <li
              key={c.caseId}
              className={`p-2 rounded cursor-pointer ${selectedCase?.caseId === c.caseId ? "bg-blue-100" : ""}`}
              onClick={() => setSelectedCase(c)}
            >
              <div className="font-bold">{c.name} | {c.chief}</div>
              <div className="text-xs text-gray-500">{c.diagnosis}</div>
              {c.medicines && c.medicines.length > 0 && (
                <div className="text-xs mt-1">
                  <span className="font-semibold">ยา:</span>{" "}
                  {c.medicines.map((m: any, idx: number) => (
                    <span key={idx}>{m.name} ({m.dosage}) </span>
                  ))}
                </div>
              )}
              {c.notes && (
                <div className="text-xs text-gray-600 mt-1">หมายเหตุ: {c.notes}</div>
              )}
            </li>
          ))}
        </ul>
        {selectedCase && (
          <div className="mt-4 p-3 rounded bg-blue-50 border">
            <div className="font-bold mb-1">รายละเอียดผลวินิจฉัย</div>
            <div>ชื่อ: {selectedCase.name}</div>
            <div>อาการหลัก: {selectedCase.chief}</div>
            <div>วินิจฉัย: {selectedCase.diagnosis}</div>
            <div>ยา: {selectedCase.medicines?.map((m: any, idx: number) => (
              <span key={idx}>{m.name} ({m.dosage}) </span>
            ))}</div>
            {selectedCase.notes && <div>หมายเหตุ: {selectedCase.notes}</div>}
            {selectedCase.appointment && (
              <div>วันนัด: {selectedCase.appointment.date} ห้อง: {selectedCase.appointment.room}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

