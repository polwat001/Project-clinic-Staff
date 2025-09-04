'use client';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CheckAppointmentResultPage() {
  const params = useSearchParams();
  const router = useRouter();
  const cid = params.get('cid');

  // ตัวอย่างข้อมูล (ควรดึงจาก backend จริง)
  const appointment = {
    date: '09/08/2568',
    time: '14.00 น.',
    doctor: '.............',
  };

  return (
    <main className="main-bg doctor-bg flex flex-col items-center min-h-screen py-8 px-2">
      <div className="appointment-card">
        <h2 className="appointment-title">เช็คเวลาหมอนัด</h2>
        <div className="appointment-info">
          <div>วันที่ <b>{appointment.date}</b> เวลา <b>{appointment.time}</b></div>
          <div>แพทย์ <b>{appointment.doctor}</b></div>
        </div>
      </div>
      <button className="action-btn white appointment-back-btn" onClick={() => router.back()}>ย้อนกลับ</button>
    </main>
  );
} 