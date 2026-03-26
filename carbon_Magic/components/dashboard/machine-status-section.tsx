"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Cog, AlertCircle, Power, Wrench, CheckCircle2 } from "lucide-react"

type MachineStatus = "running" | "error" | "standby" | "maintenance"

interface Machine {
  id: string
  name: string
  status: MachineStatus
  errorCode?: string
  errorMessage?: string
  runtime?: string
  output?: number
}

const machines: Machine[] = [
  { id: "P1", name: "เครื่องอัด P1", status: "error", errorCode: "E-1042", errorMessage: "แรงดันไฮดรอลิกต่ำกว่าเกณฑ์" },
  { id: "P2", name: "เครื่องอัด P2", status: "running", runtime: "4:32:15", output: 1250 },
  { id: "P3", name: "เครื่องอัด P3", status: "running", runtime: "6:15:42", output: 2100 },
  { id: "M1", name: "เครื่องผสม M1", status: "standby" },
  { id: "M2", name: "เครื่องผสม M2", status: "running", runtime: "2:45:30", output: 850 },
  { id: "A1", name: "เครื่องประกอบ A1", status: "maintenance", errorMessage: "กำลังเปลี่ยนอะไหล่ตามกำหนด" },
  { id: "D1", name: "เครื่องอบแห้ง D1", status: "running", runtime: "8:00:00", output: 3200 },
  { id: "D2", name: "เครื่องอบแห้ง D2", status: "standby" },
]

function MachineCard({ machine, onClick }: { machine: Machine; onClick: () => void }) {
  const statusConfig = {
    running: {
      bg: "bg-success/10 border-success/30 hover:bg-success/20",
      icon: <CheckCircle2 className="h-5 w-5 text-success" />,
      label: "กำลังทำงาน",
      labelClass: "text-success",
    },
    error: {
      bg: "bg-danger/10 border-danger/30 hover:bg-danger/20 animate-pulse",
      icon: <AlertCircle className="h-5 w-5 text-danger" />,
      label: "ขัดข้อง",
      labelClass: "text-danger",
    },
    standby: {
      bg: "bg-warning/10 border-warning/30 hover:bg-warning/20",
      icon: <Power className="h-5 w-5 text-warning" />,
      label: "สแตนด์บาย",
      labelClass: "text-warning",
    },
    maintenance: {
      bg: "bg-muted border-border hover:bg-muted/80",
      icon: <Wrench className="h-5 w-5 text-muted-foreground" />,
      label: "ซ่อมบำรุง",
      labelClass: "text-muted-foreground",
    },
  }

  const config = statusConfig[machine.status]

  return (
    <button
      onClick={onClick}
      className={`flex flex-col gap-2 rounded-lg border p-4 text-left transition-all ${config.bg}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cog className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">{machine.id}</span>
        </div>
        {config.icon}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{machine.name}</p>
        <p className={`text-xs ${config.labelClass}`}>{config.label}</p>
      </div>
      {machine.status === "running" && machine.output && (
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">ผลผลิต:</span>
          <span className="font-medium text-foreground">{machine.output.toLocaleString()} ชิ้น</span>
        </div>
      )}
      {machine.status === "error" && machine.errorCode && (
        <div className="mt-1 rounded bg-danger/20 px-2 py-1">
          <p className="text-xs font-mono text-danger">{machine.errorCode}</p>
        </div>
      )}
    </button>
  )
}

export function MachineStatusSection() {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleMachineClick = (machine: Machine) => {
    setSelectedMachine(machine)
    setIsDialogOpen(true)
  }

  const handleNotifyMaintenance = () => {
    setIsDialogOpen(false)
    // In a real app, this would send a notification
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              สถานะเครื่องจักร
            </CardTitle>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-muted-foreground">ทำงาน</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-danger" />
                <span className="text-muted-foreground">ขัดข้อง</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-warning" />
                <span className="text-muted-foreground">สแตนด์บาย</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {machines.map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                onClick={() => handleMachineClick(machine)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Cog className="h-5 w-5" />
              {selectedMachine?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              รหัสเครื่อง: {selectedMachine?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedMachine?.status === "error" && (
              <div className="rounded-lg bg-danger/10 p-4">
                <div className="flex items-center gap-2 text-danger">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">เกิดข้อผิดพลาด</span>
                </div>
                <p className="mt-2 font-mono text-sm text-danger">
                  Error Code: {selectedMachine.errorCode}
                </p>
                <p className="mt-1 text-sm text-danger/80">
                  {selectedMachine.errorMessage}
                </p>
              </div>
            )}

            {selectedMachine?.status === "running" && (
              <div className="space-y-3">
                <div className="flex justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm text-muted-foreground">เวลาทำงาน</span>
                  <span className="font-mono text-sm text-foreground">{selectedMachine.runtime}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm text-muted-foreground">ผลผลิต</span>
                  <span className="text-sm font-medium text-foreground">
                    {selectedMachine.output?.toLocaleString()} ชิ้น
                  </span>
                </div>
              </div>
            )}

            {selectedMachine?.status === "maintenance" && (
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Wrench className="h-5 w-5" />
                  <span className="font-medium">อยู่ระหว่างซ่อมบำรุง</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedMachine.errorMessage}
                </p>
              </div>
            )}

            {selectedMachine?.status === "standby" && (
              <div className="rounded-lg bg-warning/10 p-4">
                <div className="flex items-center gap-2 text-warning">
                  <Power className="h-5 w-5" />
                  <span className="font-medium">เครื่องพร้อมใช้งาน</span>
                </div>
                <p className="mt-2 text-sm text-warning/80">
                  เครื่องจักรอยู่ในโหมดสแตนด์บาย พร้อมเริ่มงานได้ทันที
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            {selectedMachine?.status === "error" && (
              <Button onClick={handleNotifyMaintenance} className="bg-danger text-danger-foreground hover:bg-danger/90">
                <Wrench className="mr-2 h-4 w-4" />
                แจ้งช่างซ่อมบำรุง
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              ปิด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
