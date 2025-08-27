import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
  patient: Patient;
  setPatient: (p: Patient) => void;
  isWalkIn: boolean;
  handleRegisterPatient: () => void;
}

export default function PatientRegisterForm({
  patient,
  setPatient,
  isWalkIn,
  handleRegisterPatient,
}: Props) {
  return (
    <Card>
      <CardContent className="text-black">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {/* คอลัมน์ซ้าย */}
            <div className="space-y-1">
              <Label htmlFor="hn" className="text-black text-xs">
                HN (อัตโนมัติ)
              </Label>
              <Input
                id="hn"
                placeholder="ถูกสร้างอัตโนมัติ"
                value={patient.hn}
                disabled
                className="mb-1 text-black bg-gray-100 text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="idCard" className="text-black text-xs">
                เลขบัตรประชาชน
              </Label>
              <Input
                id="idCard"
                placeholder="เลขบัตรประชาชน"
                value={patient.idCard || ""}
                onChange={e => setPatient({ ...patient, idCard: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="prefix" className="text-black text-xs">
                คำนำหน้า
              </Label>
              <Input
                id="prefix"
                placeholder="คำนำหน้า"
                value={patient.prefix || ""}
                onChange={e => setPatient({ ...patient, prefix: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="firstName" className="text-black text-xs">
                ชื่อจริง
              </Label>
              <Input
                id="firstName"
                placeholder="ชื่อจริง"
                value={patient.firstName || ""}
                onChange={e => setPatient({ ...patient, firstName: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="lastName" className="text-black text-xs">
                นามสกุล
              </Label>
              <Input
                id="lastName"
                placeholder="นามสกุล"
                value={patient.lastName || ""}
                onChange={e => setPatient({ ...patient, lastName: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="gender" className="text-black text-xs">
                เพศ
              </Label>
              <Input
                id="gender"
                placeholder="เพศ"
                value={patient.gender || ""}
                onChange={e => setPatient({ ...patient, gender: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="dob" className="text-black text-xs">
                วันเกิด (YYYY-MM-DD)
              </Label>
              <Input
                id="dob"
                placeholder="วันเกิด (YYYY-MM-DD)"
                value={patient.dob}
                onChange={e => setPatient({ ...patient, dob: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="phone" className="text-black text-xs">
                เบอร์โทร
              </Label>
              <Input
                id="phone"
                placeholder="เบอร์โทร"
                value={patient.phone}
                onChange={e => setPatient({ ...patient, phone: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="address" className="text-black text-xs">
                ที่อยู่
              </Label>
              <Input
                id="address"
                placeholder="ที่อยู่"
                value={patient.address || ""}
                onChange={e => setPatient({ ...patient, address: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="province" className="text-black text-xs">
                จังหวัด
              </Label>
              <Input
                id="province"
                placeholder="จังหวัด"
                value={patient.province || ""}
                onChange={e => setPatient({ ...patient, province: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="district" className="text-black text-xs">
                อำเภอ/เขต
              </Label>
              <Input
                id="district"
                placeholder="อำเภอ/เขต"
                value={patient.district || ""}
                onChange={e => setPatient({ ...patient, district: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />
            </div>
            {/* คอลัมน์ขวา */}
            <div className="space-y-1">
              <Label htmlFor="rights" className="text-black text-xs">
                สิทธิการรักษา
              </Label>
              <Input
                id="rights"
                placeholder="สิทธิการรักษา"
                value={patient.rights || ""}
                onChange={e => setPatient({ ...patient, rights: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="email" className="text-black text-xs">
                อีเมล
              </Label>
              <Input
                id="email"
                placeholder="อีเมล"
                value={patient.email || ""}
                onChange={e => setPatient({ ...patient, email: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="lineId" className="text-black text-xs">
                LINE ID
              </Label>
              <Input
                id="lineId"
                placeholder="LINE ID"
                value={patient.lineId || ""}
                onChange={e => setPatient({ ...patient, lineId: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="emergencyContact" className="text-black text-xs">
                ผู้ติดต่อฉุกเฉิน
              </Label>
              <Input
                id="emergencyContact"
                placeholder="ผู้ติดต่อฉุกเฉิน"
                value={patient.emergencyContact || ""}
                onChange={e => setPatient({ ...patient, emergencyContact: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="emergencyPhone" className="text-black text-xs">
                เบอร์ฉุกเฉิน
              </Label>
              <Input
                id="emergencyPhone"
                placeholder="เบอร์ฉุกเฉิน"
                value={patient.emergencyPhone || ""}
                onChange={e => setPatient({ ...patient, emergencyPhone: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="chief" className="text-black text-xs">
                อาการสำคัญ
              </Label>
              <Input
                id="chief"
                placeholder="อาการสำคัญ"
                value={patient.chief}
                onChange={e => setPatient({ ...patient, chief: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="allergies" className="text-black text-xs">
                แพ้ยา
              </Label>
              <Input
                id="allergies"
                placeholder="แพ้ยา"
                value={patient.allergies}
                onChange={e => setPatient({ ...patient, allergies: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="pmh" className="text-black text-xs">
                โรคประจำตัว
              </Label>
              <Input
                id="pmh"
                placeholder="โรคประจำตัว"
                value={patient.pmh}
                onChange={e => setPatient({ ...patient, pmh: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="meds" className="text-black text-xs">
                ยาที่ใช้ประจำ
              </Label>
              <Input
                id="meds"
                placeholder="ยาที่ใช้ประจำ"
                value={patient.meds}
                onChange={e => setPatient({ ...patient, meds: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="urgency" className="text-black text-xs">
                ความเร่งด่วน
              </Label>
              <Input
                id="urgency"
                placeholder="P1/P2/P3"
                value={patient.urgency}
                onChange={e => setPatient({ ...patient, urgency: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />

              <Label htmlFor="additionalSymptom" className="text-black text-xs">
                อาการเพิ่มเติม
              </Label>
              <Input
                id="additionalSymptom"
                placeholder="อาการเพิ่มเติม"
                value={patient.additionalSymptom || ""}
                onChange={e => setPatient({ ...patient, additionalSymptom: e.target.value })}
                className="mb-1 text-black text-xs h-0 px-2 py-1"
              />
            </div>
          </div>
          <Button onClick={handleRegisterPatient} className="mt-4 w-full text-sm h-2">
            {isWalkIn ? "ลงทะเบียน Walk-in" : "ลงทะเบียน"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}