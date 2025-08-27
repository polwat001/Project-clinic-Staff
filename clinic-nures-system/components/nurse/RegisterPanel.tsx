"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "../lib/supabaseClient";

export default function RegisterPanel({
  selectedPatient,
  setSelectedPatient,
  handleRegisterPatient
}: {
  selectedPatient: any;
  setSelectedPatient: (p: any) => void;
  handleRegisterPatient: () => void;
}) {
  const [search, setSearch] = useState("");
  const [patientList, setPatientList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPatients() {
      const { data, error } = await supabase.from("patients").select("*");
      if (data) setPatientList(data);
    }
    fetchPatients();
  }, []);

  const filtered = (patientList ?? []).filter(
    (p) =>
      p.name.includes(search) ||
      p.hn.includes(search) ||
      p.phone.includes(search)
  );

  const handleRegisterPatient = async (patient: any) => {
    const { data, error } = await supabase.from("patients").insert([patient]);
    // ตรวจสอบ error/data แล้วแจ้งผล
  };

  return (
    <div className="flex gap-6">
      <div className="w-[340px]">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>ค้นหาผู้ป่วย</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="พิมพ์ชื่อ, HN, เบอร์"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mb-4"
            />
            <div className="space-y-2">                 
              {filtered.map((p) => (
                <div
                  key={p.hn}
                  className={`rounded-lg border px-4 py-3 cursor-pointer ${selectedPatient?.hn === p.hn ? "bg-blue-50" : ""}`}
                  onClick={() => setSelectedPatient(p)}
                >
                  <div className="font-semibold">{p.name} <span className="float-right">{p.hn}</span></div>
                  <div className="text-xs text-gray-600">เกิด {p.dob} {p.gender} {p.phone}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1">
        <Card>
          <CardContent className="pt-6 pb-2">
            {selectedPatient ? (
              <>
                <div className="font-bold text-lg">{selectedPatient.name} <span className="font-normal text-base ml-2">{selectedPatient.hn}</span></div>
                <div className="text-sm text-gray-700 mb-2">เกิด {selectedPatient.dob} {selectedPatient.gender} {selectedPatient.phone}</div>
                <div className="flex gap-2 mb-4">
                  {selectedPatient.allergies && (
               <Badge variant="destructive">แพ้ยา : {selectedPatient.allergies}</Badge>
                  )}
                  {selectedPatient.pmh && (
                    <Badge variant="secondary">โรคประจำตัว : {selectedPatient.pmh}</Badge>
                  )}
                </div>
                <Button className="bg-green-600 text-white" onClick={handleRegisterPatient}>บันทึกข้อมูลผู้ป่วยใหม่</Button>
              </>
            ) : (
              <div className="text-gray-400 text-center py-16">กรุณาเลือกผู้ป่วย</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}