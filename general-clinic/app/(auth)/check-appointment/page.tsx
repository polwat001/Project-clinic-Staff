'use client';
import { useRouter } from 'next/navigation';
import CitizenIdForm from '../../../components/CitizenIdForm';

export default function CheckAppointmentPage() {
  const router = useRouter();
  const handleSubmit = (citizenId: string) => {
    router.push(`/check-appointment/result?cid=${citizenId}`);
  };
  return (
    <main className="main-bg doctor-bg">
      <CitizenIdForm onSubmit={handleSubmit} label="กรอกเลขประจำตัวประชาชนเพื่อเช็คเวลาหมอนัด" />
    </main>
  );
} 