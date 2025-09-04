'use client';
import { useRouter } from 'next/navigation';

export default function MedicalHistoryDetailPage() {
  const router = useRouter();

  return (
    <main className="main-bg min-h-screen px-4 py-8 flex flex-col items-center">
      <div className="history-card w-full max-w-xl">
        <div className="text-base text-left space-y-4 text-[#222]">

          {/* วันที่และแพทย์ */}
          <div className="bg-[#f0f9ff] p-4 rounded-xl shadow-md">
            <div className="text-lg font-semibold mb-2">📅 วันที่ตรวจ 12 มกราคม 2568 เวลา 09:30 น.</div>
            <div className="text-md">👨‍⚕️ แพทย์ผู้ตรวจ : <b>Dr. สรพงศ์ คนดี</b></div>
            <div>คำวินิจฉัย: ไข้หวัดจากการติดเชื้อไวรัส</div>
            <div>อาการผู้ป่วย: ปวดหัว ตัวร้อน รู้สึกอ่อนเพลีย</div>
          </div>

          {/* คำแนะนำ */}
          <div className="bg-[#f0f9ff] p-4 rounded-xl shadow-md">
            ดื่มน้ำมาก ๆ นอนพักอย่างน้อย 8 ชั่วโมง<br />
            หากมีไข้เกิน 3 วัน ให้กลับมาตรวจซ้ำ
          </div>

          {/* ยาและคำแนะนำการใช้ยา */}
          <div className="bg-[#f0f9ff] p-4 rounded-xl shadow-md">
            <p><b>ชื่อยา:</b> ยาพาราเซตามอล</p>
            <p><b>ชื่อทางการ:</b> อะเซตามิโนเฟน (Acetaminophen)</p>
            <p><b>ขนาด:</b> 500 มก.</p>
            <p><b>ปริมาณ:</b> 10 เม็ด</p>
            <p><b>วิธีใช้:</b> รับประทานครั้งละ 1 เม็ด หลังอาหาร เช้า-เย็น</p>
            <p><b>ผลข้างเคียง:</b> อาจมีอาการง่วงนอน ห้ามขับขี่ยานพาหนะ</p>

            {/* ภาพเม็ดยา */}
            <div className="flex justify-center mt-4">
              <img
                src="/pill-placeholder.png" // เปลี่ยนเป็นรูปจริงหากมี
                alt="ยาเม็ด"
                className="w-24 h-24 rounded-full shadow"
              />
            </div>
          </div>
        </div>

        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => router.back()}
          className="action-btn white mt-6"
        >
          ย้อนกลับ
        </button>
      </div>
    </main>
  );
}
