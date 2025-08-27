import React, { useState } from "react";
import { Button, Input, Label, Textarea } from "@/components/ui"; // Adjust the import path as necessary

interface Patient {
  hn: string;
  name: string;
  phone: string;
  dob: string;
  idCard?: string;
  prefix?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  address?: string;
  province?: string;
  district?: string;
  rights?: string;
  email?: string;
  lineId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies?: string;
  pmh?: string;
  meds?: string;
  urgency?: string;
  chief?: string;
  additionalSymptom?: string;
}

interface PatientRegisterFormProps {
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient>>;
  handleRegisterPatient: () => Promise<void>;
  isWalkIn: boolean;
}

const PatientRegisterForm: React.FC<PatientRegisterFormProps> = ({ patient, setPatient, handleRegisterPatient, isWalkIn }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleRegisterPatient(); }}>
      <div>
        <Label htmlFor="hn">HN</Label>
        <Input
          id="hn"
          value={patient.hn}
          onChange={(e) => setPatient({ ...patient, hn: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={patient.name}
          onChange={(e) => setPatient({ ...patient, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={patient.phone}
          onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          type="date"
          id="dob"
          value={patient.dob}
          onChange={(e) => setPatient({ ...patient, dob: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="idCard">ID Card</Label>
        <Input
          id="idCard"
          value={patient.idCard}
          onChange={(e) => setPatient({ ...patient, idCard: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={patient.address}
          onChange={(e) => setPatient({ ...patient, address: e.target.value })}
        />
      </div>
      <div>
        <Button type="submit">{isWalkIn ? "Register Walk-in Patient" : "Register Patient"}</Button>
      </div>
    </form>
  );
};

export default PatientRegisterForm;