"use client";
import NurseRegisterForm from "@/components/NurseRegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 font-sans">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-8 text-black">ลงทะเบียนผู้ป่วยใหม่</h2>
        <div className="bg-green-50 border-2 border-green-200 rounded-[25px] p-8 shadow">
          <NurseRegisterForm />
        </div>
      </div>
    </div>
  );
}