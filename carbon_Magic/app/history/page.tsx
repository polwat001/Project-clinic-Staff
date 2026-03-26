"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Calendar,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ProductionOrder {
  id: string
  product: string
  machine: string
  status: "completed" | "defect" | "error"
  quantity: number
  defects: number
  startTime: string
  endTime: string
  duration: string
  subLogs?: {
    time: string
    event: string
    type: "info" | "warning" | "error"
  }[]
  temperatureData?: { time: string; value: number }[]
}

const productionOrders: ProductionOrder[] = [
  {
    id: "PO-2026-0342",
    product: "คาร์บอนไฟเบอร์แผ่น A3",
    machine: "P2",
    status: "completed",
    quantity: 500,
    defects: 3,
    startTime: "08:00",
    endTime: "12:30",
    duration: "4:30:00",
    subLogs: [
      { time: "08:00", event: "เริ่มการผลิต", type: "info" },
      { time: "09:15", event: "อุณหภูมิสูงกว่าปกติเล็กน้อย", type: "warning" },
      { time: "12:30", event: "ผลิตเสร็จสมบูรณ์", type: "info" },
    ],
    temperatureData: [
      { time: "08:00", value: 85 },
      { time: "09:00", value: 92 },
      { time: "10:00", value: 88 },
      { time: "11:00", value: 90 },
      { time: "12:00", value: 87 },
    ],
  },
  {
    id: "PO-2026-0341",
    product: "ท่อคาร์บอน 50mm",
    machine: "P3",
    status: "defect",
    quantity: 200,
    defects: 12,
    startTime: "06:00",
    endTime: "10:15",
    duration: "4:15:00",
    subLogs: [
      { time: "06:00", event: "เริ่มการผลิต", type: "info" },
      { time: "07:45", event: "ตรวจพบของเสียเพิ่มขึ้น", type: "warning" },
      { time: "08:30", event: "ปรับพารามิเตอร์แก้ไข", type: "info" },
      { time: "10:15", event: "ผลิตเสร็จสมบูรณ์", type: "info" },
    ],
    temperatureData: [
      { time: "06:00", value: 82 },
      { time: "07:00", value: 95 },
      { time: "08:00", value: 98 },
      { time: "09:00", value: 90 },
      { time: "10:00", value: 88 },
    ],
  },
  {
    id: "PO-2026-0340",
    product: "แผ่นฉนวนความร้อน",
    machine: "D1",
    status: "completed",
    quantity: 1000,
    defects: 5,
    startTime: "00:00",
    endTime: "08:00",
    duration: "8:00:00",
    subLogs: [
      { time: "00:00", event: "เริ่มการผลิต", type: "info" },
      { time: "08:00", event: "ผลิตเสร็จสมบูรณ์", type: "info" },
    ],
  },
  {
    id: "PO-2026-0339",
    product: "คาร์บอนไฟเบอร์แผ่น B2",
    machine: "P1",
    status: "error",
    quantity: 350,
    defects: 0,
    startTime: "14:00",
    endTime: "16:45",
    duration: "2:45:00",
    subLogs: [
      { time: "14:00", event: "เริ่มการผลิต", type: "info" },
      { time: "16:30", event: "E-1042: แรงดันไฮดรอลิกต่ำ", type: "error" },
      { time: "16:45", event: "หยุดการผลิตฉุกเฉิน", type: "error" },
    ],
  },
  {
    id: "PO-2026-0338",
    product: "ชิ้นส่วนรถยนต์ CF-X",
    machine: "M2",
    status: "completed",
    quantity: 150,
    defects: 1,
    startTime: "09:00",
    endTime: "14:30",
    duration: "5:30:00",
    subLogs: [
      { time: "09:00", event: "เริ่มการผลิต", type: "info" },
      { time: "14:30", event: "ผลิตเสร็จสมบูรณ์", type: "info" },
    ],
  },
]

// Machine downtime data for Gantt chart
const machineTimeline = [
  { id: "P1", name: "เครื่องอัด P1", segments: [
    { start: 0, end: 6, status: "running" },
    { start: 6, end: 8, status: "error" },
    { start: 8, end: 14, status: "running" },
    { start: 14, end: 17, status: "error" },
    { start: 17, end: 24, status: "standby" },
  ]},
  { id: "P2", name: "เครื่องอัด P2", segments: [
    { start: 0, end: 4, status: "standby" },
    { start: 4, end: 16, status: "running" },
    { start: 16, end: 24, status: "running" },
  ]},
  { id: "P3", name: "เครื่องอัด P3", segments: [
    { start: 0, end: 2, status: "maintenance" },
    { start: 2, end: 18, status: "running" },
    { start: 18, end: 24, status: "standby" },
  ]},
  { id: "M1", name: "เครื่องผสม M1", segments: [
    { start: 0, end: 8, status: "running" },
    { start: 8, end: 12, status: "standby" },
    { start: 12, end: 20, status: "running" },
    { start: 20, end: 24, status: "standby" },
  ]},
  { id: "M2", name: "เครื่องผสม M2", segments: [
    { start: 0, end: 6, status: "standby" },
    { start: 6, end: 18, status: "running" },
    { start: 18, end: 24, status: "standby" },
  ]},
  { id: "D1", name: "เครื่องอบแห้ง D1", segments: [
    { start: 0, end: 24, status: "running" },
  ]},
]

const statusConfig = {
  completed: { label: "สำเร็จ", icon: CheckCircle2, class: "bg-success/20 text-success border-success/30" },
  defect: { label: "มีของเสีย", icon: AlertCircle, class: "bg-warning/20 text-warning border-warning/30" },
  error: { label: "ขัดข้อง", icon: XCircle, class: "bg-danger/20 text-danger border-danger/30" },
}

const segmentColors = {
  running: "bg-success",
  error: "bg-danger",
  standby: "bg-warning",
  maintenance: "bg-muted-foreground",
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [machineFilter, setMachineFilter] = useState("all")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const filteredOrders = productionOrders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesMachine = machineFilter === "all" || order.machine === machineFilter
    return matchesSearch && matchesStatus && matchesMachine
  })

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">ประวัติและรายงาน</h1>
        <p className="text-sm text-muted-foreground">
          สืบค้นข้อมูลการผลิตย้อนหลังและดาวน์โหลดรายงาน
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="mb-6 border-borde text-black">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ค้นหารหัสใบสั่งผลิตหรือสินค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-muted/50 border-borde text-black pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  defaultValue="2026-03-26"
                  className="w-40 bg-muted/50 border-borde text-black"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="date"
                  defaultValue="2026-03-26"
                  className="w-40 bg-muted/50 border-borde text-black"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-muted/50 border-borde text-black">
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent className="bg-card border-borde text-black">
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="completed">สำเร็จ</SelectItem>
                  <SelectItem value="defect">มีของเสีย</SelectItem>
                  <SelectItem value="error">ขัดข้อง</SelectItem>
                </SelectContent>
              </Select>
              <Select value={machineFilter} onValueChange={setMachineFilter}>
                <SelectTrigger className="w-32 bg-muted/50 border-borde text-black">
                  <SelectValue placeholder="เครื่องจักร" />
                </SelectTrigger>
                <SelectContent className="bg-card border-borde text-black">
                  <SelectItem value="all">ทุกเครื่อง</SelectItem>
                  <SelectItem value="P1">P1</SelectItem>
                  <SelectItem value="P2">P2</SelectItem>
                  <SelectItem value="P3">P3</SelectItem>
                  <SelectItem value="M1">M1</SelectItem>
                  <SelectItem value="M2">M2</SelectItem>
                  <SelectItem value="D1">D1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production History Table */}
      <Card className="mb-6 border-borde text-black">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            ประวัติการผลิต
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-borde text-black hover:bg-transparent">
                <TableHead className="text-muted-foreground"></TableHead>
                <TableHead className="text-muted-foreground">รหัสใบสั่งผลิต</TableHead>
                <TableHead className="text-muted-foreground">สินค้า</TableHead>
                <TableHead className="text-muted-foreground">เครื่อง</TableHead>
                <TableHead className="text-muted-foreground">สถานะ</TableHead>
                <TableHead className="text-right text-muted-foreground">จำนวน</TableHead>
                <TableHead className="text-right text-muted-foreground">ของเสีย</TableHead>
                <TableHead className="text-muted-foreground">เวลา</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const config = statusConfig[order.status]
                const StatusIcon = config.icon
                const isExpanded = expandedRow === order.id

                return (
                  <>
                    <TableRow
                      key={order.id}
                      className="cursor-pointer border-borde text-black hover:bg-muted/50"
                      onClick={() => setExpandedRow(isExpanded ? null : order.id)}
                    >
                      <TableCell className="w-10">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-foreground">{order.id}</TableCell>
                      <TableCell className="text-foreground">{order.product}</TableCell>
                      <TableCell>
                        <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                          {order.machine}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={config.class}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {order.quantity.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={order.defects > 5 ? "text-danger" : "text-muted-foreground"}>
                          {order.defects}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.startTime} - {order.endTime}
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${order.id}-expanded`} className="border-borde text-black bg-muted/30">
                        <TableCell colSpan={8} className="p-4">
                          <div className="grid gap-4 lg:grid-cols-2">
                            {/* Event Log */}
                            <div>
                              <h4 className="mb-3 text-sm font-medium text-foreground">บันทึกเหตุการณ์</h4>
                              <div className="space-y-2">
                                {order.subLogs?.map((log, index) => (
                                  <div
                                    key={index}
                                    className={`flex items-center gap-3 rounded-lg p-2 ${
                                      log.type === "error"
                                        ? "bg-danger/10"
                                        : log.type === "warning"
                                        ? "bg-warning/10"
                                        : "bg-muted/50"
                                    }`}
                                  >
                                    <span className="font-mono text-xs text-muted-foreground">{log.time}</span>
                                    <span
                                      className={`text-sm ${
                                        log.type === "error"
                                          ? "text-danger"
                                          : log.type === "warning"
                                          ? "text-warning"
                                          : "text-foreground"
                                      }`}
                                    >
                                      {log.event}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Temperature Chart */}
                            {order.temperatureData && (
                              <div>
                                <h4 className="mb-3 text-sm font-medium text-foreground">กราฟอุณหภูมิ</h4>
                                <div className="h-[150px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={order.temperatureData}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                      <XAxis
                                        dataKey="time"
                                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                                        axisLine={{ stroke: "hsl(var(--border))" }}
                                      />
                                      <YAxis
                                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                                        axisLine={{ stroke: "hsl(var(--border))" }}
                                        domain={[70, 110]}
                                      />
                                      <Tooltip
                                        contentStyle={{
                                          backgroundColor: "hsl(var(--card))",
                                          border: "1px solid hsl(var(--border))",
                                          borderRadius: "8px",
                                          color: "hsl(var(--foreground))",
                                        }}
                                      />
                                      <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="hsl(var(--danger))"
                                        strokeWidth={2}
                                        dot={{ fill: "hsl(var(--danger))" }}
                                        name="อุณหภูมิ (°C)"
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Machine Downtime Timeline (Gantt Chart) */}
      <Card className="border-borde text-black">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Downtime Timeline (24 ชั่วโมงที่ผ่านมา)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-success" />
              <span className="text-muted-foreground">ทำงาน</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-danger" />
              <span className="text-muted-foreground">ขัดข้อง</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-warning" />
              <span className="text-muted-foreground">สแตนด์บาย</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-muted-foreground" />
              <span className="text-muted-foreground">ซ่อมบำรุง</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            {/* Time axis */}
            <div className="flex items-center">
              <div className="w-32 shrink-0" />
              <div className="flex flex-1 justify-between text-xs text-muted-foreground">
                {[0, 4, 8, 12, 16, 20, 24].map((hour) => (
                  <span key={hour}>{hour.toString().padStart(2, "0")}:00</span>
                ))}
              </div>
            </div>
            {/* Machine rows */}
            {machineTimeline.map((machine) => (
              <div key={machine.id} className="flex items-center gap-3">
                <div className="w-32 shrink-0">
                  <span className="font-mono text-xs text-muted-foreground">{machine.id}</span>
                  <p className="truncate text-sm text-foreground">{machine.name}</p>
                </div>
                <div className="relative flex h-6 flex-1 overflow-hidden rounded bg-muted/30">
                  {machine.segments.map((segment, index) => {
                    const width = ((segment.end - segment.start) / 24) * 100
                    const left = (segment.start / 24) * 100
                    return (
                      <div
                        key={index}
                        className={`absolute top-0 h-full ${segmentColors[segment.status as keyof typeof segmentColors]}`}
                        style={{ left: `${left}%`, width: `${width}%` }}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
