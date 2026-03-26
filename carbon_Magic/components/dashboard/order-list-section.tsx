"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type OrderStatus = "running" | "completed" | "delayed" | "pending"

interface Order {
  id: string
  productName: string
  quantity: number
  progress: number
  status: OrderStatus
  dueDate: string
  machine: string
}

const orders: Order[] = [
  {
    id: "PO-2024-001",
    productName: "Carbon Filter Type A",
    quantity: 5000,
    progress: 78,
    status: "running",
    dueDate: "26/03/2026",
    machine: "เครื่องอัด P1",
  },
  {
    id: "PO-2024-002",
    productName: "Carbon Block B200",
    quantity: 3000,
    progress: 100,
    status: "completed",
    dueDate: "25/03/2026",
    machine: "เครื่องอัด P2",
  },
  {
    id: "PO-2024-003",
    productName: "Activated Carbon X",
    quantity: 2500,
    progress: 45,
    status: "delayed",
    dueDate: "24/03/2026",
    machine: "เครื่องผสม M1",
  },
  {
    id: "PO-2024-004",
    productName: "Filter Media C100",
    quantity: 8000,
    progress: 0,
    status: "pending",
    dueDate: "28/03/2026",
    machine: "เครื่องอัด P3",
  },
  {
    id: "PO-2024-005",
    productName: "Carbon Cartridge Pro",
    quantity: 1500,
    progress: 92,
    status: "running",
    dueDate: "26/03/2026",
    machine: "เครื่องประกอบ A1",
  },
]

function StatusBadge({ status }: { status: OrderStatus }) {
  const statusConfig = {
    running: { label: "กำลังผลิต", className: "bg-success text-success-foreground" },
    completed: { label: "เสร็จสิ้น", className: "bg-primary text-primary-foreground" },
    delayed: { label: "ล่าช้า", className: "bg-danger text-danger-foreground" },
    pending: { label: "รอดำเนินการ", className: "bg-muted text-muted-foreground" },
  }

  const config = statusConfig[status]

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  )
}

function OrderProgress({ value, status }: { value: number; status: OrderStatus }) {
  const progressColor = {
    running: "bg-success",
    completed: "bg-primary",
    delayed: "bg-danger",
    pending: "bg-muted",
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-2 w-24 overflow-hidden rounded-full bg-muted/50">
        <div
          className={`h-full transition-all duration-500 ${progressColor[status]}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  )
}

export function OrderListSection() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          ใบสั่งผลิตที่กำลังดำเนินการ
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">เลขที่ใบสั่ง</TableHead>
              <TableHead className="text-xs">ชื่อสินค้า</TableHead>
              <TableHead className="text-xs text-right">จำนวน</TableHead>
              <TableHead className="text-xs">ความคืบหน้า</TableHead>
              <TableHead className="text-xs">สถานะ</TableHead>
              <TableHead className="text-xs">กำหนดส่ง</TableHead>
              <TableHead className="text-xs">เครื่องจักร</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id} 
                className="cursor-pointer transition-colors hover:bg-muted/50"
              >
                <TableCell className="font-mono text-xs font-medium text-foreground">
                  {order.id}
                </TableCell>
                <TableCell className="text-sm text-foreground">{order.productName}</TableCell>
                <TableCell className="text-right text-sm text-foreground">
                  {order.quantity.toLocaleString()}
                </TableCell>
                <TableCell>
                  <OrderProgress value={order.progress} status={order.status} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{order.dueDate}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{order.machine}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
