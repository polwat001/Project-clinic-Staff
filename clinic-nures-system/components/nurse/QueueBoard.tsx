import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QueueItem {
  q: string;
  hn: string;
  name: string;
  type: string;
  status: string;
  room: string;
  apptId: string | null;
  triage: string;
}

interface Props {
  queue: QueueItem[];
  selected: QueueItem | null;
  setSelected: (item: QueueItem | null) => void;
  setIsWalkIn: (val: boolean) => void;
  handleSkipQueue: (item: QueueItem) => void;
  handleRemoveQueue: (item: QueueItem) => void;
}

export default function QueueBoard({
  queue,
  selected,
  setSelected,
  setIsWalkIn,
  handleSkipQueue,
  handleRemoveQueue,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>คิวผู้ป่วย</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {queue.map(item => (
            <li
              key={item.q}
              className={`flex justify-between items-center p-2 rounded cursor-pointer ${selected?.q === item.q ? "bg-blue-100" : ""}`}
              onClick={() => { setSelected(item); setIsWalkIn(item.type === "walkin"); }}
            >
              <div>
                <div className="font-bold">{item.name || "Walk-in"}</div>
                <div className="text-xs text-gray-500">HN: {item.hn || "-"} | คิว: {item.q} | สถานะ: {item.status}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={e => { e.stopPropagation(); handleSkipQueue(item); }}>
                  ข้าม
                </Button>
                <Button size="sm" variant="destructive" onClick={e => { e.stopPropagation(); handleRemoveQueue(item); }}>
                  ลบ
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}