const statusStyles: Record<string, string> = {
  // General
  draft: "erp-badge-neutral",
  pending: "erp-badge-warning",
  approved: "erp-badge-success",
  rejected: "erp-badge-danger",
  // Sales
  sent: "erp-badge-info",
  confirmed: "erp-badge-success",
  processing: "erp-badge-info",
  delivered: "erp-badge-success",
  partial: "erp-badge-warning",
  // Purchase
  converted: "erp-badge-success",
  received: "erp-badge-success",
  cancelled: "erp-badge-danger",
  // Accounting
  open: "erp-badge-info",
  paid: "erp-badge-success",
  overdue: "erp-badge-danger",
  // Calendar
  scheduled: "erp-badge-info",
  completed: "erp-badge-success",
  delayed: "erp-badge-danger",
};

const statusLabels: Record<string, string> = {
  draft: "แบบร่าง",
  pending: "รออนุมัติ",
  approved: "อนุมัติ",
  rejected: "ไม่อนุมัติ",
  sent: "ส่งแล้ว",
  confirmed: "ยืนยัน",
  processing: "กำลังดำเนินการ",
  delivered: "ส่งมอบแล้ว",
  partial: "บางส่วน",
  converted: "แปลงแล้ว",
  received: "รับแล้ว",
  cancelled: "ยกเลิก",
  open: "เปิด",
  paid: "ชำระแล้ว",
  overdue: "เกินกำหนด",
  scheduled: "กำหนดการ",
  completed: "เสร็จสิ้น",
  delayed: "ล่าช้า",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={statusStyles[status] || "erp-badge-neutral"}>
      {statusLabels[status] || status}
    </span>
  );
}
