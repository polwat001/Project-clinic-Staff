"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Vitals } from "@/types"; // Assuming Vitals is defined in the types directory

interface TriageFormProps {
  patient: any; // Replace with the appropriate type for patient
  vitals: Vitals;
  setVitals: React.Dispatch<React.SetStateAction<Vitals>>;
  noteS: string;
  setNoteS: React.Dispatch<React.SetStateAction<string>>;
  noteO: string;
  setNoteO: React.Dispatch<React.SetStateAction<string>>;
  noteA: string;
  setNoteA: React.Dispatch<React.SetStateAction<string>>;
  noteP: string;
  setNoteP: React.Dispatch<React.SetStateAction<string>>;
  handleSaveVitals: () => Promise<void>;
  selected: any; // Replace with the appropriate type for selected
  clientTime: string;
  handleQuickWalkIn: () => Promise<void>;
  advanceToDoctor: () => Promise<void>;
}

const TriageForm: React.FC<TriageFormProps> = ({
  patient,
  vitals,
  setVitals,
  noteS,
  setNoteS,
  noteO,
  setNoteO,
  noteA,
  setNoteA,
  noteP,
  setNoteP,
  handleSaveVitals,
  selected,
  clientTime,
  handleQuickWalkIn,
  advanceToDoctor,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Triage Form</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sys">Systolic BP</Label>
          <Input
            id="sys"
            value={vitals.sys}
            onChange={(e) => setVitals({ ...vitals, sys: e.target.value })}
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="dia">Diastolic BP</Label>
          <Input
            id="dia"
            value={vitals.dia}
            onChange={(e) => setVitals({ ...vitals, dia: e.target.value })}
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="hr">Heart Rate</Label>
          <Input
            id="hr"
            value={vitals.hr}
            onChange={(e) => setVitals({ ...vitals, hr: e.target.value })}
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="temp">Temperature</Label>
          <Input
            id="temp"
            value={vitals.temp}
            onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="spo2">SpO2</Label>
          <Input
            id="spo2"
            value={vitals.spo2}
            onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
            type="number"
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={noteS}
            onChange={(e) => setNoteS(e.target.value)}
            placeholder="Enter notes here..."
          />
        </div>
      </div>
      <div className="flex justify-between">
        <Button onClick={handleSaveVitals}>Save Vitals</Button>
        <Button onClick={advanceToDoctor}>Advance to Doctor</Button>
      </div>
    </div>
  );
};

export default TriageForm;