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
  import { Input } from "@/components/ui/input"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  import { AlertTriangle, CheckCircle2, ClipboardCheck, Edit3, FileCheck2, History, Send } from "lucide-react"

  interface ShiftRecord {
    id: string
    orderId: string
    operator: string
    shift: string
    goodCount: number
    defectCount: number
    submittedAt: string
    status: "pending" | "approved"
  }

  interface AuditLog {
    id: string
    timestamp: string
    actor: string
    action: string
    details: string
  }

  interface EditDraft {
    rowId: string
    field: "goodCount" | "defectCount"
    originalValue: number
    nextValue: number
  }

  const initialRecords: ShiftRecord[] = [
    {
      id: "APR-001",
      orderId: "PO-2026-110",
      operator: "สมชาย มั่นคง",
      shift: "กะเช้า",
      goodCount: 480,
      defectCount: 18,
      submittedAt: "13:35",
      status: "pending",
    },
    {
      id: "APR-002",
      orderId: "PO-2026-111",
      operator: "วิภา ใจดี",
      shift: "กะเช้า",
      goodCount: 510,
      defectCount: 9,
      submittedAt: "13:42",
      status: "pending",
    },
    {
      id: "APR-003",
      orderId: "PO-2026-112",
      operator: "ประยุทธ์ เก่งมาก",
      shift: "กะบ่าย",
      goodCount: 260,
      defectCount: 4,
      submittedAt: "20:10",
      status: "pending",
    },
  ]

  const initialLogs: AuditLog[] = [
    {
      id: "LG-1",
      timestamp: "13:35",
      actor: "สมชาย มั่นคง",
      action: "submit",
      details: "ส่งผลผลิตกะเช้า PO-2026-110",
    },
    {
      id: "LG-2",
      timestamp: "13:42",
      actor: "วิภา ใจดี",
      action: "submit",
      details: "ส่งผลผลิตกะเช้า PO-2026-111",
    },
  ]

  export default function ApprovalPage() {
    const [records, setRecords] = useState<ShiftRecord[]>(initialRecords)
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialLogs)
    const [editDraft, setEditDraft] = useState<EditDraft | null>(null)
    const [editReason, setEditReason] = useState("")
    const [showApproveDialog, setShowApproveDialog] = useState(false)
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null)

    const pendingRecords = useMemo(() => records.filter((item) => item.status === "pending"), [records])
    const approvedCount = useMemo(() => records.filter((item) => item.status === "approved").length, [records])

    const pushAuditLog = (log: Omit<AuditLog, "id" | "timestamp">) => {
      const timestamp = new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
      const next: AuditLog = {
        id: Date.now().toString(),
        timestamp,
        ...log,
      }
      setAuditLogs((prev) => [next, ...prev])
    }

    const openEditDialog = (rowId: string, field: "goodCount" | "defectCount", originalValue: number) => {
      setEditDraft({ rowId, field, originalValue, nextValue: originalValue })
      setEditReason("")
    }

    const confirmEdit = () => {
      if (!editDraft || !editReason.trim()) return

      setRecords((prev) =>
        prev.map((row) =>
          row.id === editDraft.rowId
            ? {
                ...row,
                [editDraft.field]: Math.max(0, editDraft.nextValue),
              }
            : row
        )
      )

      pushAuditLog({
        actor: "หัวหน้ากะ วิชัย",
        action: "edit",
        details: `${editDraft.rowId} แก้ ${editDraft.field} จาก ${editDraft.originalValue} เป็น ${Math.max(0, editDraft.nextValue)} | เหตุผล: ${editReason}`,
      })

      setEditDraft(null)
    }

    const requestApprove = (rowId: string) => {
      setSelectedRowId(rowId)
      setShowApproveDialog(true)
    }

    const confirmApprove = () => {
      if (!selectedRowId) return

      setRecords((prev) => prev.map((row) => (row.id === selectedRowId ? { ...row, status: "approved" } : row)))

      const row = records.find((item) => item.id === selectedRowId)
      if (row) {
        pushAuditLog({
          actor: "หัวหน้ากะ วิชัย",
          action: "approve",
          details: `${row.orderId} Approved และ Sync เข้า Costing`,
        })
      }

      setShowApproveDialog(false)
      setSelectedRowId(null)
    }

    return (
      <DashboardShell>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Supervisor Approval</h1>
          <p className="text-sm text-muted-foreground">
            ตรวจสอบผลผลิตที่จบกะแล้ว, แก้ไขพร้อมเหตุผล, เก็บ Audit Trail และอนุมัติส่งบัญชี
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="border-border text-black">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">รอดำเนินการ</p>
              <p className="mt-1 text-2xl font-bold text-warning">{pendingRecords.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border text-black">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="mt-1 text-2xl font-bold text-success">{approvedCount}</p>
            </CardContent>
          </Card>
          <Card className="border-border text-black">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">Sync Costing</p>
              <p className="mt-1 text-sm font-medium text-primary">เปิดเมื่อกดอนุมัติแต่ละรายการ</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="border-border text-black">
                  <TableHead className="text-xs">พนักงาน</TableHead>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardCheck className="h-5 w-5 text-warning" />
                ตารางผลผลิตที่รออนุมัติ
              </CardTitle>
                        <Badge className="bg-warning text-warning-foreground">รอดำเนินการ</Badge>
                      ) : approval.status === "approved" ? (
                        <Badge className="bg-success text-success-foreground">อนุมัติแล้ว</Badge>
                      ) : (
                        <Badge className="bg-danger text-danger-foreground">ปฏิเสธ</Badge>
                    <TableHead className="text-xs">ใบงาน</TableHead>
                    <TableHead className="text-xs">ใบสั่งผลิต</TableHead>
                    <TableHead className="text-xs">Operator</TableHead>
                    <TableHead className="text-xs">กะ</TableHead>
                    <TableHead className="text-xs text-right">งานดี</TableHead>
                    <TableHead className="text-xs text-right">ของเสีย</TableHead>
                    <TableHead className="text-xs text-right">Reject %</TableHead>
                    <TableHead className="text-xs">สถานะ</TableHead>
                    <TableHead className="text-xs">Action</TableHead>
          </CardContent>
        </Card>

                  {records.map((row) => {
                    const total = row.goodCount + row.defectCount
                    const rejectRate = total === 0 ? 0 : (row.defectCount / total) * 100
                    const isAnomaly = rejectRate > 5

                    return (
                      <TableRow key={row.id} className={isAnomaly ? "bg-orange-100/70" : ""}>
                        <TableCell className="font-mono text-xs font-medium text-primary">{row.id}</TableCell>
                        <TableCell className="font-mono text-xs">{row.orderId}</TableCell>
                        <TableCell className="text-sm">{row.operator}</TableCell>
                        <TableCell className="text-sm">{row.shift}</TableCell>
                        <TableCell
                          className="cursor-pointer text-right font-mono text-sm text-success underline decoration-dashed"
                          onDoubleClick={() => openEditDialog(row.id, "goodCount", row.goodCount)}
                          title="Double click เพื่อแก้ไข"
                        >
                          {row.goodCount.toLocaleString()}
                        </TableCell>
                        <TableCell
                          className="cursor-pointer text-right font-mono text-sm text-danger underline decoration-dashed"
                          onDoubleClick={() => openEditDialog(row.id, "defectCount", row.defectCount)}
                          title="Double click เพื่อแก้ไข"
                        >
                          {row.defectCount.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right text-sm font-semibold ${isAnomaly ? "text-orange-600" : "text-muted-foreground"}`}>
                          {rejectRate.toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          {row.status === "pending" ? (
                            <Badge className="bg-warning text-warning-foreground">รอตรวจสอบ</Badge>
                          ) : (
                            <Badge className="bg-success text-success-foreground">Approved 🟢</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="bg-success text-success-foreground hover:bg-success/90"
                            onClick={() => requestApprove(row.id)}
                            disabled={row.status === "approved"}
                          >
                            อนุมัติ
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                        {(
                          (selectedApproval.defectCount /
                            (selectedApproval.goodCount + selectedApproval.defectCount)) *
                          100

          <Card className="border-border text-black">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-5 w-5 text-primary" />
                Audit Trail (ประวัติการแก้ไข)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="audit" className="w-full">
                <TabsList className="mb-3 w-full">
                  <TabsTrigger value="audit" className="flex-1">Audit Trail</TabsTrigger>
                  <TabsTrigger value="rules" className="flex-1">Validation Rules</TabsTrigger>
                </TabsList>

                <TabsContent value="audit" className="mt-0 space-y-2">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="rounded-lg border border-border bg-muted/20 p-3">
                      <div className="flex items-center justify-between">
                        <Badge
                          className={
                            log.action === "approve"
                              ? "bg-success text-success-foreground"
                              : log.action === "edit"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {log.action}
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium">{log.actor}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{log.details}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="rules" className="mt-0 space-y-2 text-sm">
                  <div className="rounded-lg bg-warning/10 p-3 text-warning">ช่องที่ของเสียเกิน 5% จะถูกไฮไลต์สีส้มเพื่อเตือนหัวหน้ากะ</div>
                  <div className="rounded-lg bg-muted/30 p-3">Double click ที่ยอดงานดี/ของเสียเพื่อแก้ไขตัวเลข</div>
                  <div className="rounded-lg bg-muted/30 p-3">ทุกการแก้ไขบังคับกรอกเหตุผล และถูกบันทึกลง Audit Trail ทันที</div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
            <DialogTitle className="flex items-center gap-2">

        <Dialog open={Boolean(editDraft)} onOpenChange={(open) => !open && setEditDraft(null)}>
            <DialogDescription>
              การแก้ไขจะถูกบันทึกไว้ใน Audit Log
              <DialogTitle className="flex items-center gap-2"><Edit3 className="h-5 w-5 text-primary" />แก้ไขตัวเลข</DialogTitle>
            <div className="rounded-lg bg-warning/10 p-3">
                ระบุค่าที่ต้องการแก้และเหตุผลประกอบ (บังคับ) เพื่อบันทึกลง log
                <AlertTriangle className="h-4 w-4" />
                <span>การแก้ไขทุกครั้งจะถูกบันทึกเป็นหลักฐาน</span>
              </div>
            </div>
              <div>
                <label className="text-sm font-medium">ค่าใหม่ ({editDraft?.field})</label>
                <Input
                  type="number"
                  value={editDraft?.nextValue ?? 0}
                  onChange={(event) =>
                    setEditDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            nextValue: Number(event.target.value || 0),
                          }
                        : prev
                    )
                  }
                  className="mt-1"
                />
                  onChange={(e) => setEditedGoodCount(parseInt(e.target.value) || 0)}
                />
                {editedGoodCount !== selectedApproval?.goodCount && (
                <label className="text-sm font-medium">เหตุผลการแก้ไข *</label>
                <Input value={editReason} onChange={(event) => setEditReason(event.target.value)} className="mt-1" />
                <Input
                  type="number"
                  className="mt-1"
                  value={editedDefectCount}
              <Button variant="outline" onClick={() => setEditDraft(null)}>ยกเลิก</Button>
              <Button onClick={confirmEdit} disabled={!editReason.trim()}>บันทึกพร้อมเหตุผล</Button>
              </div>
            </div>
          </div>

            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              ยกเลิก
            </Button>
              <DialogTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-success" />ยืนยันการอนุมัติ</DialogTitle>
          </DialogFooter>
                ระบบจะเปลี่ยนสถานะเป็น Approved 🟢 และ Sync ข้อมูลชุดนี้ไป Costing
      </Dialog>


            {selectedRowId && (
              <div className="rounded-lg bg-muted/30 p-4 text-sm">
                <p>รายการ: {selectedRowId}</p>
                <p>ขั้นตอนถัดไป: Export/Sync ไปฐานข้อมูลบัญชี</p>
              </div>
            )}
                </span>
              </div>
              <Button variant="outline" onClick={() => setShowApproveDialog(false)}>ยกเลิก</Button>
              <Button className="bg-success text-success-foreground hover:bg-success/90" onClick={confirmApprove}>
                <FileCheck2 className="mr-2 h-4 w-4" />ยืนยันอนุมัติ
              </Button>
            <User className="h-4 w-4" />
            <span>ลงชื่อโดย: วิชัย (หัวหน้ากะ)</span>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              ยกเลิก
            </Button>
            <Button
              className="bg-success text-success-foreground hover:bg-success/90"
              onClick={confirmApprove}
            >
              <Send className="mr-2 h-4 w-4" />
              อนุมัติและส่งต่อ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
