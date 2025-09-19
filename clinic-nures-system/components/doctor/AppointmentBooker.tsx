import * as React from "react";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Appt = {
  id?: string;
  start_at: string;
  end_at?: string | null;
  reason: string;
  patient_id: string;
  status?: string | null;
  note?: string | null;
};

function toISODateLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * รวมวันที่ (YYYY-MM-DD) + เวลา(HH:mm) เป็น ISO (UTC) โดยออฟเซ็ตเป็นนาที
 * - ถ้าไม่ส่ง tzOffsetMinutes เข้ามา จะใช้ offset ของเครื่องผู้ใช้
 */
function combineDateTimeToISO(date: string, hhmm: string, tzOffsetMinutes?: number) {
  const [h, m] = hhmm.split(":").map(Number);
  const [y, mo, d] = date.split("-").map(Number);
  const local = new Date(y, mo - 1, d, h, m, 0);
  const offset = typeof tzOffsetMinutes === "number" ? tzOffsetMinutes : -local.getTimezoneOffset();
  const utcMs = local.getTime() - offset * 60_000;
  return new Date(utcMs).toISOString();
}

export function AppointmentBooker({
  patient,
  onBooked,
  defaultDurationMin = 20,
  fixedTzOffsetMinutes,
}: {
  patient: any;
  onBooked: (a: Appt) => void;
  defaultDurationMin?: number;
  fixedTzOffsetMinutes?: number;
}) {
  const [date, setDate] = React.useState(() => toISODateLocal(new Date()));
  const [time, setTime] = React.useState("09:00");
  const [reason, setReason] = React.useState("ติดตามอาการ");
  const [note, setNote] = React.useState<string>("");
  const [saving, setSaving] = React.useState(false);
  // Automatically set citizenId from patient.id_card (priority), fallback hn/citizen_id
  const [citizenId, setCitizenId] = React.useState<string>(
    () => patient?.id_card?.toString() || patient?.hn?.toString() || patient?.citizen_id?.toString() || ""
  );

  const patientId: string | undefined =
    (patient?.id ?? patient?.patient_id)?.toString() || undefined;

  React.useEffect(() => {
    setCitizenId(
      patient?.id_card?.toString() || patient?.hn?.toString() || patient?.citizen_id?.toString() || ""
    );
  }, [patient]);

  const saveAppt = async (row: Partial<Appt>) => {
    setSaving(true);
    try {
      // Compose patient_name from patient object
      let patientName =
        patient?.name ||
        patient?.patient_name ||
        [patient?.prefix, patient?.first_name, patient?.last_name].filter(Boolean).join(" ").trim() ||
        null;

      let payload: any = {
        patient_id: patient?.id?.toString() || patientId,
        hn: patient?.hn?.toString() || null,
        citizen_id: citizenId.trim() || null, // ดึงจาก id_card ที่เลือก
        patient_name: patientName,
        reason,
        start_at: row.start_at,
        end_at: row.end_at ?? null,
        note: note?.trim() || null,
        scheduled_at: row.start_at, // Use start_at as scheduled_at
      };

      let insert = await supabase.from("appointments").insert([payload]).select().single();

      if (insert.error && insert.error.code === "42703") {
        const trimmed: any = {
          patient_id: payload.patient_id,
          hn: payload.hn,
          citizen_id: payload.citizen_id,
          patient_name: payload.patient_name,
          reason: payload.reason,
          start_at: payload.start_at,
          end_at: payload.end_at,
          scheduled_at: payload.scheduled_at,
        };
        insert = await supabase.from("appointments").insert([trimmed]).select().single();
      }

      if (insert.error) throw insert.error;

      onBooked(insert.data);
      toast({ description: "จองนัดหมายเรียบร้อย", variant: "default" });
    } catch (e: any) {
      toast({ description: e?.message || "เกิดข้อผิดพลาด", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const onManualSave = async () => {
    if (!patientId) {
      toast({ description: "ไม่พบรหัสผู้ป่วย", variant: "destructive" });
      return;
    }
    if (!citizenId.trim()) {
      toast({ description: "ไม่พบรหัสบัตรประชาชนของผู้ป่วย", variant: "destructive" });
      return;
    }
    if (!date || !time) {
      toast({ description: "กรุณาเลือกวันและเวลา", variant: "destructive" });
      return;
    }
    if (!reason.trim()) {
      toast({ description: "กรุณากรอกเหตุผลนัดหมาย", variant: "destructive" });
      return;
    }

    const startISO = combineDateTimeToISO(date, time, fixedTzOffsetMinutes);
    const endISO = new Date(new Date(startISO).getTime() + Math.max(1, defaultDurationMin) * 60_000).toISOString();

    await saveAppt({ start_at: startISO, end_at: endISO });
  };

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-2">
        <div>
          <label className="block text-sm text-slate-600 mb-1">เลือกวัน</label>
          <input
            type="date"
            className="w-full border rounded-xl px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">เหตุผลนัดหมาย</label>
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="เช่น ติดตามอาการ, รับผลตรวจ"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-2">
        <div>
          <label className="block text-sm text-slate-600 mb-1">เวลาเริ่ม</label>
          <input
            type="time"
            className="w-full border rounded-xl px-3 py-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button
            className="w-full border rounded-xl px-3 py-2 hover:bg-slate-50 disabled:opacity-50"
            onClick={onManualSave}
            disabled={saving}
          >
            {saving ? "กำลังบันทึก..." : "บันทึกนัด"}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-600 mb-1">บันทึกเพิ่มเติม (ถ้ามี)</label>
        <textarea
          className="w-full border rounded-xl px-3 py-2"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="รายละเอียดเพิ่มเติม เช่น โทรยืนยันก่อน 1 วัน"
        />
      </div>
    </div>
  );
}
