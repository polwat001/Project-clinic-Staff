import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Appointment {
  id: string;
  hn: string;
  patient_name?: string;
  name?: string;
  scheduled_at?: string;
  chief?: string;
  chief_complaint?: string;
  flags?: string[];
  room?: string;
}

interface Props {
  appointments: Appointment[];
  searchText: string;
  setSearchText: (text: string) => void;
  handleCheckInOnline: (appt: Appointment) => void;
}

export default function AppointmentList({
  appointments,
  searchText,
  setSearchText,
  handleCheckInOnline,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>รายการนัดหมาย</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="ค้นหาด้วยชื่อ, HN, อาการ"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="mb-2"
        />
        <ul className="space-y-2">
          {appointments.map(appt => (
            <li key={appt.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <div className="font-bold">{appt.patient_name || appt.name}</div>
                <div className="text-xs text-gray-500">HN: {appt.hn} | {appt.scheduled_at}</div>
                <div className="text-xs">{appt.chief || appt.chief_complaint}</div>
              </div>
              <Button size="sm" onClick={() => handleCheckInOnline(appt)}>
                เช็คอิน
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}