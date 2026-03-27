import PageHeader from "@/components/PageHeader";
import { products } from "@/data/mockData";
import { MapPin } from "lucide-react";

const zones = [
  { zone: "A", label: "โซน A — วัตถุดิบ", color: "primary" },
  { zone: "B", label: "โซน B — สินค้าสำเร็จรูป", color: "success" },
  { zone: "C", label: "โซน C — บรรจุภัณฑ์", color: "warning" },
];

export default function LocationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="พิกัดจัดเก็บ" description="แผนผังตำแหน่งสินค้าในคลัง" />
      {zones.map(z => {
        const zoneProducts = products.filter(p => p.location.startsWith(z.zone));
        return (
          <div key={z.zone} className="erp-card">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">{z.label}</h3>
              <span className="erp-badge-neutral ml-2">{zoneProducts.length} รายการ</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {zoneProducts.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-mono font-bold ${p.qty <= p.minQty ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                    {p.location}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.qty} {p.unit} • SKU: {p.sku}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
