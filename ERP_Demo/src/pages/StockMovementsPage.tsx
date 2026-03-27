import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { stockMovements } from "@/data/mockData";

const typeLabels: Record<string, string> = { receive: "รับเข้า", issue: "เบิกออก", transfer: "โอนย้าย", adjust: "ปรับปรุง" };

export default function StockMovementsPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="เคลื่อนไหวสต็อก" description="ประวัติการรับ-จ่าย-โอนย้าย-ปรับปรุงสินค้า" />
      <DataTable
        data={stockMovements}
        keyExtractor={m => m.id}
        columns={[
          { key: "date", header: "วันที่" },
          { key: "id", header: "เลขที่", render: m => <span className="font-mono text-xs">{m.id}</span> },
          { key: "productName", header: "สินค้า", render: m => <span className="font-medium text-foreground">{m.productName}</span> },
          { key: "type", header: "ประเภท", render: m => <span className="erp-badge-info">{typeLabels[m.type]}</span> },
          { key: "qty", header: "จำนวน", render: m => <span className={`font-mono font-medium ${m.qty > 0 ? "text-success" : "text-destructive"}`}>{m.qty > 0 ? "+" : ""}{m.qty}</span> },
          { key: "location", header: "จาก → ไป", render: m => <span className="text-xs text-muted-foreground">{m.fromLocation || "-"} → {m.toLocation || "-"}</span> },
          { key: "reference", header: "อ้างอิง", render: m => <span className="font-mono text-xs">{m.reference}</span> },
          { key: "note", header: "หมายเหตุ" },
        ]}
      />
    </div>
  );
}
