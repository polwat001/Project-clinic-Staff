'use client';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CheckBookingResultPage() {
  const params = useSearchParams();
  const router = useRouter();
  const cid = params.get('cid');

  // ตัวอย่างข้อมูล (ควรดึงจาก backend จริง)
  const booking = {
    date: '08/07/2568',
    time: '14.00 น.',
  };

  return (
    <main className="main-bg doctor-bg flex flex-col items-center min-h-screen py-8 px-2">
      <div className="appointment-card">
        <h2 className="appointment-title">เช็คเวลาจอง</h2>
        <div className="appointment-info">
          <div>วันที่ <b>{booking.date}</b> เวลา <b>{booking.time}</b></div>
        </div>
      </div>
      <button className="action-btn white appointment-back-btn" onClick={() => router.back()}>ย้อนกลับ</button>
    </main>
  );
} 