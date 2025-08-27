import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types'; // Adjust the import based on your actual types file location

interface SearchPatientSectionProps {
  registeredPatients: Patient[];
  searchPatientText: string;
  setSearchPatientText: (text: string) => void;
  filteredRegisteredPatients: Patient[];
  setSelectedRegisteredPatient: (patient: Patient | null) => void;
  setIsWalkIn: (isWalkIn: boolean) => void;
  patient: Patient;
  setPatient: (patient: Patient) => void;
  handleRefreshQueue: () => void;
}

const SearchPatientSection: React.FC<SearchPatientSectionProps> = ({
  registeredPatients,
  searchPatientText,
  setSearchPatientText,
  filteredRegisteredPatients,
  setSelectedRegisteredPatient,
  setIsWalkIn,
  patient,
  setPatient,
  handleRefreshQueue,
}) => {
  const handleSelectPatient = (patient: Patient) => {
    setSelectedRegisteredPatient(patient);
    setPatient(patient);
    setIsWalkIn(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">ค้นหาผู้ป่วย</h2>
      <Input
        type="text"
        placeholder="ค้นหาผู้ป่วยตามชื่อหรือรหัสบัตรประชาชน"
        value={searchPatientText}
        onChange={(e) => setSearchPatientText(e.target.value)}
      />
      <Button onClick={handleRefreshQueue}>รีเฟรชคิว</Button>
      <ul className="space-y-2">
        {filteredRegisteredPatients.map((patient) => (
          <li key={patient.hn} className="flex justify-between items-center p-2 border rounded">
            <span>{patient.name} ({patient.hn})</span>
            <Button onClick={() => handleSelectPatient(patient)}>เลือก</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPatientSection;