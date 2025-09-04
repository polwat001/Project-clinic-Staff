'use client';
import { useRouter } from 'next/navigation';

export default function MedicalHistoryPage() {
  const router = useRouter();

  const history = [
    {
      id: '1',
      date: '12/มกราคม/2568',
      doctor: 'Dr. สรพงศ์ คนดี',
      symptom: 'ปวดหัว ตัวร้อน',
      drug: 'ยาพาราเซตามอล',
    },
  ];

  return (
    <main className="main-bg doctor-bg flex flex-col items-center min-h-screen py-8 px-2">
      <div className="history-card">
        <h2 className="history-title">ประวัติรักษา</h2>
        <div className="history-search-row">
          <span className="history-search-icon">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <rect width="32" height="32" rx="8" fill="#fff" />
              <rect x="6" y="10" width="20" height="12" rx="3" fill="#b3e0ff" />
              <rect x="6" y="7" width="20" height="5" rx="2" fill="#3b82f6" />
              <rect x="10" y="4" width="2" height="6" rx="1" fill="#2563eb" />
              <rect x="20" y="4" width="2" height="6" rx="1" fill="#2563eb" />
            </svg>
          </span>
          <span className="history-search-label">ค้นหา วัน/เดือน/ปี</span>
        </div>
        <div className="history-list">
          {history.map((item, idx) => (
            <div
              key={item.id}
              className="history-item cursor-pointer hover:bg-[#f0f9ffaa] transition"
              onClick={() => router.push(`/check-history/${item.id}`)}
            >
              <div>วันที่ตรวจ <b>{item.date}</b></div>
              <div>ชื่อแพทย์ผู้ตรวจ <b>{item.doctor}</b></div>
              <div>อาการป่วย : {item.symptom}</div>
              <div>รายการยา : {item.drug}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="action-btn white history-back-btn" onClick={() => router.back()}>ย้อนกลับ</button>
    </main>
  );
}
