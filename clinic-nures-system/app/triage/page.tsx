"use client";
import NurseTriageForm from "@/components/NurseTriageForm";

export default function TriagePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 font-sans">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-8 text-black">
          ตรวจเบื้องต้น / ส่งต่อแพทย์
        </h2>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[25px] p-8 shadow">
          <NurseTriageForm />
        </div>
      </div>
    </div>
  );
}