"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NurseQueueBoard() {
  const [queue, setQueue] = useState([]);
  useEffect(() => { fetchQueue(); }, []);
  const fetchQueue = async () => {
    const { data } = await supabase.from("queues").select("*");
    setQueue(data || []);
  };
  const handleRefresh = fetchQueue;
  const handleExportCSV = () => {
    const csv = [
      ["Queue", "HN", "Name", "Type", "Status", "Room", "Urgency"].join(","),
      ...queue.map(q => [q.queue_no, q.hn, q.name, q.kind, q.status, q.room, q.priority].map(x => `"${x||''}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "queue_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleRemoveQueue = async (qItem) => {
    await supabase.from("queues").delete().eq("queue_no", qItem.queue_no);
    fetchQueue();
    alert("ลบคิวสำเร็จ");
  };
  const handleSkipQueue = async (qItem) => {
    await supabase.from("queues").update({ status: "SKIPPED" }).eq("queue_no", qItem.queue_no);
    fetchQueue();
    alert("ข้ามคิวสำเร็จ");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl border p-8 shadow">
      <h2 className="text-xl font-bold mb-6">Queue Board</h2>
      <div className="flex gap-2 mb-4">
        <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleRefresh}>รีเฟรชคิว</button>
        <button className="px-4 py-2 rounded bg-gray-700 text-white" onClick={handleExportCSV}>Export CSV</button>
      </div>
      <div className="space-y-2">
        {queue.map(q => (
          <div key={q.queue_no} className="border rounded-lg p-4 flex justify-between items-center bg-gray-50">
            <div>
              <div className="font-bold">{q.name}</div>
              <div className="text-xs">Queue: {q.queue_no} | Status: {q.status}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded bg-green-600 text-white">เลือก</button>
              <button className="px-4 py-2 rounded bg-yellow-100 text-yellow-800" onClick={() => handleSkipQueue(q)}>ข้ามคิว</button>
              <button className="px-4 py-2 rounded bg-red-100 text-red-800" onClick={() => handleRemoveQueue(q)}>ลบ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}