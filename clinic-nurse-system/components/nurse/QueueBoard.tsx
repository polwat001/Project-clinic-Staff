import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QueueItem } from "@/types"; // Assuming QueueItem is defined in your types

interface QueueBoardProps {
  queue: QueueItem[];
  selected: QueueItem | null;
  setSelected: (item: QueueItem | null) => void;
  handleSkipQueue: (item: QueueItem) => void;
  handleRemoveQueue: (item: QueueItem) => void;
}

const QueueBoard: React.FC<QueueBoardProps> = ({ queue, selected, setSelected, handleSkipQueue, handleRemoveQueue }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Queue Board</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {queue.map((item) => (
            <li key={item.q} className={`flex justify-between items-center p-2 ${selected?.q === item.q ? 'bg-blue-100' : ''}`}>
              <div>
                <strong>{item.name}</strong> (HN: {item.hn}) - {item.status}
              </div>
              <div>
                <Button onClick={() => setSelected(item)}>Select</Button>
                <Button variant="destructive" onClick={() => handleRemoveQueue(item)}>Remove</Button>
                <Button variant="outline" onClick={() => handleSkipQueue(item)}>Skip</Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default QueueBoard;