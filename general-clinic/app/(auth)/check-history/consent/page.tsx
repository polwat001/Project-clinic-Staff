'use client';
import { useRouter } from 'next/navigation';
import ConsentForm from '../../../../components/ConsentForm';

export default function CheckAppointmentConsentPage() {
  const router = useRouter();
  return (
    <main className="main-bg doctor-bg">
      <ConsentForm onAccept={() => router.push('/check-history')} />
    </main>
  );
} 