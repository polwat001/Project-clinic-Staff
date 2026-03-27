import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { quotations } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);

export default function QuotationsPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="ใบเสนอราคา" description="Quotation → Sales Order" actions={<Button size="sm"><Plus className="w-4 h-4 mr-1" />สร้างใบเสนอราคา</Button>} />
      <DataTable
        data={quotations}
        keyExtractor={q => q.id}
        columns={[
          { key: "id", header: "เลขที่", render: q => <span className="font-mono text-xs font-medium text-primary">{q.id}</span> },
          { key: "date", header: "วันที่" },
          { key: "customer", header: "ลูกค้า", render: q => <span className="font-medium text-foreground">{q.customer}</span> },
          { key: "items", header: "รายการ", render: q => <span className="text-xs text-muted-foreground">{q.items.map(i => `${i.productName} x${i.qty}`).join(", ")}</span> },
          { key: "total", header: "มูลค่า", render: q => <span className="font-mono font-medium">฿{fmt(q.total)}</span> },
          { key: "validUntil", header: "หมดอายุ" },
          { key: "status", header: "สถานะ", render: q => <StatusBadge status={q.status} /> },
        ]}
      />
    </div>
  );
}
