"use client";
import React, { useState } from "react";
import PatientRegisterForm from "./PatientRegisterForm";
import TriageForm from "./TriageForm";

export default function RegisterAndTriage() {
  const [step, setStep] = useState<"register" | "triage">("register");
  const [patient, setPatient] = useState({
    hn: "",
    name: "",
    phone: "",
    dob: "",
    apptId: "",
    chief: "",
    allergies: "",
    pmh: "",
    meds: "",
    urgency: "",
    // ...field อื่นๆ...
  });

  const [vitals, setVitals] = useState({
    sys: "",
    dia: "",
    hr: "",
    rr: "",
    temp: "",
    spo2: "",
    wt: "",
    ht: "",
  });
  const [bmiDerived, setBmiDerived] = useState("");
  const [flags, setFlags] = useState<string[]>([]);
  const [noteS, setNoteS] = useState("");
  const [noteO, setNoteO] = useState("");
  const [noteA, setNoteA] = useState("");
  const [noteP, setNoteP] = useState("");
  const clientTime = new Date().toLocaleString();

  // ฟังก์ชันส่งต่อหลังบันทึก
  const handleRegisterSuccess = () => {
    console.log("step to triage");
    setStep("triage");
  };

  return (
    <div>
      {step === "register" ? (
        <PatientRegisterForm
          patient={patient}
          setPatient={setPatient}
          isWalkIn={true}
          // ส่ง callback ไปให้ PatientRegisterForm
          onSuccess={handleRegisterSuccess}
        />
      ) : (
        <TriageForm
          patient={patient}
          setPatient={setPatient}
          vitals={vitals}
          setVitals={setVitals}
          bmiDerived={bmiDerived}
          flags={flags}
          noteS={noteS}
          setNoteS={setNoteS}
          noteO={noteO}
          setNoteO={setNoteO}
          noteA={noteA}
          setNoteA={setNoteA}
          noteP={noteP}
          setNoteP={setNoteP}
          handleSaveVitals={() => {}}
          selected={null}
          clientTime={clientTime}
          handleQuickWalkIn={() => {}}
          advanceToDoctor={() => {}}
        />
      )}
    </div>
  );
}