"use client";
import NurseCasesView from "@/components/NurseCasesView";

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 font-sans">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-black">ดูประวัติเคสย้อนหลัง</h2>
        <div className="bg-gray-50 border-2 border-gray-200 rounded-[25px] p-8 shadow">
          <NurseCasesView />
        </div>
      </div>
    </div>
  );
}