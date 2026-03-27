"use client"

import { useMemo, useState } from "react"
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
  Factory,
  Loader2,
  Package,
  Play,
  ShoppingCart,
} from "lucide-react"

type Priority = "high" | "medium" | "low"

interface BOMFormulaItem {
  materialCode: string
  materialName: string
  unit: string
  perUnit: number
}

interface ProductionOrder {
  id: string
  productName: string
  quantity: number
  dueDate: string
  priority: Priority
  customer: string
  bomFormula: BOMFormulaItem[]
}

interface InventoryItem {
  materialCode: string
  onHand: number
}

interface MaterialCheckRow {
  materialCode: string
  materialName: string
  unit: string
  perUnit: number
  required: number
  onHand: number
  shortage: number
}

const productionOrders: ProductionOrder[] = [
  {
    id: "PO-2026-110",
    productName: "Carbon Filter Type A",
    quantity: 5000,
    dueDate: "2026-03-29 16:00",
    priority: "high",
    customer: "ABC Corporation",
    bomFormula: [
      { materialCode: "MAT-CARBON-P", materialName: "Activated Carbon Powder", unit: "kg", perUnit: 0.5 },
      { materialCode: "MAT-RESIN-01", materialName: "Binding Resin", unit: "kg", perUnit: 0.08 },
      { materialCode: "MAT-MESH-100", materialName: "Filter Mesh 100", unit: "pcs", perUnit: 1 },
    ],
  },
  {
    id: "PO-2026-111",
    productName: "Carbon Block B200",
    quantity: 3000,
    dueDate: "2026-03-30 14:00",
    priority: "medium",
    customer: "XYZ Industries",
    bomFormula: [
      { materialCode: "MAT-BLOCK-RAW", materialName: "Carbon Block Raw", unit: "kg", perUnit: 0.4 },
      { materialCode: "MAT-BINDER-02", materialName: "Block Binder", unit: "kg", perUnit: 0.12 },
      { materialCode: "MAT-SHRINK-W", materialName: "Heat Shrink Wrap", unit: "m", perUnit: 1.2 },
    ],
  },
  {
    id: "PO-2026-112",
    productName: "Activated Carbon X",
    quantity: 2500,
    dueDate: "2026-03-31 20:00",
    priority: "high",
    customer: "Delta Corp",
    bomFormula: [
      { materialCode: "MAT-ACT-CARB", materialName: "Raw Activated Carbon", unit: "kg", perUnit: 0.65 },
      { materialCode: "MAT-ACT-CHEM", materialName: "Chemical Activator", unit: "L", perUnit: 0.02 },
      { materialCode: "MAT-BAG-25", materialName: "Packaging Bags 25kg", unit: "pcs", perUnit: 0.04 },
    ],
  },
]

// Simulate inventory query from Oracle.
const inventoryOnHand: InventoryItem[] = [
  { materialCode: "MAT-CARBON-P", onHand: 2300 },
  { materialCode: "MAT-RESIN-01", onHand: 450 },
  { materialCode: "MAT-MESH-100", onHand: 10000 },
  { materialCode: "MAT-BLOCK-RAW", onHand: 1500 },
  { materialCode: "MAT-BINDER-02", onHand: 500 },
  { materialCode: "MAT-SHRINK-W", onHand: 5000 },
  { materialCode: "MAT-ACT-CARB", onHand: 1450 },
  { materialCode: "MAT-ACT-CHEM", onHand: 70 },
  { materialCode: "MAT-BAG-25", onHand: 80 },
]

function PriorityBadge({ priority }: { priority: Priority }) {
  const config = {
    high: { label: "เร่งด่วน", className: "bg-danger text-danger-foreground" },
    medium: { label: "ปกติ", className: "bg-warning text-warning-foreground" },
    low: { label: "ไม่เร่ง", className: "bg-muted text-muted-foreground" },
  }
  return <Badge className={config[priority].className}>{config[priority].label}</Badge>
}

function getInventory(materialCode: string) {
  return inventoryOnHand.find((item) => item.materialCode === materialCode)?.onHand ?? 0
}

export default function PreProductionPage() {
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showStartDialog, setShowStartDialog] = useState(false)
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [showPurchaseSentDialog, setShowPurchaseSentDialog] = useState(false)

  const materialRows: MaterialCheckRow[] = useMemo(() => {
    if (!selectedOrder) return []

    return selectedOrder.bomFormula.map((formula) => {
      const required = formula.perUnit * selectedOrder.quantity
      const onHand = getInventory(formula.materialCode)
      return {
        materialCode: formula.materialCode,
        materialName: formula.materialName,
        unit: formula.unit,
        perUnit: formula.perUnit,
        required,
        onHand,
        shortage: Math.max(0, required - onHand),
      }
    })
  }, [selectedOrder])

  const totalShortage = materialRows.reduce((sum, row) => sum + row.shortage, 0)
  const hasShortage = totalShortage > 0
  const shortageRows = materialRows.filter((row) => row.shortage > 0)

  const handleSelectOrder = (order: ProductionOrder) => {
    setIsLoading(true)
    setTimeout(() => {
      setSelectedOrder(order)
      setIsLoading(false)
    }, 700)
  }

  const handleConfirmStart = () => {
    setShowStartDialog(false)
    setSelectedOrder(null)
  }

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Smart BOM Predictor</h1>
        <p className="text-sm text-muted-foreground">
          ประเมินวัตถุดิบก่อนสั่งการผลิต ป้องกันงานหยุดกลางทางจากของขาด
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border text-black">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-5 w-5 text-primary" />
              รายการใบสั่งผลิต (PO) ที่รอคิว
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">PO</TableHead>
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
                    <TableCell className="font-mono text-xs font-medium text-primary">{order.id}</TableCell>
                    <TableCell className="text-sm">{order.productName}</TableCell>
                    <TableCell className="text-right text-sm">{order.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.dueDate}</TableCell>
                    <TableCell>
                      <PriorityBadge priority={order.priority} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border text-black">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">ตารางคำนวณสูตร BOM เทียบสต็อกคงเหลือ</CardTitle>
              {selectedOrder && (
                <Badge className={hasShortage ? "bg-danger text-danger-foreground" : "bg-success text-success-foreground"}>
                  {hasShortage ? "🔴 วัตถุดิบไม่พอ" : "🟢 พร้อมผลิต"}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-72 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">กำลังคูณสูตร BOM และเช็ค Inventory...</span>
              </div>
            ) : !selectedOrder ? (
              <div className="flex h-72 flex-col items-center justify-center text-muted-foreground">
                <Factory className="mb-3 h-12 w-12 opacity-50" />
                <p className="text-center">เลือก PO จากฝั่งซ้ายเพื่อเริ่มการประเมิน</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted/30 p-3 text-sm">
                  <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                    <p>
                      <span className="text-muted-foreground">PO:</span> <span className="font-medium">{selectedOrder.id}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">สินค้า:</span> <span className="font-medium">{selectedOrder.productName}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">จำนวนผลิต:</span>{" "}
                      <span className="font-medium">{selectedOrder.quantity.toLocaleString()} ชิ้น</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">ลูกค้า:</span> <span className="font-medium">{selectedOrder.customer}</span>
                    </p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">วัตถุดิบ</TableHead>
                      <TableHead className="text-xs text-right">สูตร/ชิ้น</TableHead>
                      <TableHead className="text-xs text-right">ต้องใช้รวม</TableHead>
                      <TableHead className="text-xs text-right">คงเหลือ</TableHead>
                      <TableHead className="text-xs text-right">ขาด</TableHead>
                      <TableHead className="text-xs">สถานะ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materialRows.map((row) => (
                      <TableRow key={row.materialCode} className={row.shortage > 0 ? "bg-danger/10" : ""}>
                        <TableCell>
                          <p className="text-sm font-medium">{row.materialName}</p>
                          <p className="text-xs text-muted-foreground">{row.materialCode}</p>
                        </TableCell>
                        <TableCell className="text-right text-sm">{row.perUnit.toLocaleString()} {row.unit}</TableCell>
                        <TableCell className="text-right text-sm">{row.required.toLocaleString()} {row.unit}</TableCell>
                        <TableCell className="text-right text-sm">{row.onHand.toLocaleString()} {row.unit}</TableCell>
                        <TableCell className={`text-right text-sm font-semibold ${row.shortage > 0 ? "text-danger" : "text-success"}`}>
                          {row.shortage > 0 ? `${row.shortage.toLocaleString()} ${row.unit}` : "0"}
                        </TableCell>
                        <TableCell>
                          {row.shortage > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs text-danger">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              🔴 ขาด
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-success">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              🟢 พอ
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  {hasShortage ? (
                    <p className="text-sm text-danger">
                      วัตถุดิบไม่พอรวม {totalShortage.toLocaleString()} หน่วยตามหน่วยวัสดุ ระบบล็อกปุ่มสั่งเริ่มผลิตอัตโนมัติ
                    </p>
                  ) : (
                    <p className="text-sm text-success">วัตถุดิบครบ ระบบอนุญาตให้สั่งเริ่มผลิตได้</p>
                  )}
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                    disabled={hasShortage}
                    onClick={() => setShowStartDialog(true)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    สั่งเริ่มผลิต
                  </Button>

                  {hasShortage && (
                    <Button
                      className="flex-1 bg-warning text-warning-foreground hover:bg-warning/90"
                      onClick={() => setShowPurchaseDialog(true)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      สร้างใบขอซื้อด่วน
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              ยืนยันเริ่มการผลิต
            </DialogTitle>
            <DialogDescription>
              ยืนยันสั่งเริ่มผลิตสำหรับ {selectedOrder?.id} และส่งคำสั่งเข้าไลน์การผลิต
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartDialog(false)}>
              ยกเลิก
            </Button>
            <Button className="bg-success text-success-foreground hover:bg-success/90" onClick={handleConfirmStart}>
              ยืนยันสั่งผลิต
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-warning" />
              สร้างใบขอซื้อด่วน
            </DialogTitle>
            <DialogDescription>
              รายการขาดจะถูกส่งแจ้งเตือนไปยังฝ่ายจัดซื้อทันที
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {shortageRows.map((row) => (
              <div key={row.materialCode} className="flex items-center justify-between rounded-lg bg-danger/10 px-3 py-2">
                <span className="text-sm">{row.materialName}</span>
                <span className="font-mono text-sm font-semibold text-danger">
                  ขาด {row.shortage.toLocaleString()} {row.unit}
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
                setShowPurchaseSentDialog(true)
              }}
            >
              ส่งใบขอซื้อด่วน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPurchaseSentDialog} onOpenChange={setShowPurchaseSentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ส่งคำขอสำเร็จ</DialogTitle>
            <DialogDescription>
              ระบบส่งแจ้งเตือนไปฝ่ายจัดซื้อแล้ว พร้อมแนบรายละเอียดวัตถุดิบขาดสำหรับ {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowPurchaseSentDialog(false)}>ปิด</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
