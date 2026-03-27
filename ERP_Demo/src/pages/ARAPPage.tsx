import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import StatCard from "@/components/StatCard";
import { arapEntries } from "@/data/mockData";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);

export default function ARAPPage() {
  const [tab, setTab] = useState<"AR" | "AP">("AR");
  const data = arapEntries.filter(e => e.type === tab);
  const totalAR = arapEntries.filter(e => e.type === "AR").reduce((s, e) => s + e.balance, 0);
  const totalAP = arapEntries.filter(e => e.type === "AP").reduce((s, e) => s + e.balance, 0);

  return (
    <div className="space-y-4">
      <PageHeader title="ลูกหนี้ / เจ้าหนี้" description="AR/AP — Accounts Receivable & Payable" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="ลูกหนี้คงค้าง (AR)" value={`฿${fmt(totalAR)}`} icon={TrendingUp} color="success" subtitle={`${arapEntries.filter(e => e.type === "AR" && e.status === "open").length} รายการเปิด`} />
        <StatCard title="เจ้าหนี้คงค้าง (AP)" value={`฿${fmt(totalAP)}`} icon={TrendingDown} color="warning" subtitle={`${arapEntries.filter(e => e.type === "AP" && e.status === "overdue").length} รายการเกินกำหนด`} />
      </div>

      <div className="flex gap-2">
        {(["AR", "AP"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {t === "AR" ? "ลูกหนี้ (AR)" : "เจ้าหนี้ (AP)"}
          </button>
        ))}
      </div>

      <DataTable
        data={data}
        keyExtractor={e => e.id}
        columns={[
          { key: "id", header: "เลขที่", render: e => <span className="font-mono text-xs">{e.id}</span> },
          { key: "date", header: "วันที่" },
          { key: "partner", header: tab === "AR" ? "ลูกค้า" : "ผู้จำหน่าย", render: e => <span className="font-medium text-foreground">{e.partner}</span> },
          { key: "description", header: "อ้างอิง", render: e => <span className="font-mono text-xs">{e.description}</span> },
          { key: "amount", header: "มูลค่า", render: e => <span className="font-mono">฿{fmt(e.amount)}</span> },
          { key: "paid", header: "ชำระแล้ว", render: e => <span className="font-mono text-success">฿{fmt(e.paid)}</span> },
          { key: "balance", header: "คงค้าง", render: e => <span className="font-mono font-medium">฿{fmt(e.balance)}</span> },
          { key: "dueDate", header: "ครบกำหนด" },
          { key: "status", header: "สถานะ", render: e => <StatusBadge status={e.status} /> },
        ]}
      />
    </div>
  );
}
