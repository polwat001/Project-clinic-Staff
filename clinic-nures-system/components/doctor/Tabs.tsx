"use client";
import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Textarea,
  Button,
  Input,
} from "./ui-lite";
import type { Appointment, Patient, Visit } from "@/lib/types";

// Extend RxItem to include meal_timing
import type { RxItem } from "@/lib/types";
type RxItemWithMealTiming = RxItem & {
  meal_timing?: string | null;
};
import { fmtDate } from "@/lib/utils";
import { searchMedicationCatalog } from "@/lib/db";
import { AppointmentBooker } from "./AppointmentBooker";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import HistoryTab from "./tabs/HistoryTab";

// Minimal VisitBlock component for displaying a visit
const VisitBlock = ({ v }: { v: Visit }) => (
  <div className="border rounded-xl p-3 space-y-1">
    <div className="font-medium">{fmtDate((v as any).created_at ?? (v as any).visit_date)}</div>
    <div className="text-sm text-slate-700 whitespace-pre-wrap">
      {v.chief_complaint ? `CC: ${v.chief_complaint}\n` : ""}
      {v.diagnosis ? `Dx: ${v.diagnosis}\n` : ""}
      {v.plan ? `Plan: ${v.plan}\n` : ""}
      {v.advice ? `Advice: ${v.advice}\n` : ""}
    </div>
  </div>
);

/** vitals (read-only) */
export type VitalsRO = {
  taken_at: string;
  bp_sys: number | null;
  bp_dia: number | null;
  pulse: number | null;
  rr: number | null;
  temp_c: number | null;
  spo2: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  bmi: number | null;
  note: string | null;
};

type Props = {
  patient: Patient;
  visits: Visit[];
  appts: Appointment[];
  cc: string;
  setCc: (v: string) => void;
  diag: string;
  setDiag: (v: string) => void;
  plan: string;
  setPlan: (v: string) => void;
  advice: string;
  setAdvice: (v: string) => void;
  ros: string;
  setRos: (v: string) => void;
  pe: string;
  setPe: (v: string) => void;
  icd10: string;
  setIcd10: (v: string) => void;
  dept: string;
  setDept: (v: string) => void;

  bpSys: number | "";
  setBpSys: (v: number | "") => void;
  bpDia: number | "";
  setBpDia: (v: number | "") => void;
  pulse: number | "";
  setPulse: (v: number | "") => void;
  tempC: number | "";
  setTempC: (v: number | "") => void;
  rr: number | "";
  setRr: (v: number | "") => void;
  spo2: number | "";
  setSpo2: (v: number | "") => void;
  hCm: number | "";
  setHCm: React.Dispatch<React.SetStateAction<number | "">>;
  wKg: number | "";
  setWKg: React.Dispatch<React.SetStateAction<number | "">>;
  bmi?: number;
  rxItems: RxItemWithMealTiming[];
  addRx: (i: RxItemWithMealTiming) => void;
  removeRx: (code: string) => void;
  vitals?: VitalsRO;
  onSaveVisit: (payload: {
    chief_complaint: string;
    diagnosis: string;
    plan: string;
    advice: string;
    ros?: string;
    pe?: string;
    icd10?: string | null;
    dept?: string | null;
    bp_sys?: number | null;
    bp_dia?: number | null;
    pulse?: number | null;
    temp_c?: number | null;
    rr?: number | null;
    spo2?: number | null;
    height_cm?: number | null;
    weight_kg?: number | null;
    bmi?: number | null;
  }) => void;
  onSendRx: (advice?: string | null, items?: RxItemWithMealTiming[]) => void;
  loading: boolean;
  hx: string;
  setHx: (v: string) => void;
};

type CatalogItem = {
  drug_code: string;
  name: string;
  strength: string | null;
  frequency: string | null;
  period: string | null;
  note?: string | null;
};

// ========= helpers =========
const fmt = {
  vitalsLine: (v?: VitalsRO) => {
    if (!v) return "-";
    const parts = [
      v.bp_sys != null && v.bp_dia != null
        ? `BP ${v.bp_sys}/${v.bp_dia}`
        : null,
      v.pulse != null ? `PR ${v.pulse}` : null,
      v.temp_c != null ? `T ${v.temp_c}°C` : null,
      v.rr != null ? `RR ${v.rr}` : null,
      v.spo2 != null ? `SpO₂ ${v.spo2}%` : null,
      v.height_cm != null && v.weight_kg != null
        ? `Ht ${v.height_cm} cm · Wt ${v.weight_kg} kg${
            v.bmi != null ? ` · BMI ${v.bmi}` : ""
          }`
        : null,
    ].filter(Boolean as any);
    return parts.length ? parts.join(" · ") : "-";
  },
};

// ========== คอมโพเนนต์หลัก ==========
export default function Tabs(p: Props) {
  const [tab, setTab] = React.useState<
    "latest" | "exam" | "rx" | "appts" | "history"
  >("latest");

  // RX state
  const [search, setSearch] = React.useState("");
  const [catalog, setCatalog] = React.useState<CatalogItem[]>([]);
  const [loadingCat, setLoadingCat] = React.useState(false);
  const [errorCat, setErrorCat] = React.useState<string | null>(null);
  const [rxAdvice, setRxAdvice] = React.useState(p.advice ?? "");
  const [newDrug, setNewDrug] = React.useState("");

  React.useEffect(() => {
    let alive = true;
    if (!search.trim()) {
      setCatalog([]);
      return;
    }
    const t = setTimeout(() => {
      (async () => {
        setLoadingCat(true);
        setErrorCat(null);
        try {
          const rows = await searchMedicationCatalog(search, 50);
          if (!alive) return;
          setCatalog(
            rows.map((r) => ({
              drug_code: r.drug_code,
              name: r.name,
              strength: r.strength ?? null,
              frequency: r.frequency ?? null,
              period: r.period ?? null,
              note: r.note ?? null,
            }))
          );
        } catch {
          if (alive) setErrorCat("โหลดรายการยาไม่สำเร็จ");
        } finally {
          if (alive) setLoadingCat(false);
        }
      })();
    }, 250);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [search]);

  const alreadyHas = React.useCallback(
    (code: string) => p.rxItems.some((i) => i.drug_code === code),
    [p.rxItems]
  );

  const handleAdd = React.useCallback(
    (m: CatalogItem) => {
      if (alreadyHas(m.drug_code)) {
        alert("มีรายการยานี้อยู่แล้ว");
        return;
      }
      p.addRx({
        drug_code: m.drug_code,
        name: m.name,
        strength: m.strength ?? undefined,
        frequency: m.frequency ?? undefined,
        period: m.period ?? undefined,
        note: m.note ?? undefined,
      });
    },
    [alreadyHas, p]
  );

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && catalog.length === 1) {
      e.preventDefault();
      handleAdd(catalog[0]);
    }
  };

  const PlaneIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-2 h-2 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );

  // vitals state
  const [vitals, setVitals] = useState<VitalsRO | undefined>(undefined);
  const [latestVisitVitals, setLatestVisitVitals] = useState<VitalsRO | undefined>(undefined);
  const [latestVitals, setLatestVitals] = useState<VitalsRO | null>(null);

  useEffect(() => {
    async function fetchLatestVitals() {
      if (!p.patient?.hn) {
        setLatestVitals(null);
        return;
      }
      const { data, error } = await supabase
        .from("vitals")
        .select(
          "created_at, sys, dia, hr, rr, temp_c, spo2, weight_kg, height_cm, bmi, noteS, chief_complaint, drinking, smoking, full_name"
        )
        .eq("hn", p.patient.hn)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (!error && data) {
        setLatestVitals({
          taken_at: data.created_at,
          sys: data.sys,
          dia: data.dia,
          hr: data.hr,
          rr: data.rr,
          temp_c: data.temp_c,
          spo2: data.spo2,
          weight_kg: data.weight_kg,
          height_cm: data.height_cm,
          bmi: data.bmi,
          noteS: data.noteS,
          chief_complaint: data.chief_complaint,
          drinking: data.drinking,
          smoking: data.smoking,
          full_name: data.full_name,
        });
      } else {
        setLatestVitals(null);
      }
    }
    fetchLatestVitals();
  }, [p.patient?.hn]);

  useEffect(() => {
    async function fetchLatestVisitVitals() {
      if (!p.patient?.id) {
        setLatestVisitVitals(undefined);
        return;
      }
      const { data, error } = await supabase
        .from("visits")
        .select(
          "visit_at, bp_sys, bp_dia, pulse, rr, temp_c, spo2, height_cm, weight_kg, bmi, chief_complaint"
        )
        .eq("patient_id", p.patient.id)
        .order("visit_at", { ascending: false })
        .limit(1)
        .single();
      if (!error && data) {
        setLatestVisitVitals({
          taken_at: data.visit_at,
          bp_sys: data.bp_sys,
          bp_dia: data.bp_dia,
          pulse: data.pulse,
          rr: data.rr,
          temp_c: data.temp_c,
          spo2: data.spo2,
          height_cm: data.height_cm,
          weight_kg: data.weight_kg,
          bmi: data.bmi,
          note: data.chief_complaint,
        });
      } else {
        setLatestVisitVitals(undefined);
      }
    }
    fetchLatestVisitVitals();
  }, [p.patient?.id]);

  // ใช้ p.vitals ก่อน ถ้าไม่มี fallback เป็น latestVitals
  const vitalsToShow = p.vitals ?? latestVitals;

  return (
    <div className="space-y-2 text-[15px] leading-[1.6] text-black gap-0 p-0">
      {/* Tabs header */}
      <div className="flex gap-1">
        {[
          { k: "latest", t: "เวชระเบียนล่าสุด" },
          { k: "exam", t: "ตรวจ/วินิจฉัย/แผน" },
          { k: "rx", t: "ใบสั่งยา" },
          { k: "appts", t: "นัดหมาย" },
          { k: "history", t: "ประวัติทั้งหมด" },
        ].map((x) => (
          <button
            key={x.k}
            className={`px-3 py-1 rounded-xl border ${
              tab === x.k
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-slate-50"
            }`}
            onClick={() => setTab(x.k as any)}
          >
            {x.t}
          </button>
        ))}
      </div>

      {/* ล่าสุด */}
      {tab === "latest" && (
        <Card>
          <CardHeader className="text-black ">เยี่ยมล่าสุด</CardHeader>
          <CardContent className="text-black">
            {p.loading && <div className="text-slate-500 text-black">กำลังโหลด…</div>}
            {!p.loading &&
              (p.visits.length === 0 ? (
                <div className="text-slate-500 text-black">ยังไม่มีเวชระเบียน</div>
              ) : (
                <VisitBlock v={p.visits[0]} />
              ))}
          </CardContent>
        </Card>
      )}

      {/* ตรวจ/วินิจฉัย/แผน */}
      {tab === "exam" && (
        <div className="grid md:grid-cols-2 gap-2 text-black">
          {/* vitals */}<Card className="md:col-span-2">
  <CardHeader className="text-black">สัญญาณชีพ (จาก Vitals ล่าสุด)</CardHeader>
  <CardContent className="text-black">
    {!latestVitals ? (
      <div className="text-slate-500">ยังไม่มีการบันทึก Vitals</div>
    ) : (
      <div className="grid md:grid-cols-3 gap-2">
        <div>
          BP: {latestVitals.sys ?? "-"} / {latestVitals.dia ?? "-"} mmHg
        </div>
        <div>PR: {latestVitals.hr ?? "-"} bpm</div>
        <div>Temp: {latestVitals.temp_c ?? "-"} °C</div>
        <div>RR: {latestVitals.rr ?? "-"} /min</div>
        <div>SpO₂: {latestVitals.spo2 ?? "-"} %</div>
        <div>
          ส่วนสูง/น้ำหนัก: {latestVitals.height_cm ?? "-"} ซม. ·{" "}
          {latestVitals.weight_kg ?? "-"} กก.
          {latestVitals.bmi != null ? <> · BMI {latestVitals.bmi}</> : null}
        </div>
        <div className="col-span-full text-xs text-slate-500">
          บันทึกเมื่อ {latestVitals.taken_at}
          {latestVitals.chief_complaint ? ` · ${latestVitals.chief_complaint}` : ""}
        </div>
        <div className="col-span-full text-xs text-slate-500">
          หมายเหตุ: {latestVitals.noteS || "-"}
        </div>
        <div className="col-span-full text-xs text-slate-500">
          ดื่มสุรา: {latestVitals.drinking || "-"} | สูบบุหรี่: {latestVitals.smoking || "-"}
        </div>
      </div>
    )}
  </CardContent>
</Card>
          {/* ปรับขนาด Card ให้เล็กลง */}
          <Card>
            <CardHeader>อาการนำ (CC)</CardHeader>
            <CardContent>
              <Textarea
                rows={2}
                value={p.cc}
                onChange={(e) => p.setCc(e.target.value)}
                placeholder="เช่น ไอ เจ็บคอ 3 วัน มีไข้"
                className="text-black text-sm"
              />
              <div className="text-[11px] text-slate-500 mt-1 text-right">
                {(p.cc ?? "").length} ตัวอักษร
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>การวินิจฉัย</CardHeader>
            <CardContent>
              <Textarea
                rows={2}
                value={p.diag}
                onChange={(e) => p.setDiag(e.target.value)}
                placeholder="เช่น ความดันโลหิตสูง..."
                className="text-black text-sm"
              />
              <div className="text-[11px] text-slate-500 mt-1 text-right">
                {(p.diag ?? "").length} ตัวอักษร
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>แผนการรักษา</CardHeader>
            <CardContent>
              <Textarea
                rows={2}
                value={p.plan}
                onChange={(e) => p.setPlan(e.target.value)}
                placeholder="คำสั่งตรวจ/ให้ยา/ติดตาม …"
                className="text-black text-sm"
              />
              <div className="text-[11px] text-slate-500 mt-1 text-right">
                {(p.plan ?? "").length} ตัวอักษร
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>คำแนะนำ</CardHeader>
            <CardContent>
              <Textarea
                rows={2}
                value={p.advice}
                onChange={(e) => p.setAdvice(e.target.value)}
                placeholder="พักผ่อน ดื่มน้ำมากๆ …"
                className="text-black text-sm"
              />
              <div className="text-[11px] text-slate-500 mt-1 text-right">
                {(p.advice ?? "").length} ตัวอักษร
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>ROS</CardHeader>
            <CardContent>
              <Textarea
                rows={2}
                value={p.ros}
                onChange={(e) => p.setRos(e.target.value)}
                placeholder="ระบบต่างๆ …"
                className="text-black text-sm"
              />
              <div className="text-[11px] text-slate-500 mt-1 text-right">
                {(p.ros ?? "").length} ตัวอักษร
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>ตรวจร่างกาย (PE)</CardHeader>
            <CardContent>
              <Textarea
                rows={2}
                value={p.pe}
                onChange={(e) => p.setPe(e.target.value)}
                placeholder="GA/HEENT/Chest/Cardiac/Abd/Ext/Neuro …"
                className="text-black text-sm"
              />
              <div className="text-[11px] text-slate-500 mt-1 text-right">
                {(p.pe ?? "").length} ตัวอักษร
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 p-2">
            <CardHeader>ประวัติการเจ็บป่วย/ยา/แพ้ (HX)</CardHeader>
            <CardContent>
              <Textarea
                rows={2}
                value={p.hx}
                onChange={(e) => p.setHx(e.target.value)}
                placeholder="ประวัติปัจจุบัน/อดีต/ยาที่ใช้/แพ้ยา ฯลฯ"
                className="text-black text-sm"
              />
              <div className="text-[11px] text-slate-500 mt-1 text-right">
                {(p.hx ?? "").length} ตัวอักษร
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 p-2">
            <CardHeader>สรุปฉบับผู้ป่วย</CardHeader>
            <CardContent>
              <div className="text-slate-700 whitespace-pre-wrap">
                อาการนำ: {p.cc || "-"}
                {"\n"}
                การวินิจฉัย: {p.diag || "-"} {p.icd10 ? `(${p.icd10})` : ""}
                {"\n"}
                สัญญาณชีพ: {fmt.vitalsLine(p.vitals)}
                {"\n"}
                ROS: {p.ros || "-"}
                {"\n"}
                PE: {p.pe || "-"}
                {"\n"}
                แผนการรักษา: {p.plan || "-"}
                {"\n"}
                คำแนะนำ: {p.advice || "-"}
              </div>
              <div className="mt-3">
                <Button
                  onClick={() => {
                    // แนบ Vitals ล่าสุด (latestVitals) หากมี
                    const vitals = latestVitals;
                    p.onSaveVisit({
                      chief_complaint: p.cc,
                      diagnosis: p.diag,
                      plan: p.plan,
                      advice: p.advice,
                      ros: p.ros,
                      pe: p.pe,
                      icd10: p.icd10 ?? null,
                      dept: p.dept ?? null,
                      ...(vitals
                        ? {
                            bp_sys: vitals.sys ?? null,
                            bp_dia: vitals.dia ?? null,
                            pulse: vitals.hr ?? null,
                            temp_c: vitals.temp_c ?? null,
                            rr: vitals.rr ?? null,
                            spo2: vitals.spo2 ?? null,
                            height_cm: vitals.height_cm ?? null,
                            weight_kg: vitals.weight_kg ?? null,
                            bmi: vitals.bmi ?? null,
                          }
                        : {}),
                    });
                  }}
                >
                  บันทึกเวชระเบียน
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ใบสั่งยา */}
      {tab === "rx" && (
        <div className="grid md:grid-cols-2 gap-1 text-black">
          {/* ซ้าย: ค้นหา/เพิ่มยา */}
          <Card>
            <CardHeader>รายการยา</CardHeader>
            <CardContent>
              <Input
                placeholder="ค้นหา (ชื่อยา/รหัส)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={onSearchKeyDown}
                aria-label="ค้นหารายการยา"
              />
              <div className="mt-2 space-y-2 max-h-[40vh] overflow-auto">
                {loadingCat && (
                  <div className="text-slate-500">กำลังโหลด...</div>
                )}
                {errorCat && <div className="text-red-600">{errorCat}</div>}
                {!loadingCat && !errorCat && search && catalog.length === 0 && (
                  <div className="text-slate-500">ไม่พบรายการยาตามคำค้น</div>
                )}
                {catalog.map((m) => (
                  <div
                    key={m.drug_code}
                    className="p-1 border rounded-xl bg-white flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate" title={m.name}>
                        {m.name}
                        {m.strength ? ` ${m.strength}` : ""}
                      </div>
                      <div className="text-xs text-slate-500">
                        {[m.frequency, m.note].filter(Boolean).join(" ")}
                        {m.period ? ` · ${m.period}` : ""}
                      </div>
                    </div>
                    <button
                      className="px-2 py-1 rounded-xl border hover:bg-slate-50 disabled:opacity-50"
                      onClick={() => handleAdd(m)}
                      disabled={alreadyHas(m.drug_code)}
                    >
                      {alreadyHas(m.drug_code) ? "เพิ่มแล้ว" : "เพิ่ม"}
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ขวา: รายการยาในใบนี้ + คำแนะนำ */}
          <Card>
            <CardHeader>ใบสั่งยานี้</CardHeader>
            <CardContent className="space-y-2">
              {p.rxItems.length === 0 && (
                <div className="text-slate-500">ยังไม่มีรายการยา</div>
              )}
              {p.rxItems.map((i) => (
                <div
                  key={i.drug_code}
                  className="p-1 border rounded-xl bg-white space-y-2 "
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-medium truncate" title={i.name}>
                        {i.name}
                        {i.strength ? ` ${i.strength}` : ""}
                      </div>
                      <div className="text-xs text-slate-500">
                        {[
                          i.frequency,
                          (i as any).meal_timing, // 👈 เวลากับอาหาร
                          i.note,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        {i.period ? ` · ${i.period}` : ""}
                        {!("frequency" in i) && (i as any).sig
                          ? ` ${(i as any).sig}${
                              (i as any).days ? ` · ${(i as any).days} วัน` : ""
                            }`
                          : ""}
                      </div>
                    </div>
                    <button
                      onClick={() => p.removeRx(i.drug_code)}
                      className="px-3 py-1 rounded-xl border hover:bg-slate-50"
                    >
                      ลบ
                    </button>
                  </div>

                  {/* 🔢 ช่องกรอกจำนวนยา */}
                  <div className="grid p-0 grid-cols-2 gap-2 mb-1">
                    <div>
                      <label className="block text-xs text-slate-600 mb-0">
                        จำนวนต่อครั้ง
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={i.qty_per_dose ?? 1}
                        onChange={(e) => {
                          const v = Math.max(1, Number(e.target.value || 1));
                          if ((p as any).updateRx)
                            (p as any).updateRx(i.drug_code, {
                              qty_per_dose: v,
                            });
                          else {
                            p.removeRx(i.drug_code);
                            p.addRx({ ...i, qty_per_dose: v });
                          }
                        }}
                        placeholder="เช่น 1 (เม็ด/ช้อน)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-0">
                        ครั้งต่อวัน
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={i.doses_per_day ?? 1}
                        onChange={(e) => {
                          const v = Math.max(1, Number(e.target.value || 1));
                          if ((p as any).updateRx)
                            (p as any).updateRx(i.drug_code, {
                              doses_per_day: v,
                            });
                          else {
                            p.removeRx(i.drug_code);
                            p.addRx({ ...i, doses_per_day: v });
                          }
                        }}
                        placeholder="เช่น 3"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-0">
                        จำนวนวัน
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={
                          i.period_days ??
                          (() => {
                            const m = i.period?.match?.(/(\d+)/);
                            return m ? Math.max(1, parseInt(m[1], 10)) : 1;
                          })()
                        }
                        onChange={(e) => {
                          const v = Math.max(1, Number(e.target.value || 1));
                          if ((p as any).updateRx)
                            (p as any).updateRx(i.drug_code, {
                              period_days: v,
                            });
                          else {
                            p.removeRx(i.drug_code);
                            p.addRx({ ...i, period_days: v });
                          }
                        }}
                        placeholder="เช่น 7"
                      />
                    </div>
                  </div>

                  {/* 🍽️ เวลากับอาหาร */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                    <div className="md:col-span-1">
                      <label className="block text-xs text-slate-600 mb-0">
                        เวลากับอาหาร
                      </label>
                      <select
                        className="w-full border rounded-xl px-3 py-2 text-sm bg-white"
                        value={(i as any).meal_timing ?? ""}
                        onChange={(e) => {
                          const v = e.target.value || null; // "", "ก่อนอาหาร", "หลังอาหาร", "พร้อมอาหาร"
                          if ((p as any).updateRx)
                            (p as any).updateRx(i.drug_code, {
                              meal_timing: v,
                            });
                          else {
                            p.removeRx(i.drug_code);
                            p.addRx({ ...i, meal_timing: v as any });
                          }
                        }}
                      >
                        <option value="">—</option>
                        <option value="ก่อนอาหาร">ก่อนอาหาร</option>
                        <option value="หลังอาหาร">หลังอาหาร</option>
                        <option value="พร้อมอาหาร">พร้อมอาหาร</option>
                      </select>
                    </div>
                  </div>

                  {/* รวมหน่วยที่ต้องจ่าย */}
                  <div className="text-xs text-slate-600">
                    {(() => {
                      const q = Number(i.qty_per_dose ?? 1) || 1;
                      const d = Number(i.doses_per_day ?? 1) || 1;
                      const days =
                        Number(i.period_days ?? 0) > 0
                          ? Number(i.period_days)
                          : (() => {
                              const m = i.period?.match?.(/(\d+)/);
                              return m ? Math.max(1, parseInt(m[1], 10)) : 1;
                            })();
                      return (
                        <>
                          รวมที่ต้องจ่ายโดยประมาณ:{" "}
                          <span className="font-medium">{q * d * days}</span>{" "}
                          หน่วย
                        </>
                      );
                    })()}
                  </div>
                </div>
              ))}

              {/* เพิ่มชื่อยาเองแบบเร็ว */}
              <div className="pt-1">
                <div className="text-sm font-medium mb-1">เพิ่มยา</div>
                <Input
                  value={newDrug}
                  onChange={(e) => setNewDrug(e.target.value)}
                  placeholder="พิมพ์ชื่อยา เช่น Paracetamol 500 mg"
                />
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      const name = newDrug.trim();
                      if (!name) return;
                      p.addRx({
                        drug_code: `MANUAL-${name}`.slice(0, 30),
                        name,
                        strength: undefined,
                        frequency: undefined,
                        period: undefined,
                        note: undefined,
                        qty_per_dose: 1,
                        doses_per_day: 1,
                        period_days: 1,
                        meal_timing: null as any, // 👈 ค่าเริ่มต้นเวลากับอาหาร
                      });
                      setNewDrug("");
                    }}
                    disabled={!newDrug.trim()}
                  >
                    เพิ่มยา
                  </Button>
                </div>
              </div>

              {/* คำแนะนำแพทย์ */}
              <div className="pt-1">
                <div className="text-sm font-medium mb-1">
                  คำแนะนำแพทย์ (แนบไปกับใบสั่งยา)
                </div>
                <Textarea
                  rows={3}
                  value={rxAdvice}
                  onChange={(e) => setRxAdvice(e.target.value)}
                  placeholder="ตัวอย่าง: ดื่มน้ำมากๆ พักผ่อน หลีกเลี่ยงของทอดเผ็ด หากมีไข้สูง/หอบ ให้กลับมาพบแพทย์ทันที"
                />
              </div>
              {/* ปุ่มส่งใบสั่งยา */}
              <div className="pt-2 flex flex-wrap gap-2">
                <Button
                  disabled={p.rxItems.length === 0}
                  onClick={async () => {
                    const citizenId = p.patient.id_card;
                    if (!citizenId) {
                      alert("ไม่พบหมายเลขบัตรประชาชนของผู้ป่วย");
                      return;
                    }
                    const cleanItems = p.rxItems.map((item) => {
                      const { total_units, ...rest } = item;
                      return {
                        ...rest,
                        citizen_id: citizenId,
                        doctor_advice: rxAdvice?.trim() || null, // แนบ doctor_advice ไปกับแต่ละ RxItem
                      };
                    });

                    // เพิ่มการบันทึกคำแนะนำแพทย์ลงใน doctor_advice (table)
                    try {
                      if (rxAdvice && rxAdvice.trim()) {
                        await supabase
                          .from("doctor_advice")
                          .insert([
                            {
                              patient_id: p.patient.id,
                              citizen_id: citizenId,
                              doctor_advice: rxAdvice.trim(),
                              created_at: new Date().toISOString(),
                            },
                          ]);
                      }
                    } catch (e) {
                      // ไม่ต้อง throw error เพื่อไม่ให้ขัดขวางการส่งใบสั่งยา
                    }

                    // ส่งใบสั่งยา (แนบ citizen_id และ doctor_advice ในแต่ละ RxItem)
                    p.onSendRx(rxAdvice, cleanItems);
                  }}
                >
                  <span className="flex items-center">
                    <PlaneIcon /> ส่งใบสั่งยาให้พนักงาน
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

     {/* นัดหมาย */}
{tab === "appts" && (
  <Card>
    <CardHeader className="text-black">นัดหมาย</CardHeader>
    <CardContent className="space-y-4 text-black">
      {/* แถวบน: ปฏิทิน Google + ฟอร์มจอง */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* ซ้าย: Google Calendar (ฝัง) */}
        <div className="space-y-2">
          <div className="text-sm text-slate-600">ตารางว่างแพทย์ (Google Calendar)</div>
          <div className="aspect-video w-full border rounded-xl overflow-hidden">
            <iframe
              title="Doctor Calendar"
              className="w-full h-full"
              src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                "yourcalendarid@group.calendar.google.com"
              )}&ctz=Asia%2FBangkok&mode=WEEK&showTitle=0&showPrint=0&showTabs=0`}
              frameBorder="0"
            />
          </div>
          <div className="text-xs text-slate-500">
            *หากไม่เห็นตาราง: ตรวจสิทธิ์แชร์ปฏิทิน หรือปรับให้เข้าถึงได้ (read-only)
          </div>
        </div>

        {/* ขวา: ฟอร์มเลือกวัน/เวลา/เหตุผล แล้วกดนัดหมาย */}
        <AppointmentBooker
          patient={p.patient}
          onBooked={(appt) => {
            const newAppt: Appointment = {
              ...appt,
              id: (appt as any).id ?? "", // Ensure 'id' is present
              patient_id: String(appt.patient_id),
              note: (appt as any).note ?? "",
            };

            // อัปเดต state อย่างปลอดภัย
            if ((p as any).setAppts) {
              (p as any).setAppts((prev: Appointment[]) => [...prev, newAppt]);
            }
          }}
        />
      </div>

      {/* ด้านล่าง: รายการนัดหมายเดิม */}
      <div className="space-y-2">
        <div className="text-sm font-medium">นัดหมายที่มีอยู่</div>
        {p.appts.length === 0 && (
          <div className="text-slate-500">ยังไม่มีนัดหมาย</div>
        )}
        {p.appts.map((a) => (
          <div
            key={a.id}
            className="border rounded-xl p-3 flex items-center justify-between"
          >
            <div>{a.reason || "ติดตามอาการ"}</div>
            <div className="text-xs text-slate-500">{fmtDate(a.start_at)}</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}

{tab === "history" && (
  <Card>
    <CardHeader>เวชระเบียนทั้งหมด</CardHeader>
    <CardContent className="space-y-3">
      <HistoryTab patientId={p.patient.id} visits={p.visits} appts={p.appts} />
    </CardContent>
  </Card>
)}

    </div>
  );      
}