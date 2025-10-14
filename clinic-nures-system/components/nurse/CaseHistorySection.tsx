import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DoctorDiagnosis {
  caseId: string;
  idCard: string;
  name: string;
  chief: string;
  diagnosis: string;
  medicines: Array<{
    name: string;
    dosage: string;
    instructions: string;
  }>;
  notes?: string;
  appointment?: {
    id: string;
    date: string;
    room?: string;
  };
}

interface CaseHistorySectionProps {
  hn: string;
  patient: any;
  casesFromDoctor?: any[];
  casesSent?: any[];
  prescriptionItems?: any[]; // เพิ่ม prop สำหรับ prescription_items
}

export default function CaseHistorySection({
  hn,
  patient,
  casesFromDoctor = [],
  casesSent = [],
  prescriptionItems = [],
}: CaseHistorySectionProps) {
  const [selectedCase, setSelectedCase] = React.useState<any>(null);
  const [expandedDate, setExpandedDate] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<string>("");

  // กรองเฉพาะประวัติของ user ที่เลือก (patient)
  const allCases = [
    ...casesFromDoctor,
    ...casesSent,
  ].filter((c: any) => c.hn === hn || c.idCard === patient?.idCard);

  // กรอง prescriptionItems จากตาราง prescription_items ด้วย citizen_id หรือ hn
  const patientPrescriptions = prescriptionItems.filter(
    (item: any) =>
      item.citizen_id === patient?.idCard ||
      item.hn === hn
  );

  // แปลง prescriptionItems เป็นรูปแบบเดียวกับ allCases เพื่อแสดงในรายการ
  const prescriptionCases = patientPrescriptions.map((item: any) => ({
    caseId: `presc-${item.id}`,
    name: patient?.name || "-",
    chief: "-", // ไม่มีใน prescription_items
    diagnosis: "-", // ไม่มีใน prescription_items
    medicines: [
      {
        name: item.name,
        dosage: item.qty_per_dose ? `${item.qty_per_dose} เม็ด` : "-",
        instructions: `วันละ ${item.doses_per_day || "-"} ครั้ง ${item.period_days ? `${item.period_days} วัน` : ""} ${item.meal_timing ? `หลัง${item.meal_timing}` : ""}`,
      },
    ],
    notes: item.note,
    appointment: undefined,
    dispensed_date: item.dispensed_date,
    dispensed_time: item.dispensed_time,
    doctor_advice: item.doctor_advice,
    isPrescription: true,
  }));

  // รวมข้อมูลทั้งหมด
  const mergedCases = [...allCases, ...prescriptionCases];

  // --- กลุ่มข้อมูลตามวันเวลา (date+time) ---
  // ใช้ dispensed_date+dispensed_time หรือ appointment.date+appointment.time หรือ created_at
  const groupedByDateTime: Record<string, any[]> = {};
  mergedCases.forEach((c) => {
    let dateStr = "-";
    let timeStr = "";
    if (c.dispensed_date) {
      dateStr = new Date(c.dispensed_date).toLocaleDateString("th-TH");
      timeStr = c.dispensed_time ? c.dispensed_time.slice(0, 5) : "";
    } else if (c.appointment?.date) {
      dateStr = new Date(c.appointment.date).toLocaleDateString("th-TH");
      timeStr = c.appointment.time ? c.appointment.time.slice(0, 5) : "";
    } else if (c.created_at) {
      const d = new Date(c.created_at);
      dateStr = d.toLocaleDateString("th-TH");
      timeStr = d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
    }
    const groupKey = `${dateStr}${timeStr ? " " + timeStr : ""}`;
    if (!groupedByDateTime[groupKey]) groupedByDateTime[groupKey] = [];
    groupedByDateTime[groupKey].push(c);
  });

  // แยกวันที่สำหรับ dropdown
  const allDateKeys = Object.keys(groupedByDateTime);
  // ดึงเฉพาะวันที่ (ไม่รวมเวลา) สำหรับ dropdown
  const dateOptions = Array.from(new Set(allDateKeys.map(k => k.split(" ")[0])));

  // กรองตามวันที่ที่เลือก
  const showDateTimeKeys = selectedDate
    ? allDateKeys.filter(k => k.startsWith(selectedDate))
    : allDateKeys;

  // เรียงวันเวลาใหม่ -> เก่า
  const sortedDateTimeKeys = showDateTimeKeys.sort((a, b) => {
    // a, b: "dd/mm/yyyy HH:MM" หรือ "dd/mm/yyyy"
    const [da, ta = "00:00"] = a.split(" ");
    const [db, tb = "00:00"] = b.split(" ");
    const [d1, m1, y1] = da.split("/");
    const [d2, m2, y2] = db.split("/");
    const dateA = new Date(+y1, +m1 - 1, +d1, +ta.split(":")[0], +ta.split(":")[1]);
    const dateB = new Date(+y2, +m2 - 1, +d2, +tb.split(":")[0], +tb.split(":")[1]);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>ผลวินิจฉัยย้อนหลัง</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Dropdown เลือกวันที่ */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm">เลือกวันที่:</span>
          <select
            className="border rounded px-2 py-1 text-black"
            value={selectedDate}
            onChange={e => {
              setSelectedDate(e.target.value);
              setExpandedDate(null);
              setSelectedCase(null);
            }}
          >
            <option value="">-- แสดงทั้งหมด --</option>
            {dateOptions.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
          {selectedDate && (
            <button
              className="ml-2 px-2 py-1 rounded bg-gray-200 text-black text-xs"
              onClick={() => {
                setSelectedDate("");
                setExpandedDate(null);
                setSelectedCase(null);
              }}
            >
              แสดงทั้งหมด
            </button>
          )}
        </div>
        {sortedDateTimeKeys.length === 0 && (
          <div className="text-gray-400">ไม่พบผลวินิจฉัย</div>
        )}
        <div className="space-y-4">
          {sortedDateTimeKeys.map((dateTimeKey) => {
            const group = groupedByDateTime[dateTimeKey];
            // รวมยาในกลุ่มเดียวกัน
            const allDrugs = group.flatMap((c: any) => c.medicines || []);
            // ใช้คำแนะนำหมอแรกในกลุ่ม
            const doctorAdvice = group.find((c: any) => c.doctor_advice)?.doctor_advice || group.find((c: any) => c.notes)?.notes || "-";
            // ใช้อาการแรกในกลุ่ม
            const chief = group.find((c: any) => c.chief && c.chief !== "-")?.chief || "-";
            return (
              <div key={dateTimeKey} className="border rounded-lg bg-blue-50">
                <div
                  className="cursor-pointer px-4 py-2 font-bold text-blue-700 flex justify-between items-center"
                  onClick={() => setExpandedDate(expandedDate === dateTimeKey ? null : dateTimeKey)}
                >
                  <span>
                    วันที่ {dateTimeKey}
                  </span>
                  <span className="text-xs">{expandedDate === dateTimeKey ? "▲" : "▼"}</span>
                </div>
                {expandedDate === dateTimeKey && (
                  <div className="px-4 pb-3 pt-2">
                    <div className="mb-1">
                      <span className="font-semibold text-green-700">คำแนะนำหมอ: </span>
                      <span>{doctorAdvice}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold text-blue-700">อาการ: </span>
                      <span>{chief}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold">รายการยา:</span>
                      {allDrugs.length > 0 ? (
                        <ul className="list-disc ml-6">
                          {allDrugs.map((m: any, idx: number) => (
                            <li key={idx}>
                              {m.name} ({m.dosage}) {m.instructions && <span className="text-xs text-gray-500">| {m.instructions}</span>}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span> - </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {group[0].dispensed_date && (
                        <>วันที่ได้รับยา: {new Date(group[0].dispensed_date).toLocaleDateString('th-TH')}</>
                      )}
                      {group[0].dispensed_time && (
                        <> เวลา: {group[0].dispensed_time.slice(0,5)}</>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

