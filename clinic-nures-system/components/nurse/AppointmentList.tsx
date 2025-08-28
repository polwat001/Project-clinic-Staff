import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Appointment {
  id: string;
  hn: string;
  patient_name?: string;
  name?: string;
  idCard?: string;
  queueNo?: number;
  scheduled_at?: string;
  chief?: string;
  chief_complaint?: string;
  flags?: string[];
  room?: string;
}

interface Props {
  appointments: Appointment[];
  searchText: string;
  setSearchText: (v: string) => void;
  handleCheckInOnline: (appt: Appointment) => void;
  handleRemoveQueue: (appt: Appointment) => void;
  handleSkipQueue: (appt: Appointment) => void;
}

export default function AppointmentList({
  appointments,
  searchText,
  setSearchText,
  handleCheckInOnline,
  handleRemoveQueue,
  handleSkipQueue,
}: Props) {
  return (
    <Card>
      <CardContent>
        <Input
          placeholder="ค้นหาด้วยชื่อ, HN, เลขบัตรประชาชน"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="mb-1 text-black"
        />
        <div className="overflow-auto border rounded">
          {appointments.length === 0 && (
            <div className="p-4 text-gray-500">ไม่พบรายการนัดหมาย</div>
          )}
          {appointments.map(appt => (
            <div
              key={appt.id}
              className="p-2 border-b flex items-center justify-between bg-white hover:bg-blue-100 text-black"
            >
              <div>
                <div className="font-bold">คิวที่ {appt.queueNo}</div>
                <div>
                  ชื่อ:{" "}
                  {appt.patient_name ||
                    appt.name ||
                    ((appt.firstName || appt.lastName)
                      ? `${appt.firstName ?? ""} ${appt.lastName ?? ""}`.trim()
                      : "-")}
                </div>
                <div>เลขบัตรประชาชน: {appt.idCard || "-"}</div>
                <div>HN: {appt.hn}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleCheckInOnline(appt)}
                >
                  เช็คอิน
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  onClick={() => handleSkipQueue(appt)}
                >
                  ข้ามคิว
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleRemoveQueue(appt)}
                >
                  ลบคิว
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}