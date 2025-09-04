'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CitizenIdForm({ onSubmit, label = "กรอกเลขประจำตัวประชาชน" }: { onSubmit: (id: string) => void, label?: string }) {
  const [citizenId, setCitizenId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{13}$/.test(citizenId)) {
      setError('กรุณากรอกเลข 13 หลัก');
      return;
    }
    setError('');
    onSubmit(citizenId);
  };

  return (
    <form className="citizen-form" onSubmit={handleSubmit}>
      <h2 className="citizen-form-title">เช็คข้อมูล</h2>
      <label className="citizen-form-label">{label}</label>
      <input
        className="citizen-form-input text-black"
        type="text"
        maxLength={13}
        value={citizenId}
        onChange={e => setCitizenId(e.target.value.replace(/[^0-9]/g, ''))}
        placeholder="กรอกเลข 13 หลัก"
        required
      />
      {error && <div className="citizen-form-error">{error}</div>}
      <button className="action-btn green citizen-form-btn" type="submit">ตกลง</button>
      <button type="button" className="action-btn white citizen-form-btn mt-2" onClick={() => router.push('/')}>ย้อนกลับหน้าหลัก</button>
    </form>
  );
} 