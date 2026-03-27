"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { CheckCircle2, CircleAlert, Loader2, Play, Save, Square, Timer } from "lucide-react"

type ShiftStatus = "idle" | "running" | "completed"
type QcStatus = "normal" | "pending"
type SaveStatus = "idle" | "saving" | "saved"

interface GridRow {
  id: string
  machine: string
  orderId: string
  target: number
  goodCount: number
  qcStatus: QcStatus
}

const initialRows: GridRow[] = [
  { id: "R-1", machine: "Press P1", orderId: "PO-2026-110", target: 1800, goodCount: 640, qcStatus: "normal" },
  { id: "R-2", machine: "Press P2", orderId: "PO-2026-111", target: 1600, goodCount: 520, qcStatus: "normal" },
  { id: "R-3", machine: "Mixer M1", orderId: "PO-2026-112", target: 1400, goodCount: 430, qcStatus: "normal" },
]

const orderOptions = [
  { id: "PO-2026-110", name: "Carbon Filter Type A" },
  { id: "PO-2026-111", name: "Carbon Block B200" },
  { id: "PO-2026-112", name: "Activated Carbon X" },
]

function getOrderName(orderId: string) {
  return orderOptions.find((item) => item.id === orderId)?.name ?? "-"
}

async function getServerTimestamp() {
  // In production, replace with API that returns CURRENT_TIMESTAMP from server.
  await new Promise((resolve) => setTimeout(resolve, 250))
  return new Date().toISOString()
}

async function saveProductionRow(_row: GridRow) {
  // In production, call API to persist row update.
  await new Promise((resolve) => setTimeout(resolve, 300))
}

export default function OperatorPage() {
  const [rows, setRows] = useState<GridRow[]>(initialRows)
  const [selectedOrderId, setSelectedOrderId] = useState(orderOptions[0].id)
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>("idle")
  const [startTime, setStartTime] = useState<string | null>(null)
  const [endTime, setEndTime] = useState<string | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [dirtyRows, setDirtyRows] = useState<string[]>([])
  const [saveStateByRow, setSaveStateByRow] = useState<Record<string, SaveStatus>>({})
  const [pendingQcRowId, setPendingQcRowId] = useState<string | null>(null)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [isShiftActionLoading, setIsShiftActionLoading] = useState(false)

  useEffect(() => {
    if (shiftStatus !== "running" || !startTime) return

    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - new Date(startTime).getTime()) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [shiftStatus, startTime])

  useEffect(() => {
    if (dirtyRows.length === 0) return

    const debounceTimer = setTimeout(async () => {
      const rowIdsToSave = [...new Set(dirtyRows)]
      setDirtyRows([])

      for (const rowId of rowIdsToSave) {
        const row = rows.find((item) => item.id === rowId)
        if (!row) continue

        setSaveStateByRow((prev) => ({ ...prev, [rowId]: "saving" }))
        await saveProductionRow(row)
        setSaveStateByRow((prev) => ({ ...prev, [rowId]: "saved" }))

        setTimeout(() => {
          setSaveStateByRow((prev) => ({ ...prev, [rowId]: "idle" }))
        }, 1200)
      }
    }, 700)

    return () => clearTimeout(debounceTimer)
  }, [dirtyRows, rows])

  const totalGood = useMemo(() => rows.reduce((sum, row) => sum + row.goodCount, 0), [rows])
  const totalTarget = useMemo(() => rows.reduce((sum, row) => sum + row.target, 0), [rows])
  const progressPercent = totalTarget === 0 ? 0 : Math.round((totalGood / totalTarget) * 100)

  const formatTimer = (seconds: number) => {
    const hh = Math.floor(seconds / 3600)
    const mm = Math.floor((seconds % 3600) / 60)
    const ss = seconds % 60
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
  }

  const markDirty = (rowId: string) => {
    setDirtyRows((prev) => [...prev, rowId])
  }

  const updateGoodCount = (rowId: string, nextValue: number) => {
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, goodCount: Math.max(0, nextValue) } : row)))
    markDirty(rowId)
  }

  const incrementGood = (rowId: string, amount: number) => {
    const row = rows.find((item) => item.id === rowId)
    if (!row) return
    updateGoodCount(rowId, row.goodCount + amount)
  }

  const callQc = (rowId: string) => {
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, qcStatus: "pending" } : row)))
    markDirty(rowId)
    setPendingQcRowId(rowId)
  }

  const handleStartShift = async () => {
    setIsShiftActionLoading(true)
    const timestamp = await getServerTimestamp()
    setStartTime(timestamp)
    setEndTime(null)
    setShiftStatus("running")
    setElapsedSeconds(0)
    setRows((prev) => prev.map((row) => ({ ...row, orderId: selectedOrderId })))
    setIsShiftActionLoading(false)
  }

  const confirmEndShift = async () => {
    setIsShiftActionLoading(true)
    const timestamp = await getServerTimestamp()
    setEndTime(timestamp)
    setShiftStatus("completed")
    setShowEndDialog(false)
    setIsShiftActionLoading(false)
  }

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Operator Fast-Entry</h1>
        <p className="text-sm text-muted-foreground">
          กรอกผลผลิตแบบตารางคล้าย Excel รองรับทัชสกรีน, ปุ่มลูกศร, Tab และบันทึกอัตโนมัติ
        </p>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-4">
        <Card className="border-border text-black lg:col-span-3">
          <CardContent className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId} disabled={shiftStatus !== "idle"}>
                <SelectTrigger className="min-w-[280px]">
                  <SelectValue placeholder="เลือกใบสั่งผลิต" />
                </SelectTrigger>
                <SelectContent>
                  {orderOptions.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.id} - {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Badge className={shiftStatus === "running" ? "bg-success text-success-foreground" : shiftStatus === "completed" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                {shiftStatus === "idle" && "ยังไม่เริ่มกะ"}
                {shiftStatus === "running" && "กำลังเดินกะ"}
                {shiftStatus === "completed" && "ปิดกะแล้ว"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                className="bg-success text-success-foreground hover:bg-success/90"
                disabled={shiftStatus !== "idle" || isShiftActionLoading}
                onClick={handleStartShift}
              >
                {isShiftActionLoading && shiftStatus === "idle" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                ▶️ เริ่มกะ
              </Button>
              <Button
                variant="outline"
                disabled={shiftStatus !== "running" || isShiftActionLoading}
                onClick={() => setShowEndDialog(true)}
              >
                <Square className="mr-2 h-4 w-4" />
                ⏹️ จบกะ
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border text-black">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Timer className="h-4 w-4 text-primary" />
              เวลาทำงาน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-bold">{formatTimer(elapsedSeconds)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {startTime ? `เริ่ม: ${new Date(startTime).toLocaleTimeString("th-TH")}` : "ยังไม่เริ่มกะ"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border text-black">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Production Data Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="p-3 text-left">เครื่อง</th>
                  <th className="p-3 text-left">PO</th>
                  <th className="p-3 text-right">เป้า</th>
                  <th className="p-3 text-right">งานดี</th>
                  <th className="p-3 text-center">เพิ่มเร็ว</th>
                  <th className="p-3 text-center">QC</th>
                  <th className="p-3 text-center">Auto-Save</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const rowSaveState = saveStateByRow[row.id] ?? "idle"
                  return (
                    <tr key={row.id} className="border-b last:border-b-0 hover:bg-muted/20">
                      <td className="p-2 font-medium">{row.machine}</td>
                      <td className="p-2 font-mono text-xs">{row.orderId}</td>
                      <td className="p-2 text-right">{row.target.toLocaleString()}</td>
                      <td className="p-2 text-right">
                        <Input
                          type="number"
                          inputMode="numeric"
                          className="h-12 text-right text-lg"
                          value={row.goodCount}
                          disabled={shiftStatus !== "running"}
                          onChange={(event) => updateGoodCount(row.id, Number(event.target.value || 0))}
                          onBlur={() => markDirty(row.id)}
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="lg"
                            className="h-12 min-w-20 bg-success text-success-foreground hover:bg-success/90"
                            disabled={shiftStatus !== "running"}
                            onClick={() => incrementGood(row.id, 10)}
                          >
                            +10
                          </Button>
                          <Button
                            size="lg"
                            className="h-12 min-w-20 bg-success text-success-foreground hover:bg-success/90"
                            disabled={shiftStatus !== "running"}
                            onClick={() => incrementGood(row.id, 50)}
                          >
                            +50
                          </Button>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        {row.qcStatus === "pending" ? (
                          <Badge className="bg-warning text-warning-foreground">🟡 รอ QC ตรวจ</Badge>
                        ) : (
                          <Button
                            variant="outline"
                            className="h-12"
                            disabled={shiftStatus !== "running"}
                            onClick={() => callQc(row.id)}
                          >
                            เรียก QC
                          </Button>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {rowSaveState === "saving" && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            saving...
                          </span>
                        )}
                        {rowSaveState === "saved" && (
                          <span className="inline-flex items-center gap-1 text-xs text-success">
                            <Save className="h-3.5 w-3.5" />
                            saved
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">ใบสั่งผลิต</p>
              <p className="text-sm font-medium">{selectedOrderId} - {getOrderName(selectedOrderId)}</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">ยอดงานดีรวม</p>
              <p className="text-sm font-medium text-success">{totalGood.toLocaleString()} ชิ้น</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">ความคืบหน้า</p>
              <p className="text-sm font-medium">{progressPercent}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันจบกะ</DialogTitle>
            <DialogDescription>
              ระบบจะเรียกเวลาจากเซิร์ฟเวอร์และล็อกข้อมูลกะนี้เพื่อส่งต่อหัวหน้ากะ
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 rounded-lg bg-muted/30 p-4 text-sm">
            <p>PO: {selectedOrderId}</p>
            <p>เวลาทำงาน: {formatTimer(elapsedSeconds)}</p>
            <p>งานดีรวม: {totalGood.toLocaleString()} ชิ้น</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={confirmEndShift} disabled={isShiftActionLoading}>
              {isShiftActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              ยืนยันจบกะ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(pendingQcRowId)} onOpenChange={(open) => !open && setPendingQcRowId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CircleAlert className="h-5 w-5 text-warning" />
              แจ้ง QC แล้ว
            </DialogTitle>
            <DialogDescription>แถวนี้ถูกเปลี่ยนสถานะเป็น "รอ QC ตรวจ" และรอการตัดสินของเสียจากฝั่ง QC</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setPendingQcRowId(null)}>ปิด</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
