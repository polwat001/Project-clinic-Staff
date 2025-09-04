"use client";
import * as React from "react";
import { Badge, Button } from "./ui-lite"; // ถ้าไม่มี Button ใน ui-lite ลบออกได้
import type { Patient } from "@/lib/types";
import { fmtDateOnly } from "@/lib/utils";

type Props = {
  patient: Patient;
  // action ด้านขวา (ไม่บังคับ)
  rightNode?: React.ReactNode;
  // ปุ่มลัด เช่น ขอวัดสัญญาณชีพ (ไม่บังคับ)
  onAskVitals?: () => void;
};

function safeFmtDateOnly(d?: string | null) {
  try {
    return d ? fmtDateOnly(d) : "—";
  } catch {
    return "—";
  }
}

function calcAge(dob?: string | null) {
  if (!dob) return null;
  const dt = new Date(dob);
  if (Number.isNaN(dt.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dt.getFullYear();
  const m = now.getMonth() - dt.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dt.getDate())) age--;
  return age >= 0 ? age : null;
}

/** รวมชื่อแบบ fallback รองรับทั้งสคีมาเก่า (name) และใหม่ (prefix/first_name/last_name) */
function getDisplayName(p: any): string {
  if (p?.name) return p.name as string;
  const pre = p?.prefix ?? "";
  const first = p?.first_name ?? "";
  const last = p?.last_name ?? "";
  const full = `${pre}${first} ${last}`.trim();
  return full || "ไม่ทราบชื่อ";
}

/** เพศแบบ fallback (รับได้ทั้ง sex และ gender ภาษาอังกฤษ) */
function getDisplaySex(p: any): string {
  if (p?.sex) return p.sex as string;
  const g = (p?.gender ?? "").toString().toLowerCase();
  if (!g) return "—";
  if (["male", "m", "ชาย"].includes(g)) return "ชาย";
  if (["female", "f", "หญิง"].includes(g)) return "หญิง";
  return p.gender; // เผื่อกรอกเป็นข้อความอื่น
}

/** แผนกแพ้ยา/โรคประจำตัว รองรับทั้ง allergy/allergies และ chronic/pmh */
function getAllergy(p: any): string | null {
  return (p?.allergy ?? p?.allergies ?? null) || null;
}
function getChronic(p: any): string | null {
  return (p?.chronic ?? p?.pmh ?? null) || null;
}

export default function PatientHeader({ patient, rightNode, onAskVitals }: Props) {
  const age = calcAge(patient.dob);
  const displayName = getDisplayName(patient);
  const displaySex = getDisplaySex(patient);
  const allergy = getAllergy(patient);
  const chronic = getChronic(patient);

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        {/* ชื่อ + HN */}
        <div className="min-w-0">
          <div className="text-xl font-semibold truncate">
            🩺 {displayName}
            {patient.hn && (
              <span className="text-slate-400 text-base"> ({patient.hn})</span>
            )}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            เกิด {safeFmtDateOnly(patient.dob)}
            {typeof age === "number" && <> · {age} ปี</>}
            {displaySex && <> · {displaySex}</>}
            {patient.phone && <> · {patient.phone}</>}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {allergy && <Badge tone="red">แพ้ยา: {allergy}</Badge>}
            {chronic && <Badge tone="amber">โรคประจำตัว: {chronic}</Badge>}
          </div>
        </div>

        {/* ปุ่มลัดและ action ด้านขวา */}
        <div className="flex items-center gap-2">
          {onAskVitals && (
            <button
              type="button"
              onClick={onAskVitals}
              className="px-3 py-2 rounded-xl border text-sm bg-blue-600 text-white hover:bg-blue-700"
            >
              ขอวัดสัญญาณชีพ
            </button>
          )}
          {rightNode}
        </div>
      </div>
    </div>
  );
}
