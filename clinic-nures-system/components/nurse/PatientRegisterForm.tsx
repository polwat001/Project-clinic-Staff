import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  onSuccess?: () => void; // เพิ่ม prop นี้
}

export default function PatientRegisterForm({
  patient,
  setPatient,
  isWalkIn,
  onSuccess,
}: Props) {
  const router = useRouter();

  async function generateNextHN() {
    // ดึง HN ล่าสุดจากฐานข้อมูล
    const { data, error } = await supabase
      .from("patients")
      .select("hn")
      .order("hn", { ascending: false })
      .limit(1);

    if (error) return "HN0001";
    let lastHN = data && data[0]?.hn;
    let nextNumber = 1;
    if (lastHN && /^HN\d+$/.test(lastHN)) {
      nextNumber = parseInt(lastHN.replace("HN", ""), 10) + 1;
    }
    return `HN${nextNumber.toString().padStart(4, "0")}`;
  }

  const handleRegisterPatient = async (event: React.MouseEvent) => {
    event.preventDefault(); // ป้องกัน reload หน้า

    if (!patient.idCard) {
      alert("กรุณากรอกเลขบัตรประชาชน");
      return;
    }

    // สร้าง HN อัตโนมัติ
    const hn = await generateNextHN();

    const patientForInsert = {
      hn,
      id_card: patient.idCard ?? "",
      prefix: patient.prefix ?? "",
      first_name: patient.firstName ?? "",
      last_name: patient.lastName ?? "",
      gender: patient.gender ?? "",
      dob: patient.dob ?? "",
      phone: patient.phone ?? "",
      address: patient.address ?? "",
      province: patient.province ?? "",
      district: patient.district ?? "",
      rights: patient.rights ?? "",
      email: patient.email ?? "",
      line_user_id: patient.lineId ?? "",
      emergency_contact: patient.emergencyContact ?? "",
      emergency_phone: patient.emergencyPhone ?? "",
      allergies: patient.allergies ?? "",
      pmh: patient.pmh ?? "",
      created_at: new Date().toISOString(),
      name: patient.name ?? "",
      is_active: true,
    };

    const { data, error } = await supabase
      .from("patients")
      .insert([patientForInsert]);

    if (error) {
      alert("บันทึกข้อมูลไม่สำเร็จ: " + error.message);
    } else {
      alert("บันทึกข้อมูลสำเร็จ");
      console.log("call onSuccess");
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Card>
      <CardContent className="text-black">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {/* คอลัมน์ซ้าย */}
            <div className="flex flex-col gap-2">
              <div>
                <Label htmlFor="hn" className="block text-black text-xs mb-1">
                  HN (อัตโนมัติ)
                </Label>
                <Input
                  id="hn"
                  placeholder="ถูกสร้างอัตโนมัติ"
                  value={patient.hn ?? ""}
                  disabled
                  className="text-black bg-gray-100 text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="prefix" className="block text-black text-xs mb-1">
                  คำนำหน้า
                </Label>
                <select
                  id="prefix"
                  value={patient.prefix || ""}
                  onChange={e => setPatient({ ...patient, prefix: e.target.value })}
                  className="text-black text-xs px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                >
                  <option value="">-- เลือกคำนำหน้า --</option>
                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="นางสาว">นางสาว</option>
                  <option value="เด็กชาย">เด็กชาย</option>
                  <option value="เด็กหญิง">เด็กหญิง</option>
             
                </select>
              </div>
              <div>
                <Label htmlFor="firstName" className="block text-black text-xs mb-1">
                  ชื่อจริง
                </Label>
                <Input
                  id="firstName"
                  placeholder="ชื่อจริง"
                  value={patient.firstName || ""}
                  onChange={(e) => setPatient({ ...patient, firstName: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="block text-black text-xs mb-1">
                  นามสกุล
                </Label>
                <Input
                  id="lastName"
                  placeholder="นามสกุล"
                  value={patient.lastName || ""}
                  onChange={(e) => setPatient({ ...patient, lastName: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="gender" className="block text-black text-xs mb-1">
                  เพศ
                </Label>
                <select
                  id="gender"
                  value={patient.gender || ""}
                  onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                  className="text-black text-xs px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                >
                  <option value="">-- เลือกเพศ --</option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>
              <div>
                <Label htmlFor="dob" className="block text-black text-xs mb-1">
                  วันเกิด (YYYY-MM-DD)
                </Label>
                <Input
                  id="dob"
                  placeholder="วันเกิด (YYYY-MM-DD)"
                  value={patient.dob}
                  onChange={(e) => setPatient({ ...patient, dob: e.target.value })}
                  type="date"
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="block text-black text-xs mb-1">
                  เบอร์โทร
                </Label>
                <Input
                  id="phone"
                  placeholder="เบอร์โทร"
                  value={patient.phone ?? ""}
                  onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="address" className="block text-black text-xs mb-1">
                  ที่อยู่
                </Label>
                <Input
                  id="address"
                  placeholder="ที่อยู่"
                  value={patient.address || ""}
                  onChange={(e) => setPatient({ ...patient, address: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="province" className="block text-black text-xs mb-1">
                  จังหวัด
                </Label>
                <Input
                  id="province"
                  placeholder="จังหวัด"
                  value={patient.province || ""}
                  onChange={(e) => setPatient({ ...patient, province: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="district" className="block text-black text-xs mb-1">
                  อำเภอ/เขต
                </Label>
                <Input
                  id="district"
                  placeholder="อำเภอ/เขต"
                  value={patient.district || ""}
                  onChange={(e) => setPatient({ ...patient, district: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
            </div>
            {/* คอลัมน์ขวา */}
            <div className="flex flex-col gap-2">
              <div>
                <Label htmlFor="idCard" className="block text-black text-xs mb-1">
                  เลขบัตรประชาชน
                </Label>
                <Input
                  id="idCard"
                  placeholder="เลขบัตรประชาชน"
                  value={patient.idCard || ""}
                  onChange={(e) => setPatient({ ...patient, idCard: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-black text-xs mb-1">
                  อีเมล
                </Label>
                <Input
                  id="email"
                  placeholder="อีเมล"
                  value={patient.email || ""}
                  onChange={(e) => setPatient({ ...patient, email: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="rights" className="block text-black text-xs mb-1">
                  สิทธิการรักษา
                </Label>
                <Input
                  id="rights"
                  placeholder="สิทธิการรักษา"
                  value={patient.rights || ""}
                  onChange={(e) => setPatient({ ...patient, rights: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="lineId" className="block text-black text-xs mb-1">
                  LINE ID
                </Label>
                <Input
                  id="lineId"
                  placeholder="LINE ID"
                  value={patient.lineId || ""}
                  onChange={(e) => setPatient({ ...patient, lineId: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact" className="block text-black text-xs mb-1">
                  ชื่อผู้ติดต่อฉุกเฉิน
                </Label>
                <Input
                  id="emergencyContact"
                  placeholder="ชื่อผู้ติดต่อฉุกเฉิน"
                  value={patient.emergencyContact || ""}
                  onChange={(e) => setPatient({ ...patient, emergencyContact: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone" className="block text-black text-xs mb-1">
                  เบอร์โทรผู้ติดต่อฉุกเฉิน
                </Label>
                <Input
                  id="emergencyPhone"
                  placeholder="เบอร์โทรผู้ติดต่อฉุกเฉิน"
                  value={patient.emergencyPhone || ""}
                  onChange={(e) => setPatient({ ...patient, emergencyPhone: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="allergies" className="block text-black text-xs mb-1">
                  ประวัติแพ้ยา
                </Label>
                <Input
                  id="allergies"
                  placeholder="ประวัติแพ้ยา"
                  value={patient.allergies || ""}
                  onChange={(e) => setPatient({ ...patient, allergies: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="pmh" className="block text-black text-xs mb-1">
                  ประวัติการรักษา
                </Label>
                <Input
                  id="pmh"
                  placeholder="ประวัติการรักษา"
                  value={patient.pmh || ""}
                  onChange={(e) => setPatient({ ...patient, pmh: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="chief" className="block text-black text-xs mb-1">
                  อาการสำคัญที่มาพบแพทย์
                </Label>
                <Input
                  id="chief"
                  placeholder="อาการสำคัญที่มาพบแพทย์"
                  value={patient.chief || ""}
                  onChange={(e) => setPatient({ ...patient, chief: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>
              <div>
                <Label htmlFor="meds" className="block text-black text-xs mb-1">
                  ยาที่ใช้ประจำ
                </Label>
                <Input
                  id="meds"
                  placeholder="ยาที่ใช้ประจำ"
                  value={patient.meds || ""}
                  onChange={(e) => setPatient({ ...patient, meds: e.target.value })}
                  className="text-black text-xs px-2 py-1 w-full"
                />
              </div>

            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={handleRegisterPatient}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all"
            >
              {isWalkIn ? "ลงทะเบียนผู้ป่วยใหม่" : "บันทึกข้อมูลผู้ป่วย"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}