'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IdCard } from 'lucide-react';

const bookedTimes = ['11:00']; // ตัวอย่างเวลาที่ถูกจองแล้ว

const timeSlots = [
  '09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00',
  '17:00','18:00','19:00','20:00',
  '21:00','22:00'
];

const timeSlotsWithIcons = [
  { time: '09:00', icon: '🕘' },
  { time: '10:00', icon: '🕙' },
  { time: '11:00', icon: '🕚' },
  { time: '12:00', icon: '🕛' },
  { time: '13:00', icon: '🕐' },
  { time: '14:00', icon: '🕑' },
  { time: '15:00', icon: '🕒' },
  { time: '16:00', icon: '🕓' },
  { time: '17:00', icon: '🕔' },
  { time: '18:00', icon: '🕕' },
  { time: '19:00', icon: '🕖' },
  { time: '20:00', icon: '🕗' },
  { time: '21:00', icon: '🕘' },
  { time: '22:00', icon: '🕙' }
]
export default function BookingForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const isTimeBooked = (time: string) => bookedTimes.includes(time);
  const isTimeSelected = (time: string) => selectedTime === time;
  const canSubmit = name && phone && date && selectedTime && !isTimeBooked(selectedTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (canSubmit) {
      // ✅ Redirect พร้อมส่งข้อมูลผ่าน query string
      const params = new URLSearchParams({
        name,
        date,
        time: selectedTime,
      });
      router.push(`/booking/success?${params.toString()}`);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <label className="booking-label">
        ชื่อ-นามสกุล
        <input
          className="booking-input"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="กรอกชื่อ-นามสกุล"
          required
        />
      </label>
      <label className="booking-label">
        รหัสประจำตัวประชาชน
        <input
          className="booking-input"
          type="text"
          value={name}
          onChange={e => setPhone(e.target.value)}
          placeholder="กรอกรหัสประจำตัวประชาชน"
          required
        />
      </label>

      <label className="booking-label">
        เบอร์โทร
        <input
          className="booking-input"
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="กรอกเบอร์โทร"
          required
        />
      </label>

      <label className="booking-label">
        วันที่จอง
        <div className="booking-date-row">
          <span className="booking-date-icon">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
              <rect width="36" height="36" rx="8" fill="#fff" />
              <rect x="7" y="12" width="22" height="15" rx="3" fill="#b3e0ff" />
              <rect x="7" y="9" width="22" height="6" rx="2" fill="#3b82f6" />
              <rect x="11" y="6" width="2" height="6" rx="1" fill="#2563eb" />
              <rect x="23" y="6" width="2" height="6" rx="1" fill="#2563eb" />
            </svg>
          </span>
          <input
            className="booking-input booking-date-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
      </label>

      <div className="booking-label">
        เลือกเวลา
        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {timeSlots.map(time => (
            <button
              type="button"
              key={time}
              className={`booking-timeslot-btn${
                isTimeBooked(time)
                  ? ' booked'
                  : isTimeSelected(time)
                  ? ' selected'
                  : ''
              }`}
              onClick={() => !isTimeBooked(time) && setSelectedTime(time)}
              disabled={isTimeBooked(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="action-btn blue booking-submit-btn"
        disabled={!canSubmit}
      >
        จอง
      </button>
    </form>
  );
}
