import React from 'react';

const reminders = [
  'ยืนยันสิทธิ์ของคุณ โทร 012-345-6789 เพื่อตรวจสอบว่าคุณอยู่ในกลุ่มฉีดวัคซีนที่เข้าเกณฑ์ในช่วงเวลานี้หรือไม่',
  'จองช่วงฉีดวัคซีนล่วงหน้า 1-2 วัน',
  'อย่าลืมปฏิบัติตามมาตรการความปลอดภัยที่เหมาะสมขณะอยู่ในสถานที่สำหรับฉีดวัคซีน',
  'ขอตารางสำหรับการฉีดวัคซีนครั้งที่สองของคุณ',
  'ไปให้ห้องสังเกตการณ์หลังฉีดวัคซีนแล้ว',
];

export default function VaccineReminder() {
  return (
    <section className="vaccine-reminder-section">
      <h2 className="vaccine-reminder-title">การเตือนความจำที่สำคัญสำหรับการฉีดวัคซีนโควิด-19</h2>
      <div className="vaccine-reminder-list">
        {reminders.map((reminder, idx) => (
          <div className="vaccine-reminder-item" key={idx}>
            <span className="reminder-number">{idx + 1}</span>
            <span>{reminder}</span>
          </div>
        ))}
      </div>
    </section>
  );
} 