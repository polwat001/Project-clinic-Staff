'use client';
import { useRouter } from 'next/navigation';
import CitizenIdForm from '../../../components/CitizenIdForm';

export default function CheckBookingPage() {
  const router = useRouter();
  const handleSubmit = (citizenId: string) => {
    router.push(`/check-booking/result?cid=${citizenId}`);
  };
  return (
    <main className="main-bg doctor-bg">
      <CitizenIdForm onSubmit={handleSubmit} label="กรอกเลขประจำตัวประชาชนเพื่อเช็คเวลาที่จอง" />
    </main>
  );
} 