'use client';
import { useRouter } from 'next/navigation';
import CitizenIdForm from '../../../components/CitizenIdForm';

export default function CheckHistoryPage() {
  const router = useRouter();
  const handleSubmit = (citizenId: string) => {
    router.push(`/check-history/result?cid=${citizenId}`);
  };
  return (
    <main className="main-bg doctor-bg">
      <CitizenIdForm onSubmit={handleSubmit} label="กรอกเลขประจำตัวประชาชนเพื่อเช็คประวัติรักษา" />
    </main>
  );
} 