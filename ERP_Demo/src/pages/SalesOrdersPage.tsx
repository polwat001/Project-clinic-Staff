import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { salesOrders } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);

export default function SalesOrdersPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="ใบสั่งขาย" description="Sales Order → Delivery Order" actions={<Button size="sm"><Plus className="w-4 h-4 mr-1" />สร้างใบสั่งขาย</Button>} />
      <DataTable
        data={salesOrders}
        keyExtractor={s => s.id}
        columns={[
          { key: "id", header: "เลขที่", render: s => <span className="font-mono text-xs font-medium text-primary">{s.id}</span> },
          { key: "date", header: "วันที่" },
          { key: "customer", header: "ลูกค้า", render: s => <span className="font-medium text-foreground">{s.customer}</span> },
          { key: "quotationRef", header: "อ้างอิง QT", render: s => <span className="font-mono text-xs">{s.quotationRef}</span> },
          { key: "items", header: "รายการ", render: s => <span className="text-xs text-muted-foreground">{s.items.map(i => `${i.productName} x${i.qty}`).join(", ")}</span> },
          { key: "total", header: "มูลค่า", render: s => <span className="font-mono font-medium">฿{fmt(s.total)}</span> },
          { key: "deliveryDate", header: "กำหนดส่ง" },
          { key: "status", header: "สถานะ", render: s => <StatusBadge status={s.status} /> },
        ]}
      />
    </div>
  );
}
