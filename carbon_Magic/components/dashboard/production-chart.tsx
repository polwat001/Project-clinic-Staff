"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "สาย A", actual: 4200, target: 4500 },
  { name: "สาย B", actual: 3800, target: 4000 },
  { name: "สาย C", actual: 5100, target: 5000 },
  { name: "สาย D", actual: 2900, target: 3500 },
]

export function ProductionChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          axisLine={{ stroke: "var(--border)" }}
        />
        <YAxis 
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          axisLine={{ stroke: "var(--border)" }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--foreground)"
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: 12 }}
          formatter={(value) => <span style={{ color: "var(--muted-foreground)" }}>{value}</span>}
        />
        <Bar dataKey="actual" name="ผลิตจริง" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="target" name="เป้าหมาย" fill="var(--muted)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
