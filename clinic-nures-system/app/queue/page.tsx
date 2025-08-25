"use client";
import NurseQueueBoard from "@/components/NurseQueueBoard";

export default function QueuePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 font-sans">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-black">Queue Board</h2>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[25px] p-8 shadow">
          <NurseQueueBoard />
        </div>
      </div>
    </div>
  );
}