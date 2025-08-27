import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface Case {
  caseId: string;
  idCard: string;
  name: string;
  chief: string;
  diagnosis: string;
  medicines: Array<{
    name: string;
    dosage: string;
    instructions: string; 
  }>;
  notes?: string;
  appointment?: {
    id: string;
    date: string;
    room?: string;
  };
}

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!url || !key) return null;
  return createClient(url, key);
};

const CaseHistorySection: React.FC<{ patientHN: string }> = ({ patientHN }) => {
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    const fetchCases = async () => {
      const sb = getSupabase();
      if (!sb) return;

      const { data, error } = await sb.from('cases').select('*').eq('hn', patientHN);
      if (error) {
        console.error('Error fetching cases:', error);
      } else {
        setCases(data || []);
      }
    };

    if (patientHN) {
      fetchCases();
    }
  }, [patientHN]);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Case History</CardTitle>
      </CardHeader>
      <CardContent>
        {cases.length > 0 ? (
          <ul className="space-y-4">
            {cases.map((caseItem) => (
              <li key={caseItem.caseId} className="border-b pb-2">
                <h3 className="font-semibold">{caseItem.name}</h3>
                <p><strong>Chief Complaint:</strong> {caseItem.chief}</p>
                <p><strong>Diagnosis:</strong> {caseItem.diagnosis}</p>
                <p><strong>Medicines:</strong> {caseItem.medicines.map(m => `${m.name} (${m.dosage})`).join(', ')}</p>
                {caseItem.notes && <p><strong>Notes:</strong> {caseItem.notes}</p>}
                {caseItem.appointment && (
                  <p>
                    <strong>Appointment:</strong> {caseItem.appointment.date} in Room {caseItem.appointment.room}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No case history available for this patient.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CaseHistorySection;