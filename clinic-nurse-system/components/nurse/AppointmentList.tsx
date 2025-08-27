import React from 'react';
import { Appointment } from '@/types'; // Adjust the import path as necessary
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AppointmentListProps {
  appointments: Appointment[];
  searchText: string;
  setSearchText: (text: string) => void;
  handleCheckInOnline: (appt: Appointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, searchText, setSearchText, handleCheckInOnline }) => {
  const filteredAppointments = appointments.filter(appt => 
    appt.hn.includes(searchText) || 
    appt.patient_name?.toLowerCase().includes(searchText.toLowerCase()) || 
    appt.chief?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Input 
        placeholder="ค้นหาผู้ป่วย (HN, ชื่อ, อาการ)" 
        value={searchText} 
        onChange={(e) => setSearchText(e.target.value)} 
      />
      <ul>
        {filteredAppointments.map(appt => (
          <li key={appt.id}>
            <span>{appt.patient_name} - {appt.scheduled_at}</span>
            <Button onClick={() => handleCheckInOnline(appt)}>เช็คอิน</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;