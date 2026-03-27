import PageHeader from "@/components/PageHeader";
import { deliveryEvents } from "@/data/mockData";
import StatusBadge from "@/components/StatusBadge";
import { Truck, Package } from "lucide-react";

export default function DeliveryCalendarPage() {
  const deliveries = deliveryEvents.filter(e => e.type === "delivery");
  const receives = deliveryEvents.filter(e => e.type === "receive");

  return (
    <div className="space-y-6">
      <PageHeader title="ปฏิทินส่งของ" description="กำหนดการส่งมอบสินค้าให้ลูกค้า" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="erp-card">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">กำหนดส่งของ</h3>
          </div>
          <div className="divide-y divide-border">
            {deliveries.map(e => (
              <div key={e.id} className="px-4 py-3 flex items-center gap-3">
                <div className="w-14 text-center">
                  <p className="text-lg font-bold text-primary">{new Date(e.date).getDate()}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(e.date).toLocaleDateString("th-TH", { month: "short" })}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{e.partner}</p>
                  <p className="text-xs text-muted-foreground">{e.items}</p>
                  <p className="text-xs font-mono text-muted-foreground">{e.reference}</p>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="erp-card">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Package className="w-4 h-4 text-success" />
            <h3 className="text-sm font-semibold text-foreground">กำหนดรับของ</h3>
          </div>
          <div className="divide-y divide-border">
            {receives.map(e => (
              <div key={e.id} className="px-4 py-3 flex items-center gap-3">
                <div className="w-14 text-center">
                  <p className="text-lg font-bold text-success">{new Date(e.date).getDate()}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(e.date).toLocaleDateString("th-TH", { month: "short" })}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{e.partner}</p>
                  <p className="text-xs text-muted-foreground">{e.items}</p>
                  <p className="text-xs font-mono text-muted-foreground">{e.reference}</p>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
