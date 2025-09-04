'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BookingSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const name = params.get('name');
  const date = params.get('date');
  const time = params.get('time');

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 3500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#e6f6ff] px-4 py-10 text-center relative">
      <div className="bubbles-bg">
        <span className="bubble bubble1"></span>
        <span className="bubble bubble2"></span>
        <span className="bubble bubble3"></span>
      </div>
      <div className="success-card animate-pop">
        <div className="success-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="32" fill="#4ade80"/><path d="M20 34l8 8 16-16" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 className="success-title">จองสำเร็จแล้ว!</h1>
        <p className="success-thank">ขอบคุณคุณ <span className="font-semibold text-[#3b82f6]">{name}</span></p>
        <div className="success-detail">
          <span>วันที่นัด: <b>{date}</b></span>
          <span>เวลา: <b>{time}</b></span>
        </div>
        <p className="success-back">กำลังนำคุณกลับไปที่หน้าแรก...</p>
        <button className="action-btn green mt-4" onClick={() => router.push('/')}>กลับหน้าแรกทันที</button>
      </div>
    </main>
  );
}
