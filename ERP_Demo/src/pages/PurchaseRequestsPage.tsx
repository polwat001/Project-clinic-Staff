import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { purchaseRequests } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);

export default function PurchaseRequestsPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="ใบขอซื้อ" description="Purchase Request → Purchase Order" actions={<Button size="sm"><Plus className="w-4 h-4 mr-1" />สร้างใบขอซื้อ</Button>} />
      <DataTable
        data={purchaseRequests}
        keyExtractor={p => p.id}
        columns={[
          { key: "id", header: "เลขที่", render: p => <span className="font-mono text-xs font-medium text-primary">{p.id}</span> },
          { key: "date", header: "วันที่" },
          { key: "requestedBy", header: "ผู้ขอ", render: p => <span className="font-medium text-foreground">{p.requestedBy}</span> },
          { key: "items", header: "รายการ", render: p => <span className="text-xs text-muted-foreground">{p.items.map(i => `${i.productName} x${i.qty}`).join(", ")}</span> },
          { key: "total", header: "มูลค่าประมาณ", render: p => <span className="font-mono font-medium">฿{fmt(p.total)}</span> },
          { key: "reason", header: "เหตุผล" },
          { key: "status", header: "สถานะ", render: p => <StatusBadge status={p.status} /> },
        ]}
      />
    </div>
  );
}
