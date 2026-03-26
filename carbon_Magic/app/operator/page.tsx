"use client"

import { useState, useCallback, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Play,
  Square,
  Plus,
  Minus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Timer,
} from "lucide-react"

interface ProductionSession {
  orderId: string
  productName: string
  targetQuantity: number
  goodCount: number
  defectCount: number
  startTime: string | null
  endTime: string | null
  status: "idle" | "running" | "paused" | "completed"
}

interface DefectLog {
  id: string
  count: number
  reason: string
  timestamp: string
}

const defectReasons = [
  { value: "scratch", label: "รอยขีดข่วน" },
  { value: "temperature", label: "อุณหภูมิไม่ได้" },
  { value: "dimension", label: "ขนาดผิดพลาด" },
  { value: "crack", label: "แตกร้าว" },
  { value: "contamination", label: "มีสิ่งปนเปื้อน" },
  { value: "color", label: "สีไม่ตรง" },
  { value: "other", label: "อื่นๆ" },
]

const availableOrders = [
  { id: "PO-2024-010", productName: "Carbon Filter Type A", target: 5000 },
  { id: "PO-2024-011", productName: "Carbon Block B200", target: 3000 },
  { id: "PO-2024-012", productName: "Activated Carbon X", target: 2500 },
]

export default function OperatorPage() {
  const [session, setSession] = useState<ProductionSession>({
    orderId: "",
    productName: "",
    targetQuantity: 0,
    goodCount: 0,
    defectCount: 0,
    startTime: null,
    endTime: null,
    status: "idle",
  })
  
  const [defectLogs, setDefectLogs] = useState<DefectLog[]>([])
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [showDefectDialog, setShowDefectDialog] = useState(false)
  const [pendingDefectCount, setPendingDefectCount] = useState(1)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (session.status === "running" && session.startTime) {
      interval = setInterval(() => {
        const start = new Date(session.startTime!).getTime()
        const now = Date.now()
        setElapsedTime(Math.floor((now - start) / 1000))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [session.status, session.startTime])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const handleSelectOrder = (orderId: string) => {
    const order = availableOrders.find((o) => o.id === orderId)
    if (order) {
      setSession((prev) => ({
        ...prev,
        orderId: order.id,
        productName: order.productName,
        targetQuantity: order.target,
      }))
    }
  }

  const handleStart = () => {
    const now = new Date()
    setSession((prev) => ({
      ...prev,
      startTime: now.toISOString(),
      status: "running",
    }))
  }

  const handleAddGood = useCallback((amount: number) => {
    if (session.status !== "running") return
    setSession((prev) => ({
      ...prev,
      goodCount: prev.goodCount + amount,
    }))
  }, [session.status])

  const handleAddDefect = () => {
    setShowDefectDialog(true)
    setPendingDefectCount(1)
    setSelectedReason("")
  }

  const confirmDefect = () => {
    if (!selectedReason) return
    
    const log: DefectLog = {
      id: Date.now().toString(),
      count: pendingDefectCount,
      reason: defectReasons.find((r) => r.value === selectedReason)?.label || selectedReason,
      timestamp: formatTimestamp(new Date()),
    }
    
    setDefectLogs((prev) => [...prev, log])
    setSession((prev) => ({
      ...prev,
      defectCount: prev.defectCount + pendingDefectCount,
    }))
    setShowDefectDialog(false)
  }

  const handleEnd = () => {
    setShowEndDialog(true)
  }

  const confirmEnd = () => {
    const now = new Date()
    setSession((prev) => ({
      ...prev,
      endTime: now.toISOString(),
      status: "completed",
    }))
    setShowEndDialog(false)
  }

  const progress = session.targetQuantity > 0 
    ? Math.round(((session.goodCount + session.defectCount) / session.targetQuantity) * 100)
    : 0

  const defectRate = (session.goodCount + session.defectCount) > 0
    ? ((session.defectCount / (session.goodCount + session.defectCount)) * 100).toFixed(1)
    : "0.0"

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">บันทึกผลผลิตหน้าเครื่อง</h1>
        <p className="text-sm text-muted-foreground">
          ระบบบันทึกผลการผลิตแบบ Real-time สำหรับพนักงานหน้าเครื่องจักร
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 ">
        {/* Main Production Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Selection & Status */}
          <Card className="border-border text-black">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">ใบสั่งผลิตที่กำลังทำงาน</CardTitle>
                <Badge 
                  className={
                    session.status === "running" 
                      ? "bg-success text-success-foreground" 
                      : session.status === "completed"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {session.status === "idle" && "รอเริ่มงาน"}
                  {session.status === "running" && "กำลังทำงาน"}
                  {session.status === "completed" && "เสร็จสิ้น"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Select
                  value={session.orderId}
                  onValueChange={handleSelectOrder}
                  disabled={session.status !== "idle"}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="เลือกใบสั่งผลิต" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOrders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.id} - {order.productName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {session.status === "idle" && session.orderId && (
                  <Button
                    size="lg"
                    className="bg-success text-success-foreground hover:bg-success/90 px-8"
                    onClick={handleStart}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start
                  </Button>
                )}
              </div>

              {session.orderId && (
                <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg bg-muted/30 p-4 ">
                  <div>
                    <p className="text-xs  text-muted-foreground">สินค้า</p>
                    <p className="font-medium">{session.productName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">เป้าหมาย</p>
                    <p className="font-medium">{session.targetQuantity.toLocaleString()} ชิ้น</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">เวลาเริ่มต้น</p>
                    <p className="font-medium font-mono">
                      {session.startTime 
                        ? new Date(session.startTime).toLocaleTimeString("th-TH")
                        : "-"
                      }
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Production Counter - Excel-like Grid */}
          <Card className="border-border text-black">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">บันทึกผลงาน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-border">
                {/* Header Row */}
                <div className="grid grid-cols-4 bg-muted/50">
                  <div className="border-b border-r border-border p-3 text-center text-sm font-medium">
                    รายการ
                  </div>
                  <div className="border-b border-r border-border p-3 text-center text-sm font-medium">
                    จำนวน
                  </div>
                  <div className="border-b border-r border-border p-3 text-center text-sm font-medium">
                    เพิ่ม
                  </div>
                  <div className="border-b border-border p-3 text-center text-sm font-medium">
                    ลด
                  </div>
                </div>

                {/* Good Items Row */}
                <div className="grid grid-cols-4">
                  <div className="flex items-center gap-2 border-b border-r border-border bg-success/10 p-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="font-medium">งานดี</span>
                  </div>
                  <div className="flex items-center justify-center border-b border-r border-border p-3">
                    <span className="font-mono text-2xl font-bold text-success">
                      {session.goodCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 border-b border-r border-border p-3">
                    <Button
                      size="lg"
                      className="h-14 w-20 bg-success text-success-foreground text-lg font-bold hover:bg-success/90"
                      onClick={() => handleAddGood(1)}
                      disabled={session.status !== "running"}
                    >
                      <Plus className="mr-1 h-5 w-5" />1
                    </Button>
                    <Button
                      size="lg"
                      className="h-14 w-20 bg-success text-success-foreground text-lg font-bold hover:bg-success/90"
                      onClick={() => handleAddGood(10)}
                      disabled={session.status !== "running"}
                    >
                      <Plus className="mr-1 h-5 w-5" />10
                    </Button>
                  </div>
                  <div className="flex items-center justify-center border-b border-border p-3">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 w-20"
                      onClick={() => setSession((prev) => ({ ...prev, goodCount: Math.max(0, prev.goodCount - 1) }))}
                      disabled={session.status !== "running" || session.goodCount === 0}
                    >
                      <Minus className="mr-1 h-5 w-5" />1
                    </Button>
                  </div>
                </div>

                {/* Defect Items Row */}
                <div className="grid grid-cols-4">
                  <div className="flex items-center gap-2 border-r border-border bg-danger/10 p-3">
                    <XCircle className="h-5 w-5 text-danger" />
                    <span className="font-medium">ของเสีย</span>
                  </div>
                  <div className="flex items-center justify-center border-r border-border p-3">
                    <span className="font-mono text-2xl font-bold text-danger">
                      {session.defectCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 border-r border-border p-3">
                    <Button
                      size="lg"
                      className="h-14 w-28 bg-danger text-danger-foreground text-lg font-bold hover:bg-danger/90"
                      onClick={handleAddDefect}
                      disabled={session.status !== "running"}
                    >
                      <Plus className="mr-1 h-5 w-5" />ของเสีย
                    </Button>
                  </div>
                  <div className="flex items-center justify-center p-3">
                    <span className="text-sm text-muted-foreground">
                      อัตรา: {defectRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ความคืบหน้า</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>{(session.goodCount + session.defectCount).toLocaleString()} ชิ้น</span>
                  <span>เป้า {session.targetQuantity.toLocaleString()} ชิ้น</span>
                </div>
              </div>

              {/* End Session Button */}
              {session.status === "running" && (
                <Button
                  size="lg"
                  className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleEnd}
                >
                  <Square className="mr-2 h-5 w-5" />
                  จบการทำงาน
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Timer & Logs */}
        <div className="space-y-4">
          {/* Timer Card */}
          <Card className="border-border text-black">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Timer className="h-5 w-5 text-primary" />
                เวลาทำงาน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="font-mono text-4xl font-bold text-foreground">
                  {formatTime(elapsedTime)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground ">
                  {session.status === "running" ? "กำลังนับเวลา..." : "หยุดนับเวลา"}
                </p>
              </div>

              {session.endTime && (
                <div className="mt-4 rounded-lg bg-muted/30 p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">เวลาเริ่ม</p>
                      <p className="font-mono font-medium">
                        {session.startTime && new Date(session.startTime).toLocaleTimeString("th-TH")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">เวลาจบ</p>
                      <p className="font-mono font-medium">
                        {new Date(session.endTime).toLocaleTimeString("th-TH")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Defect Logs */}
          <Card className="border-border text-black">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-danger" />
                บันทึกของเสีย
              </CardTitle>
            </CardHeader>
            <CardContent>
              {defectLogs.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <XCircle className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p className="text-sm">ยังไม่มีบันทึกของเสีย</p>
                </div>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {defectLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between rounded-lg bg-danger/10 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{log.reason}</p>
                        <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                      </div>
                      <Badge className="bg-danger text-danger-foreground">
                        {log.count} ชิ้น
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Card */}
          {session.status === "completed" && (
            <Card className="border-success bg-success/10 text-black">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  สรุปผลการทำงาน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">งานดี:</span>
                    <span className="font-bold text-success">{session.goodCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ของเสีย:</span>
                    <span className="font-bold text-danger">{session.defectCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">อัตราของเสีย:</span>
                    <span className="font-bold">{defectRate}%</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <p className="text-xs text-muted-foreground">
                      ข้อมูลถูกส่งไปยังหน้าตรวจสอบและอนุมัติแล้ว
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Defect Reason Dialog */}
      <Dialog open={showDefectDialog} onOpenChange={setShowDefectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-danger" />
              บันทึกของเสีย
            </DialogTitle>
            <DialogDescription>
              กรุณาระบุจำนวนและสาเหตุของเสีย
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">จำนวนของเสีย</label>
              <div className="mt-2 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPendingDefectCount(Math.max(1, pendingDefectCount - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-16 text-center font-mono text-2xl font-bold">
                  {pendingDefectCount}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPendingDefectCount(pendingDefectCount + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">สาเหตุของเสีย *</label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="เลือกสาเหตุ" />
                </SelectTrigger>
                <SelectContent>
                  {defectReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDefectDialog(false)}>
              ยกเลิก
            </Button>
            <Button
              className="bg-danger text-danger-foreground hover:bg-danger/90"
              onClick={confirmDefect}
              disabled={!selectedReason}
            >
              บันทึกของเสีย
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Session Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันจบการทำงาน</DialogTitle>
            <DialogDescription>
              ระบบจะบันทึกเวลาสิ้นสุดและส่งข้อมูลไปยังหัวหน้ากะเพื่อตรวจสอบ
            </DialogDescription>
          </DialogHeader>
          
          <div className="rounded-lg bg-muted/30 p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">ใบสั่งผลิต</p>
                <p className="font-medium">{session.orderId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">เวลาทำงาน</p>
                <p className="font-mono font-medium">{formatTime(elapsedTime)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">งานดี</p>
                <p className="font-bold text-success">{session.goodCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ของเสีย</p>
                <p className="font-bold text-danger">{session.defectCount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={confirmEnd}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              ยืนยันจบการทำงาน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
