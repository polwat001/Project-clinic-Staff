"use client";
import NurseSearchPatient from "@/components/NurseSearchPatient";
import Container from "@/components/ui/Container";
import Input from "@/components/ui/Input";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 font-sans">
      <div className="flex gap-8 w-full max-w-5xl">
        <Container className="w-1/2">
          <div className="font-bold text-2xl mb-4">ค้นหาชื่อผู้ป่วย</div>
          <Input placeholder="พิมพ์ชื่อ, HN, เบอร์" />
          {/* ...รายการผู้ป่วย... */}
        </Container>
        <Container className="w-1/2 flex items-center justify-center text-[#B4AAAA] text-xl">
          เลือกผู้ป่วยทางซ้ายเพื่อเริ่มต้น
        </Container>
      </div>
    </div>
  );
}