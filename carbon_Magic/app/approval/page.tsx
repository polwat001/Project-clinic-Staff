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
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CheckCircle2,
  Clock,
  Edit3,
  FileCheck2,
  History,
  AlertTriangle,
  Send,
  User,
  XCircle,
} from "lucide-react"

interface PendingApproval {
  id: string
  orderId: string
  productName: string
  operator: string
  shift: string
  goodCount: number
  defectCount: number
  workTime: string
  startTime: string
  endTime: string
  submittedAt: string
  status: "pending" | "approved" | "rejected"
}

interface AuditLog {
  id: string
  timestamp: string
  action: string
  user: string
  details: string
}

const pendingApprovals: PendingApproval[] = [
  {
    id: "APP-001",
    orderId: "PO-2024-010",
    productName: "Carbon Filter Type A",
    operator: "สมชาย มั่นคง",
    shift: "กะเช้า",
    goodCount: 485,
    defectCount: 15,
    workTime: "07:32:15",
    startTime: "06:00:00",
    endTime: "13:32:15",
    submittedAt: "13:35:00",
    status: "pending",
  },
  {
    id: "APP-002",
    orderId: "PO-2024-011",
    productName: "Carbon Block B200",
    operator: "วิภา ใจดี",
    shift: "กะเช้า",
    goodCount: 320,
    defectCount: 8,
    workTime: "06:45:30",
    startTime: "06:00:00",
    endTime: "12:45:30",
    submittedAt: "12:50:00",
    status: "pending",
  },
  {
    id: "APP-003",
    orderId: "PO-2024-012",
    productName: "Activated Carbon X",
    operator: "ประยุทธ์ เก่งมาก",
    shift: "กะบ่าย",
    goodCount: 250,
    defectCount: 5,
    workTime: "05:20:00",
    startTime: "14:00:00",
    endTime: "19:20:00",
    submittedAt: "19:25:00",
    status: "pending",
  },
]

const initialAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "13:35:00",
    action: "ส่งข้อมูล",
    user: "สมชาย มั่นคง",
    details: "ส่งรายงานผลผลิตประจำกะเช้า PO-2024-010",
  },
  {
    id: "2",
    timestamp: "12:50:00",
    action: "ส่งข้อมูล",
    user: "วิภา ใจดี",
    details: "ส่งรายงานผลผลิตประจำกะเช้า PO-2024-011",
  },
]

export default function ApprovalPage() {
  const [approvals, setApprovals] = useState(pendingApprovals)
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [editedGoodCount, setEditedGoodCount] = useState(0)
  const [editedDefectCount, setEditedDefectCount] = useState(0)

  const pendingCount = approvals.filter((a) => a.status === "pending").length
  const approvedCount = approvals.filter((a) => a.status === "approved").length

  const handleSelectApproval = (approval: PendingApproval) => {
    setSelectedApproval(approval)
    setEditedGoodCount(approval.goodCount)
    setEditedDefectCount(approval.defectCount)
  }

  const handleEdit = () => {
    setShowEditDialog(true)
  }

  const confirmEdit = () => {
    if (!selectedApproval) return

    const now = new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
    const changes: string[] = []

    if (editedGoodCount !== selectedApproval.goodCount) {
      changes.push(`งานดี ${selectedApproval.goodCount} → ${editedGoodCount}`)
    }
    if (editedDefectCount !== selectedApproval.defectCount) {
      changes.push(`ของเสีย ${selectedApproval.defectCount} → ${editedDefectCount}`)
    }

    if (changes.length > 0) {
      const newLog: AuditLog = {
        id: Date.now().toString(),
        timestamp: now,
        action: "แก้ไขข้อมูล",
        user: "วิชัย (หัวหน้ากะ)",
        details: `แก้ไข ${selectedApproval.orderId}: ${changes.join(", ")}`,
      }
      setAuditLogs([newLog, ...auditLogs])

      setApprovals(approvals.map((a) =>
        a.id === selectedApproval.id
          ? { ...a, goodCount: editedGoodCount, defectCount: editedDefectCount }
          : a
      ))
      setSelectedApproval({
        ...selectedApproval,
        goodCount: editedGoodCount,
        defectCount: editedDefectCount,
      })
    }

    setShowEditDialog(false)
  }

  const handleApprove = () => {
    setShowApproveDialog(true)
  }

  const confirmApprove = () => {
    if (!selectedApproval) return

    const now = new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: now,
      action: "อนุมัติ",
      user: "วิชัย (หัวหน้ากะ)",
      details: `อนุมัติและส่งต่อ ${selectedApproval.orderId} ไปยังระบบบัญชี`,
    }
    setAuditLogs([newLog, ...auditLogs])

    setApprovals(approvals.map((a) =>
      a.id === selectedApproval.id ? { ...a, status: "approved" as const } : a
    ))
    setSelectedApproval({ ...selectedApproval, status: "approved" })
    setShowApproveDialog(false)
  }

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">ตรวจสอบและอนุมัติ</h1>
        <p className="text-sm text-muted-foreground">
          ตรวจสอบข้อมูลผลผลิตและอนุมัติส่งต่อไปยังระบบบัญชี
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card className="border-border text-black">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/20 p-2">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">รออนุมัติ</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
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
                <p className="text-sm text-muted-foreground">อนุมัติแล้ว</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border text-black">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/20 p-2">
                <FileCheck2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ส่งต่อบัญชี</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel - Pending Approvals */}
        <Card className="border-border text-black">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-warning" />
              รายการที่รออนุมัติ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">เลขที่ PO</TableHead>
                  <TableHead className="text-xs">พนักงาน</TableHead>
                  <TableHead className="text-xs text-right text-green-500">งานดี</TableHead>
                  <TableHead className="text-xs text-right text-red-500">ของเสีย</TableHead>
                  <TableHead className="text-xs">สถานะ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((approval) => (
                  <TableRow
                    key={approval.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedApproval?.id === approval.id ? "bg-muted/70" : ""
                    }`}
                    onClick={() => handleSelectApproval(approval)}
                  >
                    <TableCell className="font-mono text-xs font-medium text-primary">
                      {approval.orderId}
                    </TableCell>
                    <TableCell className="text-sm">{approval.operator}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-success">
                      {approval.goodCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-danger">
                      {approval.defectCount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {approval.status === "pending" ? (
                        <Badge className="bg-warning text-warning-foreground">รอดำเนินการ</Badge>
                      ) : approval.status === "approved" ? (
                        <Badge className="bg-success text-success-foreground">อนุมัติแล้ว</Badge>
                      ) : (
                        <Badge className="bg-danger text-danger-foreground">ปฏิเสธ</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Panel - Detail & Audit Log */}
        <div className="space-y-4">
          {/* Detail Card */}
          <Card className="border-border text-black">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {selectedApproval ? `รายละเอียด: ${selectedApproval.orderId}` : "รายละเอียดข้อมูล"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedApproval ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">สินค้า</p>
                      <p className="font-medium">{selectedApproval.productName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">กะ</p>
                      <p className="font-medium">{selectedApproval.shift}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">พนักงาน</p>
                      <p className="font-medium">{selectedApproval.operator}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">เวลาทำงาน</p>
                      <p className="font-mono font-medium">{selectedApproval.workTime}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border p-4 text-black">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">ยอดงานดี</p>
                        <p className="text-3xl font-bold text-success">
                          {selectedApproval.goodCount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">ยอดของเสีย</p>
                        <p className="text-3xl font-bold text-danger">
                          {selectedApproval.defectCount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 border-t border-border pt-3 text-center">
                      <p className="text-sm text-muted-foreground">อัตราของเสีย</p>
                      <p className="text-xl font-bold">
                        {(
                          (selectedApproval.defectCount /
                            (selectedApproval.goodCount + selectedApproval.defectCount)) *
                          100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-muted/30 p-2 text-black">
                      <p className="text-xs text-muted-foreground">เวลาเริ่ม</p>
                      <p className="font-mono">{selectedApproval.startTime}</p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-2">
                      <p className="text-xs text-muted-foreground">เวลาจบ</p>
                      <p className="font-mono">{selectedApproval.endTime}</p>
                    </div>
                  </div>

                  {selectedApproval.status === "pending" && (
                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" className="flex-1" onClick={handleEdit}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        แก้ไขข้อมูล
                      </Button>
                      <Button
                        className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                        onClick={handleApprove}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        อนุมัติและส่งต่อ
                      </Button>
                    </div>
                  )}

                  {selectedApproval.status === "approved" && (
                    <div className="rounded-lg bg-success/10 p-4 text-center">
                      <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-success" />
                      <p className="font-medium text-success">อนุมัติและส่งต่อบัญชีแล้ว</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-48 flex-col items-center justify-center text-muted-foreground">
                  <FileCheck2 className="mb-3 h-12 w-12 opacity-50" />
                  <p>เลือกรายการจากด้านซ้ายเพื่อดูรายละเอียด</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit Log */}
          <Card className="border-border text-black">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-5 w-5 text-primary" />
                ประวัติการดำเนินการ (Audit Log)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex gap-3 rounded-lg bg-muted/30 p-3 text-black">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                      {log.action === "อนุมัติ" ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : log.action === "แก้ไขข้อมูล" ? (
                        <Edit3 className="h-4 w-4 text-warning" />
                      ) : (
                        <Send className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {log.timestamp}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {log.action}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm">{log.details}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {log.user}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-warning" />
              แก้ไขข้อมูล
            </DialogTitle>
            <DialogDescription>
              การแก้ไขจะถูกบันทึกไว้ใน Audit Log
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-warning/10 p-3">
              <div className="flex items-center gap-2 text-sm text-warning">
                <AlertTriangle className="h-4 w-4" />
                <span>การแก้ไขทุกครั้งจะถูกบันทึกเป็นหลักฐาน</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">ยอดงานดี</label>
                <Input
                  type="number"
                  className="mt-1"
                  value={editedGoodCount}
                  onChange={(e) => setEditedGoodCount(parseInt(e.target.value) || 0)}
                />
                {editedGoodCount !== selectedApproval?.goodCount && (
                  <p className="mt-1 text-xs text-warning">
                    เดิม: {selectedApproval?.goodCount}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">ยอดของเสีย</label>
                <Input
                  type="number"
                  className="mt-1"
                  value={editedDefectCount}
                  onChange={(e) => setEditedDefectCount(parseInt(e.target.value) || 0)}
                />
                {editedDefectCount !== selectedApproval?.defectCount && (
                  <p className="mt-1 text-xs text-warning">
                    เดิม: {selectedApproval?.defectCount}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={confirmEdit}>
              <Edit3 className="mr-2 h-4 w-4" />
              บันทึกการแก้ไข
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              ยืนยันการอนุมัติ
            </DialogTitle>
            <DialogDescription>
              ข้อมูลจะถูกส่งไปยังระบบบัญชีเพื่อตัดต้นทุนทันที
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg bg-muted/30 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ใบสั่งผลิต:</span>
                <span className="font-medium">{selectedApproval?.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">งานดี:</span>
                <span className="font-bold text-success">
                  {selectedApproval?.goodCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ของเสีย:</span>
                <span className="font-bold text-danger">
                  {selectedApproval?.defectCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
