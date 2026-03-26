"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Play, 
  ShoppingCart,
  ArrowLeft,
  Loader2
} from "lucide-react"

interface ProductionOrder {
  id: string
  productName: string
  quantity: number
  dueDate: string
  priority: "high" | "medium" | "low"
  customer: string
}

interface BOMItem {
  id: string
  materialName: string
  required: number
  unit: string
  inStock: number
  shortage: number
}

const productionOrders: ProductionOrder[] = [
  {
    id: "PO-2024-010",
    productName: "Carbon Filter Type A",
    quantity: 5000,
    dueDate: "28/03/2026",
    priority: "high",
    customer: "ABC Corporation",
  },
  {
    id: "PO-2024-011",
    productName: "Carbon Block B200",
    quantity: 3000,
    dueDate: "30/03/2026",
    priority: "medium",
    customer: "XYZ Industries",
  },
  {
    id: "PO-2024-012",
    productName: "Activated Carbon X",
    quantity: 2500,
    dueDate: "01/04/2026",
    priority: "low",
    customer: "Delta Corp",
  },
  {
    id: "PO-2024-013",
    productName: "Filter Media C100",
    quantity: 8000,
    dueDate: "02/04/2026",
    priority: "high",
    customer: "Tech Solutions",
  },
]

// Mock BOM data for different orders
const bomData: Record<string, BOMItem[]> = {
  "PO-2024-010": [
    { id: "1", materialName: "Activated Carbon Powder", required: 250, unit: "kg", inStock: 300, shortage: 0 },
    { id: "2", materialName: "Binding Resin", required: 50, unit: "kg", inStock: 45, shortage: 5 },
    { id: "3", materialName: "Filter Mesh 100", required: 5000, unit: "pcs", inStock: 6000, shortage: 0 },
    { id: "4", materialName: "End Caps Type A", required: 10000, unit: "pcs", inStock: 12000, shortage: 0 },
    { id: "5", materialName: "O-Ring Seal", required: 5000, unit: "pcs", inStock: 4500, shortage: 500 },
  ],
  "PO-2024-011": [
    { id: "1", materialName: "Carbon Block Raw", required: 150, unit: "kg", inStock: 200, shortage: 0 },
    { id: "2", materialName: "Compression Mold B", required: 30, unit: "sets", inStock: 35, shortage: 0 },
    { id: "3", materialName: "Heat Shrink Wrap", required: 3000, unit: "m", inStock: 4000, shortage: 0 },
  ],
  "PO-2024-012": [
    { id: "1", materialName: "Raw Activated Carbon", required: 500, unit: "kg", inStock: 480, shortage: 20 },
    { id: "2", materialName: "Chemical Activator", required: 25, unit: "L", inStock: 30, shortage: 0 },
    { id: "3", materialName: "Packaging Bags 25kg", required: 100, unit: "pcs", inStock: 100, shortage: 0 },
  ],
  "PO-2024-013": [
    { id: "1", materialName: "Filter Media Granules", required: 800, unit: "kg", inStock: 900, shortage: 0 },
    { id: "2", materialName: "Container C100", required: 8000, unit: "pcs", inStock: 8500, shortage: 0 },
    { id: "3", materialName: "Label Sticker", required: 8000, unit: "pcs", inStock: 10000, shortage: 0 },
  ],
}

function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const config = {
    high: { label: "เร่งด่วน", className: "bg-danger text-danger-foreground" },
    medium: { label: "ปกติ", className: "bg-warning text-warning-foreground" },
    low: { label: "ไม่เร่ง", className: "bg-muted text-muted-foreground" },
  }
  return <Badge className={config[priority].className}>{config[priority].label}</Badge>
}

export default function PreProductionPage() {
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)

  const currentBOM = selectedOrder ? bomData[selectedOrder.id] || [] : []
  const hasShortage = currentBOM.some((item) => item.shortage > 0)
  const shortageItems = currentBOM.filter((item) => item.shortage > 0)

  const handleSelectOrder = (order: ProductionOrder) => {
    setIsLoading(true)
    // Simulate API call to check stock
    setTimeout(() => {
      setSelectedOrder(order)
      setIsLoading(false)
    }, 800)
  }

  const handleStartProduction = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmStart = () => {
    // In real app, this would trigger production start
    setShowConfirmDialog(false)
    setSelectedOrder(null)
  }

  const handleNotifyPurchase = () => {
    setShowPurchaseDialog(true)
  }

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">เตรียมการผลิตและตรวจสอบวัตถุดิบ</h1>
        <p className="text-sm text-muted-foreground">
          ตรวจสอบความพร้อมของวัตถุดิบก่อนเริ่มการผลิต
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel - Production Orders List */}
        <Card className="border-border text-black" >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-5 w-5 text-primary" />
              ใบสั่งผลิตที่รอเริ่มงาน
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">เลขที่ PO</TableHead>
                  <TableHead className="text-xs">สินค้า</TableHead>
                  <TableHead className="text-xs text-right">จำนวน</TableHead>
                  <TableHead className="text-xs">กำหนดส่ง</TableHead>
                  <TableHead className="text-xs">ความสำคัญ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedOrder?.id === order.id ? "bg-muted/70" : ""
                    }`}
                    onClick={() => handleSelectOrder(order)}
                  >
                    <TableCell className="font-mono text-xs font-medium text-primary ">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-sm">{order.productName}</TableCell>
                    <TableCell className="text-right text-sm">
                      {order.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.dueDate}
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={order.priority} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Panel - BOM Check */}
        <Card className="border-border text-black">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {selectedOrder ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setSelectedOrder(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span>BOM: {selectedOrder.id}</span>
                  </div>
                ) : (
                  "ตาราง BOM (Bill of Materials)"
                )}
              </CardTitle>
              {selectedOrder && (
                <div className="flex items-center gap-2">
                  {hasShortage ? (
                    <Badge className="bg-danger text-danger-foreground">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      วัตถุดิบไม่เพียงพอ
                    </Badge>
                  ) : (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      พร้อมผลิต
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">กำลังตรวจสอบสต็อก...</span>
              </div>
            ) : selectedOrder ? (
              <div className="space-y-4">
                {/* Order Info */}
                <div className="rounded-lg bg-muted/30 p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">สินค้า:</span>{" "}
                      <span className="font-medium">{selectedOrder.productName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ลูกค้า:</span>{" "}
                      <span className="font-medium">{selectedOrder.customer}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">จำนวน:</span>{" "}
                      <span className="font-medium">{selectedOrder.quantity.toLocaleString()} ชิ้น</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">กำหนดส่ง:</span>{" "}
                      <span className="font-medium">{selectedOrder.dueDate}</span>
                    </div>
                  </div>
                </div>

                {/* BOM Table */}
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">วัตถุดิบ</TableHead>
                      <TableHead className="text-xs text-right">ต้องการ</TableHead>
                      <TableHead className="text-xs text-right">ในสต็อก</TableHead>
                      <TableHead className="text-xs text-right">ขาด</TableHead>
                      <TableHead className="text-xs">สถานะ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBOM.map((item) => (
                      <TableRow
                        key={item.id}
                        className={item.shortage > 0 ? "bg-danger/10" : ""}
                      >
                        <TableCell className="text-sm font-medium">
                          {item.materialName}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {item.required.toLocaleString()} {item.unit}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {item.inStock.toLocaleString()} {item.unit}
                        </TableCell>
                        <TableCell
                          className={`text-right text-sm font-bold ${
                            item.shortage > 0 ? "text-danger" : "text-muted-foreground"
                          }`}
                        >
                          {item.shortage > 0 ? `-${item.shortage.toLocaleString()} ${item.unit}` : "-"}
                        </TableCell>
                        <TableCell>
                          {item.shortage > 0 ? (
                            <AlertTriangle className="h-4 w-4 text-danger" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {hasShortage ? (
                    <Button
                      className="flex-1 bg-warning text-warning-foreground hover:bg-warning/90"
                      onClick={handleNotifyPurchase}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      แจ้งเตือนจัดซื้อ
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                      onClick={handleStartProduction}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      เริ่มการผลิต
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
                <Package className="mb-3 h-12 w-12 opacity-50" />
                <p className="text-center">เลือกใบสั่งผลิตจากรายการทางซ้าย</p>
                <p className="text-center text-sm">เพื่อตรวจสอบวัตถุดิบ</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Start Production Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              ยืนยันการเริ่มผลิต
            </DialogTitle>
            <DialogDescription>
              คุณต้องการเริ่มการผลิตสำหรับ {selectedOrder?.id} - {selectedOrder?.productName} หรือไม่?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted/30 p-4">
            <p className="text-sm">
              <span className="text-muted-foreground">จำนวน:</span>{" "}
              <span className="font-medium">{selectedOrder?.quantity.toLocaleString()} ชิ้น</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">กำหนดส่ง:</span>{" "}
              <span className="font-medium">{selectedOrder?.dueDate}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              ยกเลิก
            </Button>
            <Button className="bg-success text-success-foreground hover:bg-success/90" onClick={handleConfirmStart}>
              <Play className="mr-2 h-4 w-4" />
              ยืนยันเริ่มผลิต
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notify Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-warning" />
              แจ้งเตือนฝ่ายจัดซื้อ
            </DialogTitle>
            <DialogDescription>
              ระบบจะส่งการแจ้งเตือนไปยังฝ่ายจัดซื้อเพื่อจัดหาวัตถุดิบที่ขาด
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">รายการที่ต้องจัดซื้อ:</p>
            {shortageItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-danger/10 px-3 py-2">
                <span className="text-sm">{item.materialName}</span>
                <span className="font-mono text-sm font-bold text-danger">
                  {item.shortage.toLocaleString()} {item.unit}
                </span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
              ยกเลิก
            </Button>
            <Button 
              className="bg-warning text-warning-foreground hover:bg-warning/90"
              onClick={() => {
                setShowPurchaseDialog(false)
                // In real app, send notification
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              ส่งการแจ้งเตือน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
