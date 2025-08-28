import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  idCard?: string;
  prefix?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  address?: string;
  province?: string;
  district?: string;
  rights?: string;
  email?: string;
  lineId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  additionalSymptom?: string;
}

interface Props {
  registeredPatients: Patient[];
  searchPatientText: string;
  setSearchPatientText: (text: string) => void;
  filteredRegisteredPatients: Patient[];
  selectedRegisteredPatient: Patient | null;
  setSelectedRegisteredPatient: (p: Patient | null) => void;
  setIsWalkIn: (val: boolean) => void;
  patient: Patient;
  setPatient: (p: Patient) => void;
  handleRefreshQueue: () => void;
}

export default function SearchPatientSection({
  registeredPatients,
  searchPatientText,
  setSearchPatientText,
  filteredRegisteredPatients,
  selectedRegisteredPatient,
  setSelectedRegisteredPatient,
  setIsWalkIn,
  patient,
  setPatient,
  handleRefreshQueue,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ค้นหาผู้ป่วยเก่า</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="ค้นหาด้วยชื่อ, HN, เลขบัตรประชาชน"
          value={searchPatientText}
          onChange={e => setSearchPatientText(e.target.value)}
          className="mb-2"
        />
        <ul className="space-y-2">
          {(filteredRegisteredPatients ?? []).map(p => (
            <li
              key={p.hn}
              className={`flex justify-between items-center p-2 rounded cursor-pointer ${selectedRegisteredPatient?.hn === p.hn ? "bg-blue-100" : ""}`}
              onClick={() => { setSelectedRegisteredPatient(p); setIsWalkIn(false); }}
            >
              <div>
                <div className="font-bold">{p.name || `${p.firstName || ""} ${p.lastName || ""}`.trim()}</div>
                <div className="text-xs text-gray-500">HN: {p.hn} | {p.dob}</div>
              </div>
              <Button size="sm" variant="secondary" onClick={handleRefreshQueue}>
                รีเฟรช
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}