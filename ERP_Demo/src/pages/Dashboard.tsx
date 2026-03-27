import { Package, ShoppingCart, Truck, Calculator, AlertTriangle, TrendingUp, TrendingDown, ArrowRightLeft } from "lucide-react";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { products, salesOrders, purchaseOrders, arapEntries, stockMovements } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const lowStockProducts = products.filter(p => p.qty <= p.minQty);
const inventoryValue = products.reduce((sum, p) => sum + p.qty * p.costPerUnit, 0);
const totalAR = arapEntries.filter(e => e.type === "AR").reduce((s, e) => s + e.balance, 0);
const totalAP = arapEntries.filter(e => e.type === "AP").reduce((s, e) => s + e.balance, 0);

const categoryData = [
  { name: "วัตถุดิบ", value: products.filter(p => p.category === "raw-material").reduce((s, p) => s + p.qty * p.costPerUnit, 0) },
  { name: "สินค้าสำเร็จรูป", value: products.filter(p => p.category === "finished-goods").reduce((s, p) => s + p.qty * p.costPerUnit, 0) },
  { name: "บรรจุภัณฑ์", value: products.filter(p => p.category === "packaging").reduce((s, p) => s + p.qty * p.costPerUnit, 0) },
];

const movementChart = [
  { name: "23 มี.ค.", receive: 0, issue: 10 },
  { name: "24 มี.ค.", receive: 20, issue: 5 },
  { name: "25 มี.ค.", receive: 500, issue: 15 },
  { name: "26 มี.ค.", receive: 0, issue: 30 },
  { name: "27 มี.ค.", receive: 200, issue: 0 },
];

const COLORS = ["hsl(217, 91%, 50%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)"];

const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="แดชบอร์ด" description="ภาพรวมระบบ DemoERP" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="มูลค่าสินค้าคงเหลือ" value={`฿${fmt(inventoryValue)}`} icon={Package} color="primary" trend={{ value: "+3.2% จากเดือนก่อน", positive: true }} />
        <StatCard title="ใบสั่งขายที่รอส่ง" value={salesOrders.filter(s => s.status !== "delivered").length} subtitle={`มูลค่ารวม ฿${fmt(salesOrders.filter(s => s.status !== "delivered").reduce((s, o) => s + o.total, 0))}`} icon={ShoppingCart} color="success" />
        <StatCard title="ใบสั่งซื้อที่รอรับ" value={purchaseOrders.filter(p => p.status !== "received").length} subtitle={`มูลค่ารวม ฿${fmt(purchaseOrders.filter(p => p.status !== "received").reduce((s, o) => s + o.total, 0))}`} icon={Truck} color="info" />
        <StatCard title="ลูกหนี้คงค้าง" value={`฿${fmt(totalAR)}`} subtitle={`เจ้าหนี้ ฿${fmt(totalAP)}`} icon={Calculator} color="warning" />
      </div>

      {/* Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="erp-card p-4 border-l-4 border-l-warning">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">สินค้าต่ำกว่าจุดสั่งซื้อ ({lowStockProducts.length} รายการ)</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {lowStockProducts.map(p => (
                  <span key={p.id} className="erp-badge-warning">{p.name} ({p.qty}/{p.minQty})</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 erp-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">การเคลื่อนไหวสต็อก (5 วันล่าสุด)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={movementChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="receive" name="รับเข้า" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="issue" name="เบิกออก" fill="hsl(217, 91%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="erp-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">มูลค่าสินค้าตามประเภท</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `฿${fmt(v)}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="ml-auto font-medium text-foreground">฿{fmt(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent movements */}
      <div className="erp-card">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">รายการเคลื่อนไหวล่าสุด</h3>
        </div>
        <DataTable
          data={stockMovements.slice(0, 5)}
          keyExtractor={m => m.id}
          columns={[
            { key: "date", header: "วันที่" },
            { key: "productName", header: "สินค้า" },
            { key: "type", header: "ประเภท", render: m => <StatusBadge status={m.type === "receive" ? "received" : m.type === "issue" ? "processing" : m.type === "transfer" ? "sent" : "pending"} /> },
            { key: "qty", header: "จำนวน", render: m => <span className={`font-mono font-medium ${m.qty > 0 ? "text-success" : "text-destructive"}`}>{m.qty > 0 ? "+" : ""}{m.qty}</span> },
            { key: "reference", header: "อ้างอิง", render: m => <span className="font-mono text-xs">{m.reference}</span> },
          ]}
        />
      </div>
    </div>
  );
}
