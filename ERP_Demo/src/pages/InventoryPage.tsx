import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { products } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);

const categoryLabels: Record<string, string> = {
  "raw-material": "วัตถุดิบ",
  "finished-goods": "สินค้าสำเร็จรูป",
  packaging: "บรรจุภัณฑ์",
};

export default function InventoryPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

  return (
    <div className="space-y-4">
      <PageHeader title="สินค้าคงเหลือ" description="รายการสินค้าและวัตถุดิบทั้งหมดในคลัง" actions={<Button size="sm"><Plus className="w-4 h-4 mr-1" />เพิ่มสินค้า</Button>} />

      <div className="flex flex-wrap gap-2">
        {[{ key: "all", label: "ทั้งหมด" }, { key: "raw-material", label: "วัตถุดิบ" }, { key: "finished-goods", label: "สินค้าสำเร็จรูป" }, { key: "packaging", label: "บรรจุภัณฑ์" }].map(c => (
          <button key={c.key} onClick={() => setFilter(c.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === c.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{c.label}</button>
        ))}
      </div>

      <DataTable
        data={filtered}
        keyExtractor={p => p.id}
        columns={[
          { key: "sku", header: "SKU", render: p => <span className="font-mono text-xs">{p.sku}</span> },
          { key: "name", header: "ชื่อสินค้า", render: p => <span className="font-medium text-foreground">{p.name}</span> },
          { key: "category", header: "ประเภท", render: p => <span className="erp-badge-neutral">{categoryLabels[p.category]}</span> },
          { key: "location", header: "พิกัด", render: p => <span className="font-mono text-xs">{p.location}</span> },
          { key: "qty", header: "คงเหลือ", render: p => {
            const isLow = p.qty <= p.minQty;
            return <span className={`font-mono font-medium ${isLow ? "text-destructive" : "text-foreground"}`}>{p.qty} {p.unit}</span>;
          }},
          { key: "minQty", header: "Min/Max", render: p => <span className="text-muted-foreground text-xs">{p.minQty} / {p.maxQty}</span> },
          { key: "costPerUnit", header: "ต้นทุน/หน่วย", render: p => <span className="font-mono">฿{fmt(p.costPerUnit)}</span> },
          { key: "status", header: "สถานะ", render: p => p.qty <= p.minQty ? <StatusBadge status="overdue" /> : p.qty >= p.maxQty ? <StatusBadge status="delayed" /> : <StatusBadge status="completed" /> },
        ]}
      />
    </div>
  );
}
