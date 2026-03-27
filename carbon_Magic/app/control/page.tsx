"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Cog,
  Play,
  Pause,
  Square,
  AlertOctagon,
  RotateCcw,
  Thermometer,
  Gauge,
  Timer,
  CheckCircle2,
  AlertCircle,
  Power,
  Wrench,
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

type MachineStatus = "running" | "error" | "standby" | "maintenance"

interface Machine {
  id: string
  name: string
  status: MachineStatus
  errorCode?: string
  errorMessage?: string
  temperature: number
  pressure: number
  speed: number
  runtime?: string
}

const machines: Machine[] = [
  { id: "P1", name: "เครื่องอัด P1", status: "error", errorCode: "E-1042", errorMessage: "แรงดันไฮดรอลิกต่ำกว่าเกณฑ์", temperature: 85, pressure: 120, speed: 0 },
  { id: "P2", name: "เครื่องอัด P2", status: "running", runtime: "4:32:15", temperature: 92, pressure: 180, speed: 75 },
  { id: "P3", name: "เครื่องอัด P3", status: "running", runtime: "6:15:42", temperature: 88, pressure: 175, speed: 80 },
  { id: "M1", name: "เครื่องผสม M1", status: "standby", temperature: 25, pressure: 0, speed: 0 },
  { id: "M2", name: "เครื่องผสม M2", status: "running", runtime: "2:45:30", temperature: 65, pressure: 85, speed: 60 },
  { id: "A1", name: "เครื่องประกอบ A1", status: "maintenance", errorMessage: "กำลังเปลี่ยนอะไหล่ตามกำหนด", temperature: 25, pressure: 0, speed: 0 },
  { id: "D1", name: "เครื่องอบแห้ง D1", status: "running", runtime: "8:00:00", temperature: 145, pressure: 0, speed: 100 },
  { id: "D2", name: "เครื่องอบแห้ง D2", status: "standby", temperature: 25, pressure: 0, speed: 0 },
]

function generateTelemetryData() {
  const data = []
  const now = new Date()
  for (let i = 15; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000)
    data.push({
      time: time.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      temperature: 85 + Math.random() * 15,
      pressure: 165 + Math.random() * 30,
    })
  }
  return data
}

const statusConfig = {
  running: {
    bg: "bg-success/10 border-success/30 hover:bg-success/20",
    icon: CheckCircle2,
    iconClass: "text-success",
    label: "กำลังทำงาน",
  },
  error: {
    bg: "bg-danger/10 border-danger/30 hover:bg-danger/20",
    icon: AlertCircle,
    iconClass: "text-danger",
    label: "ขัดข้อง",
  },
  standby: {
    bg: "bg-warning/10 border-warning/30 hover:bg-warning/20",
    icon: Power,
    iconClass: "text-warning",
    label: "สแตนด์บาย",
  },
  maintenance: {
    bg: "bg-muted border-borde text-black hover:bg-muted/80",
    icon: Wrench,
    iconClass: "text-muted-foreground",
    label: "ซ่อมบำรุง",
  },
}

export default function ControlPanelPage() {
  const [selectedMachine, setSelectedMachine] = useState<Machine>(machines[1])
  const [telemetryData] = useState(generateTelemetryData)
  const [confirmAction, setConfirmAction] = useState<"start" | "stop" | "pause" | "emergency" | "reset" | null>(null)

  const [tempSetting, setTempSetting] = useState(selectedMachine.temperature)
  const [pressureSetting, setPressureSetting] = useState(selectedMachine.pressure)
  const [speedSetting, setSpeedSetting] = useState([selectedMachine.speed])

  const handleMachineSelect = (machine: Machine) => {
    setSelectedMachine(machine)
    setTempSetting(machine.temperature)
    setPressureSetting(machine.pressure)
    setSpeedSetting([machine.speed])
  }

  const handleConfirmAction = () => {
    setConfirmAction(null)
  }

  const getActionDescription = () => {
    switch (confirmAction) {
      case "start":
        return `คุณต้องการเริ่มการทำงานของ ${selectedMachine.name} หรือไม่?`
      case "stop":
        return `คุณต้องการหยุดการทำงานของ ${selectedMachine.name} หรือไม่? การดำเนินการนี้จะหยุดการผลิตทันที`
      case "pause":
        return `คุณต้องการพักการทำงานของ ${selectedMachine.name} หรือไม่?`
      case "emergency":
        return `คำเตือน! คุณกำลังจะกดหยุดฉุกเฉิน ${selectedMachine.name} การดำเนินการนี้จะหยุดเครื่องจักรทันทีและอาจต้องรีเซ็ตก่อนเริ่มใหม่`
      case "reset":
        return `คุณต้องการรีเซ็ตรหัสข้อผิดพลาด ${selectedMachine.errorCode} ของ ${selectedMachine.name} หรือไม่?`
      default:
        return ""
    }
  }

  const config = statusConfig[selectedMachine.status]
  const StatusIcon = config.icon

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">ระบบควบคุม</h1>
        <p className="text-sm text-muted-foreground">
          ควบคุมและปรับตั้งค่าเครื่องจักรแบบ Real-time
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Card className="border-borde text-black">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                เลือกเครื่องจักร
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {machines.map((machine) => {
                const machineConfig = statusConfig[machine.status]
                const MachineIcon = machineConfig.icon
                return (
                  <button
                    key={machine.id}
                    type="button"
                    onClick={() => handleMachineSelect(machine)}
                    className={`w-full rounded-lg border p-3 text-left transition ${machineConfig.bg} ${
                      selectedMachine.id === machine.id ? "ring-2 ring-primary/40" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${machineConfig.bg}`}>
                        <MachineIcon className={`h-4 w-4 ${machineConfig.iconClass}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{machine.name}</p>
                        <p className="text-xs text-muted-foreground">{machineConfig.label}</p>
                      </div>
                      {machine.status === "error" && machine.errorCode ? (
                        <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs text-danger">
                          {machine.errorCode}
                        </span>
                      ) : null}
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-8">
          <Card className="border-border text-black">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <StatusIcon className={`h-5 w-5 ${config.iconClass}`} />
                {selectedMachine.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">อุณหภูมิ</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold text-foreground">{selectedMachine.temperature}°C</span>
                    <Thermometer className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">แรงดัน</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold text-foreground">{selectedMachine.pressure} bar</span>
                    <Gauge className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">ความเร็ว</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold text-foreground">{selectedMachine.speed}%</span>
                    <Timer className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {selectedMachine.status === "error" && (
                <div className="rounded-lg border border-danger/40 bg-danger/10 p-3">
                  <div className="flex items-center gap-2 text-danger">
                    <AlertOctagon className="h-4 w-4" />
                    <span className="text-sm font-semibold">{selectedMachine.errorCode}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{selectedMachine.errorMessage}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setConfirmAction("start")}>
                  <Play className="mr-2 h-4 w-4" />
                  เริ่มงาน
                </Button>
                <Button variant="secondary" onClick={() => setConfirmAction("pause")}>
                  <Pause className="mr-2 h-4 w-4" />
                  พักเครื่อง
                </Button>
                <Button variant="outline" onClick={() => setConfirmAction("stop")}>
                  <Square className="mr-2 h-4 w-4" />
                  หยุดเครื่อง
                </Button>
                <Button variant="destructive" onClick={() => setConfirmAction("emergency")}>
                  <AlertOctagon className="mr-2 h-4 w-4" />
                  หยุดฉุกเฉิน
                </Button>
                <Button variant="ghost" onClick={() => setConfirmAction("reset")}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  รีเซ็ต
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border text-black">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Telemetry 15 นาทีล่าสุด</CardTitle>
            </CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pressure" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border text-black">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Cog className="h-5 w-5" />
                ปรับตั้งค่าพารามิเตอร์
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs text-muted-foreground">อุณหภูมิเป้าหมาย (°C)</label>
                  <Input
                    type="number"
                    value={tempSetting}
                    onChange={(event) => setTempSetting(Number(event.target.value || 0))}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">แรงดันเป้าหมาย (bar)</label>
                  <Input
                    type="number"
                    value={pressureSetting}
                    onChange={(event) => setPressureSetting(Number(event.target.value || 0))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">ความเร็วเครื่อง (%)</label>
                <div className="mt-2 flex items-center gap-3">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={speedSetting}
                    onValueChange={setSpeedSetting}
                  />
                  <span className="w-10 text-right text-sm text-foreground">
                    {Math.round(speedSetting[0] || 0)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button>
                  <Wrench className="mr-2 h-4 w-4" />
                  ส่งค่าตั้ง
                </Button>
                <Button variant="outline">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  บันทึกโปรไฟล์
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={confirmAction !== null} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              ยืนยันคำสั่ง
            </AlertDialogTitle>
            <AlertDialogDescription>{getActionDescription()}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>ยืนยัน</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
