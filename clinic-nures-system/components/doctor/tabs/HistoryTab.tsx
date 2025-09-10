'use client'
import React, { useMemo, useState } from 'react'
import type { Visit, Appointment } from '@/lib/types'
import { fmtDate } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { supabase } from "@/lib/supabase"; // ปรับ path ตามโปรเจกต์ของคุณ

type Props = {
  patientId: string
  visits: Visit[]
  appts?: Appointment[]
  refreshVisits?: () => Promise<void>
}

export default function HistoryTab(p: Props) {
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [sortDesc, setSortDesc] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDiag, setEditDiag] = useState("");
  const [editPlan, setEditPlan] = useState("");
  const [editAdvice, setEditAdvice] = useState("");
  const [visits, setVisits] = useState<Visit[]>(p.visits);
  const [appts, setAppts] = useState<Appointment[]>(p.appts ?? []);

  const filteredVisits = visits
    .filter(v => {
      const d = new Date(v.visit_at ?? 0);
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo && d > new Date(dateTo)) return false;
      return true;
    })
    .sort((a, b) => {
      const ta = new Date(a.visit_at ?? 0).getTime();
      const tb = new Date(b.visit_at ?? 0).getTime();
      return sortDesc ? tb - ta : ta - tb;
    });

  const sortedVisits = filteredVisits;
  const sortedAppts = useMemo(() => {
    return [...appts].sort((a, b) => {
      const ta = new Date(a.start_at ?? 0).getTime();
      const tb = new Date(b.start_at ?? 0).getTime();
      return sortDesc ? tb - ta : ta - tb;
    });
  }, [appts, sortDesc]);

  // ฟังก์ชันบันทึกข้อมูล (mock)
  const handleSave = async (id: string) => {
    // อัปเดตข้อมูลใน Supabase
    const { error } = await supabase
      .from("visits")
      .update({
        diagnosis: editDiag,
        plan: editPlan,
        advice: editAdvice,
      })
      .eq("id", id);

    if (!error) {
      setVisits(prev =>
        prev.map(v =>
          v.id === id
            ? { ...v, diagnosis: editDiag, plan: editPlan, advice: editAdvice }
            : v
        )
      );
      setEditingId(null);
    } else {
      // แจ้งเตือนหรือจัดการ error ตามต้องการ
      console.error("อัปเดต visit ไม่สำเร็จ", error);
    }
  };

  // ฟังก์ชันลบ visit
  const handleDelete = async (id: string) => {
    // ลบจาก Supabase
    const { error } = await supabase
      .from("visits")
      .delete()
      .eq("id", id);

    if (!error) {
      setVisits(prev => prev.filter(v => v.id !== id));
      setEditingId(null);
    } else {
      // แจ้งเตือนหรือจัดการ error ตามต้องการ
      console.error("ลบ visit ไม่สำเร็จ", error);
    }
  };

  // ฟังก์ชันลบ appointment
  const handleDeleteAppt = async (id: string) => {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);

    if (!error) {
      setAppts(prev => prev.filter(a => a.id !== id));
    } else {
      console.error("ลบ appointment ไม่สำเร็จ", error);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between">
            <span className="font-bold text-lg">เวชระเบียนและการนัดหมาย</span>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="text-xs">ตั้งแต่วันที่</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
              <label className="text-xs">ถึงวันที่</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
              <button
                className="ml-2 px-2 py-1 border rounded text-xs bg-gray-50 hover:bg-gray-100 text-gray-700"
                onClick={() => setSortDesc(s => !s)}
              >
                {sortDesc ? "ล่าสุด → เก่าสุด" : "เก่าสุด → ล่าสุด"}
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ประวัติการรักษา */}
          <section>
            <div className="font-semibold text-base mb-2 flex items-center gap-2">
             
              ประวัติการรักษา
            </div>
            {filteredVisits.length === 0 && (
              <div className="text-sm text-gray-400">ไม่มีประวัติการรักษา</div>
            )}
            {filteredVisits.map((v, i) => (
              <div key={v.id ?? `${v.visit_at}-${i}`} className="p-4 border rounded-xl bg-white mb-4">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="font-semibold break-words">
                    {editingId === v.id ? (
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={editDiag}
                        onChange={e => setEditDiag(e.target.value)}
                        placeholder="Diagnosis"
                      />
                    ) : (
                      v.diagnosis?.trim() || '—'
                    )}
                  </div>
                  <div className="text-xs text-gray-500 shrink-0">
                    {fmtDate(v.visit_at)}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-700 whitespace-pre-wrap break-words">
                  <div>
                    <span className="font-medium">Chief Complaint:</span> {v.chief_complaint?.trim() || '—'}
                  </div>
                  <div>
                    <span className="font-medium">Plan:</span>{" "}
                    {editingId === v.id ? (
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={editPlan}
                        onChange={e => setEditPlan(e.target.value)}
                        placeholder="Plan"
                      />
                    ) : (
                      v.plan?.trim() || '—'
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Advice:</span>{" "}
                    {editingId === v.id ? (
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={editAdvice}
                        onChange={e => setEditAdvice(e.target.value)}
                        placeholder="Advice"
                      />
                    ) : (
                      v.advice?.trim() || '—'
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Medications:</span>{' '}
                    {Array.isArray((v as any).rx_items) && (v as any).rx_items.length > 0
                      ? (
                        <ul className="list-disc ml-5">
                          {(v as any).rx_items.map((rx: any, idx: number) => (
                            <li key={rx.id ?? rx.drug_code ?? idx} className="mb-1">
                              <span className="font-semibold">{rx.name}</span>
                              {rx.strength ? ` ${rx.strength}` : ""}
                              {rx.qty_per_dose ? ` | ขนาด: ${rx.qty_per_dose}` : ""}
                              {rx.doses_per_day ? ` | ครั้ง/วัน: ${rx.doses_per_day}` : ""}
                              {rx.period_days ? ` | จำนวนวัน: ${rx.period_days}` : ""}
                              {rx.frequency ? ` | Frequency: ${rx.frequency}` : ""}
                              {rx.period ? ` | Period: ${rx.period}` : ""}
                              {rx.meal_timing ? ` | เวลากับอาหาร: ${rx.meal_timing}` : ""}
                              {rx.note ? ` | Note: ${rx.note}` : ""}
                              {rx.dispensed_date || rx.dispensed_time
                                ? ` | จ่ายเมื่อ: ${rx.dispensed_date ?? ""} ${rx.dispensed_time ?? ""}`
                                : ""}
                              {rx.drug_code ? ` | รหัสยา: ${rx.drug_code}` : ""}
                            </li>
                          ))}
                        </ul>
                      )
                      : <span className="text-gray-400">—</span>}
                  </div>
                  <div>
                    <span className="font-medium">Note:</span> {(v as any).note?.trim() || '—'}
                  </div>
                  <div>
                    <span className="font-medium">Department:</span> {v.dept?.trim() || '—'}
                  </div>
                  <div>
                    <span className="font-medium">Vitals:</span>{' '}
                    {(v.bp_sys || v.bp_dia) ? `BP ${v.bp_sys ?? '-'} / ${v.bp_dia ?? '-'}` : ''}
                    {v.pulse ? ` · PR ${v.pulse}` : ''}
                    {v.temp_c ? ` · Temp ${v.temp_c}°C` : ''}
                    {v.rr ? ` · RR ${v.rr}` : ''}
                    {v.spo2 ? ` · SpO₂ ${v.spo2}%` : ''}
                    {(v.height_cm || v.weight_kg) ? ` · Ht ${v.height_cm ?? '-'} cm · Wt ${v.weight_kg ?? '-'} kg` : ''}
                    {v.bmi ? ` · BMI ${v.bmi}` : ''}
                    {!(v.bp_sys || v.bp_dia || v.pulse || v.temp_c || v.rr || v.spo2 || v.height_cm || v.weight_kg || v.bmi) ? '—' : ''}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  {editingId === v.id ? (
                    <>
                      <button
                        className="px-3 py-1 rounded bg-green-100 border"
                        onClick={() => handleSave(v.id)}
                      >
                        บันทึก
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-gray-100 border"
                        onClick={() => setEditingId(null)}
                      >
                        ยกเลิก
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-100 border text-red-700"
                        onClick={() => handleDelete(v.id)}
                      >
                        ลบ
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-3 py-1 rounded bg-gray-100 border"
                        onClick={() => {
                          setEditingId(v.id);
                          setEditDiag(v.diagnosis ?? "");
                          setEditPlan(v.plan ?? "");
                          setEditAdvice(v.advice ?? "");
                        }}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-100 border text-red-700"
                        onClick={() => handleDelete(v.id)}
                      >
                        ลบ
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* ประวัติการนัดหมาย */}
          <section>
            <div className="font-semibold text-base mb-2 flex items-center gap-2">
              ประวัติการนัดหมาย
            </div>
            {sortedAppts.length === 0 && (
              <div className="text-sm text-gray-400">ไม่มีประวัติการนัดหมาย</div>
            )}
            <ul className="space-y-2">
              {sortedAppts.map((a, i) => (
                <li key={a.id ?? `${a.start_at}-${i}`} className="p-3 border rounded-xl bg-white">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium">{fmtDate(a.start_at)}</span>
                    <span className="text-xs text-gray-500">{a.status || '—'}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">เหตุผล:</span> {a.reason || '—'}
                    </div>
                    <div>
                      <span className="font-medium">หมายเหตุ:</span> {a.note || '—'}
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-red-100 border text-red-700"
                      onClick={() => handleDeleteAppt(a.id)}
                    >
                      ลบ
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
