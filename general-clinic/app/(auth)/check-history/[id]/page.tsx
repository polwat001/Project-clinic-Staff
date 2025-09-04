// app/medical-history/[id]/page.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function MedicalHistoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const recordId = params.id;

  // สมมุติข้อมูล (แทนด้วย fetch จริงภายหลัง)
  const record = {
    id: recordId,
    date: '12 มกราคม 2568',
    time: '09:30 น.',
    doctor: 'Dr. สรพงศ์ คนดี',
    diagnosis: 'ไข้หวัดจากไวรัส',
    symptom: 'ปวดหัว ตัวร้อน รู้สึกอ่อนเพลีย',
    advice: 'ดื่มน้ำมาก พักผ่อน 8 ชั่วโมง ถ้าไม่ดีขึ้นใน 3 วันให้กลับมาตรวจ',
    drug: {
      name: 'ยาพาราเซตามอล',
      generic: 'Acetaminophen',
      dose: '500 มก.',
      amount: '10 เม็ด',
      usage: 'รับประทานวันละ 1 เม็ด หลังอาหาร เช้า-เย็น',
      caution: 'อาจง่วง ห้ามขับขี่',
    },
    image: '/pill-placeholder.png',
  };

  return (
    <main className="main-bg min-h-screen flex flex-col items-center py-8 px-2">
      <div className="history-card w-full max-w-xl text-[#222] space-y-4">
        <div className="bg-[#f0f9ff] p-4 rounded-xl shadow-md">
          <div className="text-lg font-semibold mb-2">📅 วันที่ตรวจ {record.date} เวลา {record.time}</div>
          <div>👨‍⚕️ แพทย์ผู้ตรวจ : <b>{record.doctor}</b></div>
          <div>คำวินิจฉัย: {record.diagnosis}</div>
          <div>อาการผู้ป่วย: {record.symptom}</div>
        </div>

        <div className="bg-[#f0f9ff] p-4 rounded-xl shadow-md">{record.advice}</div>

        <div className="bg-[#f0f9ff] p-4 rounded-xl shadow-md">
          <p><b>ชื่อยา:</b> {record.drug.name}</p>
          <p><b>ชื่อทางการ:</b> {record.drug.generic}</p>
          <p><b>ขนาด:</b> {record.drug.dose}</p>
          <p><b>ปริมาณ:</b> {record.drug.amount}</p>
          <p><b>วิธีใช้:</b> {record.drug.usage}</p>
          <p><b>ผลข้างเคียง:</b> {record.drug.caution}</p>
          <div className="flex justify-center mt-4">
            <img src={record.image} alt="ยา" className="w-24 h-24 rounded-full shadow" />
          </div>
        </div>

        <button className="action-btn white mt-4" onClick={() => router.back()}>ย้อนกลับ</button>
      </div>
    </main>
  );
}
