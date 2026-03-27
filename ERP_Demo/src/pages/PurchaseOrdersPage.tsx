import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { purchaseOrders } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);

export default function PurchaseOrdersPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="ใบสั่งซื้อ" description="Purchase Order → Goods Receipt" actions={<Button size="sm"><Plus className="w-4 h-4 mr-1" />สร้างใบสั่งซื้อ</Button>} />
      <DataTable
        data={purchaseOrders}
        keyExtractor={p => p.id}
        columns={[
          { key: "id", header: "เลขที่", render: p => <span className="font-mono text-xs font-medium text-primary">{p.id}</span> },
          { key: "date", header: "วันที่" },
          { key: "supplier", header: "ผู้จำหน่าย", render: p => <span className="font-medium text-foreground">{p.supplier}</span> },
          { key: "prRef", header: "อ้างอิง PR", render: p => <span className="font-mono text-xs">{p.prRef}</span> },
          { key: "items", header: "รายการ", render: p => <span className="text-xs text-muted-foreground">{p.items.map(i => `${i.productName} x${i.qty}`).join(", ")}</span> },
          { key: "total", header: "มูลค่า", render: p => <span className="font-mono font-medium">฿{fmt(p.total)}</span> },
          { key: "expectedDate", header: "กำหนดรับ" },
          { key: "status", header: "สถานะ", render: p => <StatusBadge status={p.status} /> },
        ]}
      />
    </div>
  );
}
