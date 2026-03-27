import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { journalEntries } from "@/data/mockData";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);
const moduleLabels: Record<string, string> = { sales: "การขาย", purchase: "การซื้อ", inventory: "คลัง", manual: "ปรับปรุง" };

export default function JournalPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="สมุดรายวัน" description="General Ledger — Journal Entries" />
      <DataTable
        data={journalEntries}
        keyExtractor={j => j.id}
        columns={[
          { key: "date", header: "วันที่" },
          { key: "id", header: "เลขที่", render: j => <span className="font-mono text-xs">{j.id}</span> },
          { key: "description", header: "รายละเอียด", render: j => <span className="font-medium text-foreground">{j.description}</span> },
          { key: "debitAccount", header: "บัญชีเดบิต", render: j => <span className="text-xs">{j.debitAccount}</span> },
          { key: "creditAccount", header: "บัญชีเครดิต", render: j => <span className="text-xs">{j.creditAccount}</span> },
          { key: "amount", header: "จำนวนเงิน", render: j => <span className="font-mono font-medium">฿{fmt(j.amount)}</span> },
          { key: "reference", header: "อ้างอิง", render: j => <span className="font-mono text-xs">{j.reference}</span> },
          { key: "module", header: "โมดูล", render: j => <span className="erp-badge-info">{moduleLabels[j.module]}</span> },
        ]}
      />
    </div>
  );
}
