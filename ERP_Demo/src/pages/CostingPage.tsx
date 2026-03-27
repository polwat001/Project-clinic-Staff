import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { costSummaries } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);

const chartData = costSummaries.map(c => ({
  name: c.sku,
  วัตถุดิบ: c.materialCost,
  ค่าแรง: c.laborCost,
  โสหุ้ย: c.overheadCost,
}));

export default function CostingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="ต้นทุนสินค้า" description="Cost Accounting — วิเคราะห์โครงสร้างต้นทุนสินค้าสำเร็จรูป" />

      <div className="erp-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">โครงสร้างต้นทุนต่อหน่วย</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => `฿${fmt(v)}`} />
            <Legend />
            <Bar dataKey="วัตถุดิบ" stackId="a" fill="hsl(217, 91%, 50%)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="ค่าแรง" stackId="a" fill="hsl(142, 71%, 45%)" />
            <Bar dataKey="โสหุ้ย" stackId="a" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DataTable
        data={costSummaries}
        keyExtractor={c => c.sku}
        columns={[
          { key: "sku", header: "SKU", render: c => <span className="font-mono text-xs">{c.sku}</span> },
          { key: "productName", header: "สินค้า", render: c => <span className="font-medium text-foreground">{c.productName}</span> },
          { key: "materialCost", header: "วัตถุดิบ", render: c => <span className="font-mono">฿{fmt(c.materialCost)}</span> },
          { key: "laborCost", header: "ค่าแรง", render: c => <span className="font-mono">฿{fmt(c.laborCost)}</span> },
          { key: "overheadCost", header: "โสหุ้ย", render: c => <span className="font-mono">฿{fmt(c.overheadCost)}</span> },
          { key: "totalCost", header: "ต้นทุนรวม/หน่วย", render: c => <span className="font-mono font-bold text-primary">฿{fmt(c.totalCost)}</span> },
          { key: "costMethod", header: "วิธีคำนวณ", render: c => <span className="erp-badge-info">{c.costMethod === "moving-avg" ? "Moving Avg" : "FIFO"}</span> },
          { key: "unitsProduced", header: "ผลิตแล้ว", render: c => <span className="font-mono">{c.unitsProduced} หน่วย</span> },
        ]}
      />
    </div>
  );
}
