import PageHeader from "@/components/PageHeader";
import { deliveryEvents } from "@/data/mockData";
import StatusBadge from "@/components/StatusBadge";
import { Package } from "lucide-react";

export default function ReceiveCalendarPage() {
  const receives = deliveryEvents.filter(e => e.type === "receive");
  return (
    <div className="space-y-4">
      <PageHeader title="ปฏิทินรับของ" description="กำหนดการรับสินค้าจากผู้จำหน่าย" />
      <div className="erp-card">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Package className="w-4 h-4 text-info" />
          <h3 className="text-sm font-semibold text-foreground">รายการรับของที่กำลังจะถึง</h3>
        </div>
        <div className="divide-y divide-border">
          {receives.map(e => (
            <div key={e.id} className="px-4 py-3 flex items-center gap-4">
              <div className="w-16 text-center">
                <p className="text-xl font-bold text-info">{new Date(e.date).getDate()}</p>
                <p className="text-[11px] text-muted-foreground">{new Date(e.date).toLocaleDateString("th-TH", { month: "short", year: "2-digit" })}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{e.partner}</p>
                <p className="text-xs text-muted-foreground">{e.items}</p>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">{e.reference}</p>
              </div>
              <StatusBadge status={e.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
