"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
  Gauge,
  Package,
  Timer,
} from "lucide-react"

interface WIPOrder {
  id: string
  productName: string
  targetQuantity: number
  currentQuantity: number
  machine: string
  operator: string
  startTime: string
  estimatedCompletion: string
  status: "on-track" | "at-risk" | "delayed"
  defectRate: number
}

// Mock real-time WIP data
const wipOrders: WIPOrder[] = [
  {
    id: "PO-2024-010",
    productName: "Carbon Filter Type A",
    targetQuantity: 5000,
    currentQuantity: 3850,
    machine: "เครื่องอัด P1",
    operator: "สมชาย มั่นคง",
    startTime: "06:00",
    estimatedCompletion: "16:30",
    status: "on-track",
    defectRate: 2.1,
  },
  {
    id: "PO-2024-011",
    productName: "Carbon Block B200",
    targetQuantity: 3000,
    currentQuantity: 1200,
    machine: "เครื่องอัด P2",
    operator: "วิภา ใจดี",
    startTime: "06:00",
    estimatedCompletion: "18:45",
    status: "at-risk",
    defectRate: 3.5,
  },
  {
    id: "PO-2024-012",
    productName: "Activated Carbon X",
    targetQuantity: 2500,
    currentQuantity: 2450,
    machine: "เครื่องผสม M1",
    operator: "ประยุทธ์ เก่งมาก",
    startTime: "06:00",
    estimatedCompletion: "14:15",
    status: "on-track",
    defectRate: 1.8,
  },
  {
    id: "PO-2024-013",
    productName: "Filter Media C100",
    targetQuantity: 8000,
    currentQuantity: 2100,
    machine: "เครื่องอัด P3",
    operator: "มานี รักงาน",
    startTime: "06:00",
    estimatedCompletion: "22:00",
    status: "delayed",
    defectRate: 4.2,
  },
]

const oeeData = [
  { name: "P1", availability: 92, performance: 88, quality: 98 },
  { name: "P2", availability: 85, performance: 82, quality: 96 },
  { name: "M1", availability: 95, performance: 91, quality: 99 },
  { name: "P3", availability: 78, performance: 75, quality: 95 },
  { name: "A1", availability: 88, performance: 85, quality: 97 },
]

const productionTrend = [
  { time: "06:00", actual: 0, target: 0 },
  { time: "08:00", actual: 850, target: 900 },
  { time: "10:00", actual: 1750, target: 1800 },
  { time: "12:00", actual: 2500, target: 2700 },
  { time: "14:00", actual: 3200, target: 3600 },
  { time: "16:00", actual: 3850, target: 4500 },
]

const statusDistribution = [
  { name: "กำลังผลิต", value: 4, color: "oklch(0.65 0.2 145)" },
  { name: "เสร็จสิ้น", value: 8, color: "oklch(0.65 0.2 250)" },
  { name: "รอดำเนินการ", value: 3, color: "oklch(0.6 0 0)" },
]

function StatusBadge({ status }: { status: "on-track" | "at-risk" | "delayed" }) {
  const config = {
    "on-track": { label: "ทันกำหนด", className: "bg-success text-success-foreground", icon: CheckCircle2 },
    "at-risk": { label: "เสี่ยงล่าช้า", className: "bg-warning text-warning-foreground", icon: AlertTriangle },
    "delayed": { label: "ล่าช้า", className: "bg-danger text-danger-foreground", icon: Clock },
  }
  const { label, className, icon: Icon } = config[status]
  return (
    <Badge className={className}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  )
}

export default function PlanningPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [wipData, setWipData] = useState(wipOrders)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      
      // Simulate production progress
      setWipData((prev) =>
        prev.map((order) => {
          if (order.currentQuantity < order.targetQuantity && order.status !== "delayed") {
            const increment = Math.floor(Math.random() * 15) + 5
            return {
              ...order,
              currentQuantity: Math.min(order.currentQuantity + increment, order.targetQuantity),
            }
          }
          return order
        })
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Calculate overall stats
  const totalTarget = wipData.reduce((sum, o) => sum + o.targetQuantity, 0)
  const totalCurrent = wipData.reduce((sum, o) => sum + o.currentQuantity, 0)
  const overallProgress = Math.round((totalCurrent / totalTarget) * 100)
  const onTrackCount = wipData.filter((o) => o.status === "on-track").length
  const atRiskCount = wipData.filter((o) => o.status === "at-risk" || o.status === "delayed").length

  // Calculate average OEE
  const avgOEE = oeeData.reduce((sum, m) => {
    const oee = (m.availability * m.performance * m.quality) / 10000
    return sum + oee
  }, 0) / oeeData.length

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">แดชบอร์ดวางแผนผลิต</h1>
          <p className="text-sm text-muted-foreground">
            ภาพรวมการผลิตแบบ Real-time สำหรับฝ่ายวางแผนและผู้บริหาร
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-4 py-2">
          <Activity className="h-4 w-4 text-success animate-pulse" />
          <span className="font-mono text-sm">
            {currentTime.toLocaleTimeString("th-TH")}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-borde text-black ">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/20 p-2">
                <Gauge className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">OEE เฉลี่ย</p>
                <p className="text-2xl font-bold">{(avgOEE * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border text-black">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/20 p-2">
                <Target className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ความคืบหน้ารวม</p>
                <p className="text-2xl font-bold">{overallProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border text-black">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/20 p-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ทันกำหนด</p>
                <p className="text-2xl font-bold">{onTrackCount} ออเดอร์</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border text-black">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-danger/20 p-2">
                <AlertTriangle className="h-5 w-5 text-danger" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">เสี่ยงล่าช้า</p>
                <p className="text-2xl font-bold text-danger">{atRiskCount} ออเดอร์</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* WIP Tracking - Main Panel */}
        <div className="space-y-6 lg:col-span-2">
          {/* Real-time WIP Table */}
          <Card className="border-border text-black">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-5 w-5 text-primary" />
                WIP Tracking (Real-time)
                <span className="ml-auto flex items-center gap-1 text-xs text-success">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                  Live
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">ใบสั่งผลิต</TableHead>
                    <TableHead className="text-xs">สินค้า</TableHead>
                    <TableHead className="text-xs">ความคืบหน้า</TableHead>
                    <TableHead className="text-xs">เวลาที่คาดว่าจะเสร็จ</TableHead>
                    <TableHead className="text-xs">สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wipData.map((order) => {
                    const progress = Math.round((order.currentQuantity / order.targetQuantity) * 100)
                    return (
                      <TableRow key={order.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-xs font-medium text-primary">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{order.productName}</p>
                            <p className="text-xs text-muted-foreground">{order.machine}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-32">
                            <div className="flex items-center justify-between text-xs">
                              <span>{order.currentQuantity.toLocaleString()}</span>
                              <span className="text-muted-foreground">
                                / {order.targetQuantity.toLocaleString()}
                              </span>
                            </div>
                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  order.status === "on-track"
                                    ? "bg-success"
                                    : order.status === "at-risk"
                                    ? "bg-warning"
                                    : "bg-danger"
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="mt-0.5 text-right text-xs font-medium">{progress}%</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Timer className="h-3 w-3 text-muted-foreground" />
                            <span className="font-mono text-sm">{order.estimatedCompletion}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Production Trend Chart */}
          <Card className="border-border text-black">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-primary" />
                แนวโน้มการผลิตวันนี้ (Actual vs Target)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productionTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="oklch(0.6 0 0)"
                      tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="oklch(0.6 0 0)"
                      tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.18 0.005 260)",
                        border: "1px solid oklch(0.28 0.005 260)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "oklch(0.95 0 0)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="oklch(0.6 0 0)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="เป้าหมาย"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="oklch(0.65 0.2 145)"
                      strokeWidth={3}
                      dot={{ fill: "oklch(0.65 0.2 145)" }}
                      name="ผลิตจริง"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-6 bg-success" />
                  <span className="text-muted-foreground">ผลิตจริง</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-6 border-t-2 border-dashed border-muted-foreground" />
                  <span className="text-muted-foreground">เป้าหมาย</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - OEE & Status */}
        <div className="space-y-6">
          {/* OEE by Machine */}
          <Card className="border-borde text-black ">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Gauge className="h-5 w-5 text-primary" />
                OEE ตามเครื่องจักร
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={oeeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0)" />
                    <XAxis 
                      type="number" 
                      domain={[0, 100]}
                      stroke="oklch(0.6 0 0)"
                      tick={{ fill: "oklch(0.6 0 0)", fontSize: 10 }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category"
                      stroke="oklch(0.6 0 0)"
                      tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                      width={30}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.18 0.005 260)",
                        border: "1px solid oklch(0.28 0.005 260)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "oklch(0.95 0 0)" }}
                    />
                    <Bar dataKey="availability" name="Availability" fill="oklch(0.65 0.2 145)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {oeeData.map((machine) => {
                  const oee = ((machine.availability * machine.performance * machine.quality) / 10000).toFixed(1)
                  return (
                    <div key={machine.name} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{machine.name}</span>
                      <span className={`font-bold ${parseFloat(oee) >= 85 ? "text-success" : parseFloat(oee) >= 70 ? "text-warning" : "text-danger"}`}>
                        {oee}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="border-borde text-black ">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">สถานะออเดอร์</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.18 0.005 260)",
                        border: "1px solid oklch(0.28 0.005 260)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-4">
                {statusDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="border-borde text-black ">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-warning" />
                การแจ้งเตือน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wipData
                  .filter((o) => o.status !== "on-track")
                  .map((order) => (
                    <div
                      key={order.id}
                      className={`rounded-lg p-3 ${
                        order.status === "delayed" ? "bg-danger/10" : "bg-warning/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {order.status === "delayed" ? (
                          <Clock className="h-4 w-4 text-danger" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        )}
                        <span className="font-mono text-xs font-medium">{order.id}</span>
                      </div>
                      <p className="mt-1 text-sm">{order.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.status === "delayed"
                          ? "อัตราการผลิตต่ำกว่าเป้า ไม่ทันกำหนดส่ง"
                          : "แนวโน้มอาจไม่ทันกำหนด ต้องเร่งผลิต"}
                      </p>
                    </div>
                  ))}
                {wipData.filter((o) => o.status !== "on-track").length === 0 && (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-success opacity-50" />
                    ไม่มีการแจ้งเตือน
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
