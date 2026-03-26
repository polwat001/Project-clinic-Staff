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

// Generate mock telemetry data for 15 minutes
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
  
  // Parameter states
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
    // In a real app, this would send the command to the machine
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

      {/* Master-Detail Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Machine List - Left */}
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
                    onClick={() => handleMachineSelect(machine)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                      selectedMachine.id === machine.id
                        ? "border-primary bg-primary/10"
                        : machineConfig.bg
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Cog className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{machine.id}</span>
                        <MachineIcon className={`h-4 w-4 ${machineConfig.iconClass}`} />
                      </div>
                      <p className="text-sm font-medium text-foreground">{machine.name}</p>
                    </div>
                    {machine.status === "error" && (
                      <span className="rounded bg-danger/20 px-2 py-0.5 font-mono text-xs text-danger">
                        {machine.errorCode}
                      </span>
                    )}
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Control Panel - Right */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* Machine Header */}
          <Card className="border-borde text-black">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                    <Cog className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedMachine.name}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">รหัส: {selectedMachine.id}</span>
                      <span className={`flex items-center gap-1 text-sm ${config.iconClass}`}>
                        <StatusIcon className="h-4 w-4" />
                        {config.label}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedMachine.runtime && (
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm text-foreground">{selectedMachine.runtime}</span>
                  </div>
                )}
              </div>

              {selectedMachine.status === "error" && (
                <div className="mt-4 rounded-lg bg-danger/10 p-4">
                  <div className="flex items-center gap-2 text-danger">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Error: {selectedMachine.errorCode}</span>
                  </div>
                  <p className="mt-1 text-sm text-danger/80">{selectedMachine.errorMessage}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Telemetry */}
          <Card className="border-borde text-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ข้อมูล Real-time (15 นาทีที่ผ่านมา)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={telemetryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <YAxis 
                      yAxisId="temp"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      domain={[0, 200]}
                    />
                    <YAxis 
                      yAxisId="pressure"
                      orientation="right"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      domain={[0, 250]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))"
                      }}
                    />
                    <Line 
                      yAxisId="temp"
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="hsl(var(--danger))" 
                      strokeWidth={2}
                      dot={false}
                      name="อุณหภูมิ (°C)"
                    />
                    <Line 
                      yAxisId="pressure"
                      type="monotone" 
                      dataKey="pressure" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      dot={false}
                      name="แรงดัน (PSI)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-danger" />
                  <span className="text-muted-foreground">อุณหภูมิ (°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-chart-2" />
                  <span className="text-muted-foreground">แรงดัน (PSI)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parameter Controls */}
          <Card className="border-borde text-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ตั้งค่าพารามิเตอร์
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {/* Temperature */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-danger" />
                      <span className="text-sm text-foreground">อุณหภูมิ</span>
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">{tempSetting}°C</span>
                  </div>
                  <Input
                    type="number"
                    value={tempSetting}
                    onChange={(e) => setTempSetting(Number(e.target.value))}
                    className="bg-muted/50 border-borde text-black"
                    disabled={selectedMachine.status !== "running"}
                  />
                </div>

                {/* Pressure */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-chart-2" />
                      <span className="text-sm text-foreground">แรงดัน</span>
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">{pressureSetting} PSI</span>
                  </div>
                  <Input
                    type="number"
                    value={pressureSetting}
                    onChange={(e) => setPressureSetting(Number(e.target.value))}
                    className="bg-muted/50 border-borde text-black"
                    disabled={selectedMachine.status !== "running"}
                  />
                </div>

                {/* Speed */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">ความเร็ว</span>
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">{speedSetting[0]}%</span>
                  </div>
                  <Slider
                    value={speedSetting}
                    onValueChange={setSpeedSetting}
                    max={100}
                    step={5}
                    disabled={selectedMachine.status !== "running"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="border-borde text-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                สั่งการ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setConfirmAction("start")}
                  disabled={selectedMachine.status === "running" || selectedMachine.status === "maintenance"}
                  className="bg-success text-success-foreground hover:bg-success/90"
                >
                  <Play className="mr-2 h-4 w-4" />
                  เริ่มการทำงาน
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConfirmAction("pause")}
                  disabled={selectedMachine.status !== "running"}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  พักการทำงาน
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConfirmAction("stop")}
                  disabled={selectedMachine.status !== "running"}
                >
                  <Square className="mr-2 h-4 w-4" />
                  หยุดการทำงาน
                </Button>
                {selectedMachine.status === "error" && (
                  <Button
                    variant="outline"
                    onClick={() => setConfirmAction("reset")}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    รีเซ็ต Error
                  </Button>
                )}
                <Button
                  onClick={() => setConfirmAction("emergency")}
                  className="bg-danger text-danger-foreground hover:bg-danger/90"
                >
                  <AlertOctagon className="mr-2 h-4 w-4" />
                  หยุดฉุกเฉิน
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmAction !== null} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent className="bg-card border-borde text-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              {confirmAction === "emergency" ? (
                <AlertOctagon className="h-5 w-5 text-danger" />
              ) : (
                <Cog className="h-5 w-5" />
              )}
              ยืนยันการดำเนินการ
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {getActionDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/80">
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                confirmAction === "emergency"
                  ? "bg-danger text-danger-foreground hover:bg-danger/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }
            >
              ยืนยัน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
