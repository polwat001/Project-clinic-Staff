import React, { useEffect, useMemo, useState } from "react";
import PatientHeader from "./doctor/PatientHeader";
import Tabs from "./doctor/Tabs";
import { getPatientBundle, getPatients, createVisit, sendPrescription } from "@/lib/db";
import type { Appointment, Patient, RxItem, Visit } from "@/lib/types";
import { Card, CardContent, CardHeader, Input } from "./doctor/ui-lite";
import { toast } from "@/hooks/use-toast";

const displayName = (p: any) =>
  (p?.name && String(p.name).trim()) ||
  [p?.prefix, p?.first_name, p?.last_name].filter(Boolean).join(" ").trim() ||
  p?.hn ||
  "-";
const displaySex = (p: any) => {
  const s = (p?.sex ?? p?.gender ?? "").toString().trim().toLowerCase();
  if (s === "ชาย" || s === "m" || s === "male") return "ชาย";
  if (s === "หญิง" || s === "f" || s === "female") return "หญิง";
  const pre = (p?.prefix ?? "").toString().trim();
  if (pre === "นาย") return "ชาย";
  if (pre === "นาง" || pre === "นางสาว" || pre === "น.ส.") return "หญิง";
  return "-";
};

export default function DoctorConsole() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [hx, setHx] = useState("");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [rxItems, setRxItems] = useState<RxItem[]>([]);

  // เวชระเบียน
  const [cc, setCc] = useState("");
  const [diag, setDiag] = useState("");
  const [plan, setPlan] = useState("");
  const [advice, setAdvice] = useState("พักผ่อน ดื่มน้ำมากๆ");
  const [ros, setRos] = useState("");
  const [pe, setPe] = useState("");
  const [icd10, setIcd10] = useState("");
  const [dept, setDept] = useState("");
  const [bpSys, setBpSys] = useState<number | "">("");
  const [bpDia, setBpDia] = useState<number | "">("");
  const [pulse, setPulse] = useState<number | "">("");
  const [tempC, setTempC] = useState<number | "">("");
  const [rr, setRr] = useState<number | "">("");
  const [spo2, setSpo2] = useState<number | "">("");
  const [hCm, setHCm] = useState<number | "">("");
  const [wKg, setWKg] = useState<number | "">("");
  const bmi = useMemo(() => {
    const h = Number(hCm);
    const w = Number(wKg);
    if (!h || !w) return undefined;
    const m = h / 100;
    return Number((w / (m * m)).toFixed(2));
  }, [hCm, wKg]);

  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingBundle, setLoadingBundle] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingPatients(true);
        setErrorMsg(null);
        const rows = await getPatients();
        if (!alive) return;
        setPatients(rows);
      } catch (e: any) {
        console.error("getPatients error:", e);
        if (alive) setErrorMsg(e?.message || "โหลดรายชื่อผู้ป่วยไม่สำเร็จ");
      } finally {
        if (alive) setLoadingPatients(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setCc("");
    setDiag("");
    setPlan("");
    setAdvice("พักผ่อน ดื่มน้ำมากๆ");
    setRos("");
    setPe("");
    setIcd10("");
    setDept("");
    setBpSys("");
    setBpDia("");
    setPulse("");
    setTempC("");
    setRr("");
    setSpo2("");
    setHCm("");
    setWKg("");
    setRxItems([]);
  }, [selected?.id]);

  useEffect(() => {
    if (!selected) return;
    let alive = true;
    (async () => {
      try {
        setLoadingBundle(true);
        setErrorMsg(null);
        const res = await getPatientBundle(selected.id);
        if (!alive) return;
        setVisits(res.visits);
        setAppts(res.appts);
      } catch (e: any) {
        console.error("getPatientBundle error:", e);
        if (alive) setErrorMsg(e?.message || "โหลดข้อมูลผู้ป่วยไม่สำเร็จ");
      } finally {
        if (alive) setLoadingBundle(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [selected]);

  const addRx = (i: RxItem) =>
    setRxItems((prev) =>
      prev.find((x) => x.drug_code === i.drug_code) ? prev : [...prev, i]
    );
  const removeRx = (code: string) =>
    setRxItems((prev) => prev.filter((x) => x.drug_code !== code));

  const onSaveVisit = async (payload: {
    chief_complaint: string;
    diagnosis: string;
    plan: string;
    advice: string;
  }) => {
    if (!selected) return alert("เลือกผู้ป่วยก่อน");
    try {
      const v = await createVisit({
        patient_id: selected.id,
        chief_complaint: payload.chief_complaint || null,
        diagnosis: payload.diagnosis || null,
        plan: payload.plan || null,
        advice: payload.advice || null,
        ros: ros || null,
        pe: pe || null,
        icd10: icd10 || null,
        dept: dept || null,
        bp_sys: bpSys === "" ? null : Number(bpSys),
        bp_dia: bpDia === "" ? null : Number(bpDia),
        pulse: pulse === "" ? null : Number(pulse),
        temp_c: tempC === "" ? null : Number(tempC),
        rr: rr === "" ? null : Number(rr),
        spo2: spo2 === "" ? null : Number(spo2),
        height_cm: hCm === "" ? null : Number(hCm),
        weight_kg: wKg === "" ? null : Number(wKg),
        bmi: bmi ?? null,
      });
      setVisits((prev) => [v, ...prev]);
      setCc("");
      setDiag("");
      setPlan("");
      setAdvice("พักผ่อน ดื่มน้ำมากๆ");
      setRos("");
      setPe("");
      setIcd10("");
      setDept("");
      setBpSys("");
      setBpDia("");
      setPulse("");
      setTempC("");
      setRr("");
      setSpo2("");
      setHCm("");
      setWKg("");
      alert("บันทึกเวชระเบียนสำเร็จ");
    } catch (e: any) {
      console.error("createVisit error:", e);
      alert(e?.message || "บันทึกเวชระเบียนไม่สำเร็จ");
    }
  };

  const onSendRx = async (advice?: string | null, items?: RxItem[]) => {
    if (!selected) return alert("เลือกผู้ป่วยก่อน");
    const rxList = items ?? rxItems;
    if (rxList.length === 0) return;
    const citizenId = selected.id_card || "";
    // เพิ่ม doctor_advice ให้กับแต่ละ RxItem
    const cleanItems = rxList.map(({ total_units, ...rest }) => ({
      ...rest,
      citizen_id: citizenId,
      doctor_advice: advice ?? "", // แนบ doctor_advice ไปกับแต่ละรายการ
    }));

    try {
      await sendPrescription({
        patient_id: selected.id,
        advice: advice ?? "",
        items: cleanItems,
      });
      setRxItems([]);
      alert("ส่งใบสั่งยาให้พนักงานแล้ว");
    } catch (e: any) {
      console.error("sendPrescription error:", e);
      const msg =
        typeof e === "string"
          ? e
          : e?.message ||
            (typeof e === "object" && Object.keys(e).length
              ? JSON.stringify(e)
              : "ส่งใบสั่งยาไม่สำเร็จ");
      alert(msg);
    }
  };

  const q = query.trim().toLowerCase();
  const filtered = q
    ? patients.filter((p) => {
        const nm = displayName(p).toLowerCase();
        return (
          nm.includes(q) ||
          (p.hn || "").toLowerCase().includes(q) ||
          (p.phone || "").toLowerCase().includes(q)
        );
      })
    : patients;

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center">
      <div className="w-full max-w-[1800px] px-1 py-1">
        <header className="flex items-center justify-between mb-4 w-full">
          <div className="text-2xl font-semibold text-black">Doctor System</div>
          <div className="text-sm text-slate-500">
            {new Date().toLocaleString("th-TH")}
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-2 w-full">
          {/* Sidebar */}
          <div className="bg-[#f8fafc] rounded-2xl border p-1 flex flex-col min-h-[400px] max-h-[80vh]">
            <div className="font-semibold text-black mb-2">ค้นหาผู้ป่วย</div>
            <Input
              placeholder="พิมพ์ชื่อ, HN, เบอร์"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-white text-black border rounded-xl px-3 py-2 mb-2 text-base"
            />
            <div className="flex-1 overflow-y-auto space-y-2">
              {loadingPatients && (
                <div className="text-sm text-slate-500 text-black">
                  กำลังโหลดรายชื่อผู้ป่วย…
                </div>
              )}
              {!loadingPatients &&
                filtered.map((p) => (
                  <div
                    key={p.id}
                    className={`p-2 border rounded-lg cursor-pointer hover:bg-blue-50 ${
                      selected?.id === p.id ? "bg-blue-100" : "bg-white"
                    } text-black`}
                    onClick={() => setSelected(p)}
                    style={{ fontSize: "0.95rem" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-black truncate">{displayName(p)}</div>
                      <div className="text-xs text-blue-700">{p.hn ?? "-"}</div>
                    </div>
                    <div className="text-xs text-slate-600 text-black truncate">
                      เกิด{" "}
                      {p.dob
                        ? new Date(p.dob).toLocaleDateString("th-TH", {
                            dateStyle: "medium",
                          })
                        : "-"}{" "}
                      · {displaySex(p)} · {p.phone || "-"}
                    </div>
                    {p.allergy && (
                      <div className="mt-1 text-xs text-red-600 bg-red-100 rounded px-2 py-1 inline-block text-black">
                        แพ้ยา: {p.allergy}
                      </div>
                    )}
                    {p.pmh && (
                      <div className="mt-1 text-xs text-yellow-700 bg-yellow-100 rounded px-2 py-1 inline-block text-black">
                        โรคประจำตัว: {p.pmh}
                      </div>
                    )}
                  </div>
                ))}
              {!loadingPatients && filtered.length === 0 && (
                <div className="text-sm text-slate-500 text-black">ไม่พบผู้ป่วย</div>
              )}
            </div>
          </div>
          {/* Main */}
          <div className="bg-white rounded-2xl border p-2 min-h-[1600px] flex flex-col w-full">
            {!selected ? (
              <div className="flex items-center justify-center h-full text-slate-500 text-lg">
                เลือกผู้ป่วยทางซ้ายเพื่อเริ่มต้น
              </div>
            ) : (
              <>
                <PatientHeader patient={selected} className="bg-white border rounded-2xl mb-4" />
                <Tabs
                  patient={selected}
                  visits={visits}
                  appts={appts}
                  cc={cc}
                  setCc={setCc}
                  diag={diag}
                  setDiag={setDiag}
                  plan={plan}
                  setPlan={setPlan}
                  advice={advice}
                  setAdvice={setAdvice}
                  ros={ros}
                  setRos={setRos}
                  pe={pe}
                  setPe={setPe}
                  icd10={icd10}
                  setIcd10={setIcd10}
                  dept={dept}
                  setDept={setDept}
                  bpSys={bpSys}
                  setBpSys={setBpSys}
                  bpDia={bpDia}
                  setBpDia={setBpDia}
                  pulse={pulse}
                  setPulse={setPulse}
                  tempC={tempC}
                  setTempC={setTempC}
                  rr={rr}
                  setRr={setRr}
                  spo2={spo2}
                  setSpo2={setSpo2}
                  hCm={hCm}
                  setHCm={setHCm}
                  wKg={wKg}
                  setWKg={setWKg}
                  bmi={bmi}
                  rxItems={rxItems}
                  addRx={addRx}
                  removeRx={removeRx}
                  onSaveVisit={onSaveVisit}
                  onSendRx={onSendRx}
                  loading={loadingBundle}
                  hx={hx}
                  setHx={setHx}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}