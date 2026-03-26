"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  Users,
  Bell,
  Cog,
  Globe,
  Shield,
  Plus,
  Pencil,
  Trash2,
  Save,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

type SettingsTab = "general" | "users" | "alerts" | "machines"

interface UserData {
  id: string
  name: string
  email: string
  role: "admin" | "operator" | "viewer"
  lastLogin: string
}

interface AlertThreshold {
  id: string
  machine: string
  parameter: string
  minValue: number
  maxValue: number
  errorCode: string
}

const users: UserData[] = [
  { id: "1", name: "สมชาย วิศวกร", email: "somchai@carbonmagic.co.th", role: "admin", lastLogin: "26 มี.ค. 2026, 08:30" },
  { id: "2", name: "สมหญิง ผู้ควบคุม", email: "somying@carbonmagic.co.th", role: "operator", lastLogin: "26 มี.ค. 2026, 06:00" },
  { id: "3", name: "สมศักดิ์ ผู้ดู", email: "somsak@carbonmagic.co.th", role: "viewer", lastLogin: "25 มี.ค. 2026, 14:00" },
  { id: "4", name: "สมปอง ช่างเทคนิค", email: "sompong@carbonmagic.co.th", role: "operator", lastLogin: "26 มี.ค. 2026, 07:00" },
]

const alertThresholds: AlertThreshold[] = [
  { id: "1", machine: "P1", parameter: "แรงดันไฮดรอลิก", minValue: 150, maxValue: 220, errorCode: "E-1042" },
  { id: "2", machine: "P1", parameter: "อุณหภูมิ", minValue: 70, maxValue: 110, errorCode: "E-1043" },
  { id: "3", machine: "P2", parameter: "แรงดันไฮดรอลิก", minValue: 150, maxValue: 220, errorCode: "E-2042" },
  { id: "4", machine: "P2", parameter: "อุณหภูมิ", minValue: 70, maxValue: 110, errorCode: "E-2043" },
  { id: "5", machine: "D1", parameter: "อุณหภูมิ", minValue: 120, maxValue: 180, errorCode: "E-5043" },
  { id: "6", machine: "M1", parameter: "ความเร็วรอบ", minValue: 100, maxValue: 500, errorCode: "E-3044" },
]

const roleConfig = {
  admin: { label: "Admin", class: "bg-primary/20 text-primary border-primary/30", description: "แก้ไขได้ทุกอย่าง" },
  operator: { label: "Operator", class: "bg-success/20 text-success border-success/30", description: "ดูหน้า Dashboard และ Control Panel" },
  viewer: { label: "Viewer", class: "bg-muted text-muted-foreground border-borde text-black", description: "ดูประวัติได้อย่างเดียว" },
}

const settingsTabs = [
  { id: "general", label: "ทั่วไป", icon: Settings },
  { id: "users", label: "ผู้ใช้งาน", icon: Users },
  { id: "alerts", label: "เกณฑ์แจ้งเตือน", icon: Bell },
  { id: "machines", label: "เครื่องจักร", icon: Cog },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general")
  const [language, setLanguage] = useState("th")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isAddThresholdOpen, setIsAddThresholdOpen] = useState(false)

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">การตั้งค่าระบบ</h1>
        <p className="text-sm text-muted-foreground">
          จัดการการตั้งค่าระบบและสิทธิ์ผู้ใช้งาน
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Inner Sidebar */}
        <div className="lg:col-span-3">
          <Card className="border-borde text-black">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as SettingsTab)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-9">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <Card className="border-borde text-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Globe className="h-5 w-5" />
                    ภาษาและภูมิภาค
                  </CardTitle>
                  <CardDescription>ตั้งค่าภาษาและรูปแบบการแสดงผล</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">ภาษา</p>
                      <p className="text-xs text-muted-foreground">เลือกภาษาสำหรับแสดงผลในระบบ</p>
                    </div>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-40 bg-muted/50 border-borde text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-borde text-black">
                        <SelectItem value="th">ภาษาไทย</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">เขตเวลา</p>
                      <p className="text-xs text-muted-foreground">เขตเวลาที่ใช้แสดงในระบบ</p>
                    </div>
                    <Select defaultValue="asia-bangkok">
                      <SelectTrigger className="w-48 bg-muted/50 border-borde text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-borde text-black">
                        <SelectItem value="asia-bangkok">Asia/Bangkok (UTC+7)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-borde text-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <User className="h-5 w-5" />
                    โปรไฟล์ผู้ใช้
                  </CardTitle>
                  <CardDescription>ข้อมูลส่วนตัวของคุณ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">ชื่อ-นามสกุล</label>
                      <Input defaultValue="สมชาย วิศวกร" className="bg-muted/50 border-borde text-black" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">อีเมล</label>
                      <Input defaultValue="somchai@carbonmagic.co.th" className="bg-muted/50 border-borde text-black" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">ตำแหน่ง</label>
                      <Input defaultValue="ผู้จัดการสายการผลิต" className="bg-muted/50 border-borde text-black" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">เบอร์โทรศัพท์</label>
                      <Input defaultValue="089-123-4567" className="bg-muted/50 border-borde text-black" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      บันทึก
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users & Roles */}
          {activeTab === "users" && (
            <Card className="border-borde text-black">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Shield className="h-5 w-5" />
                    จัดการผู้ใช้งาน
                  </CardTitle>
                  <CardDescription>กำหนดสิทธิ์และบทบาทของผู้ใช้งาน</CardDescription>
                </div>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      เพิ่มผู้ใช้
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-borde text-black">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">เพิ่มผู้ใช้ใหม่</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        กรอกข้อมูลผู้ใช้งานใหม่
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">ชื่อ-นามสกุล</label>
                        <Input className="bg-muted/50 border-borde text-black" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">อีเมล</label>
                        <Input type="email" className="bg-muted/50 border-borde text-black" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">บทบาท</label>
                        <Select>
                          <SelectTrigger className="bg-muted/50 border-borde text-black">
                            <SelectValue placeholder="เลือกบทบาท" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-borde text-black">
                            <SelectItem value="admin">Admin - แก้ไขได้ทุกอย่าง</SelectItem>
                            <SelectItem value="operator">Operator - ดูหน้า Dashboard และ Control Panel</SelectItem>
                            <SelectItem value="viewer">Viewer - ดูประวัติได้อย่างเดียว</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button onClick={() => setIsAddUserOpen(false)}>
                        เพิ่มผู้ใช้
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {/* Role Legend */}
                <div className="mb-4 flex flex-wrap gap-4 text-xs">
                  {Object.entries(roleConfig).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Badge variant="outline" className={config.class}>
                        {config.label}
                      </Badge>
                      <span className="text-muted-foreground">{config.description}</span>
                    </div>
                  ))}
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="border-borde text-black hover:bg-transparent">
                      <TableHead className="text-muted-foreground">ชื่อ</TableHead>
                      <TableHead className="text-muted-foreground">อีเมล</TableHead>
                      <TableHead className="text-muted-foreground">บทบาท</TableHead>
                      <TableHead className="text-muted-foreground">เข้าระบบล่าสุด</TableHead>
                      <TableHead className="text-right text-muted-foreground">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const config = roleConfig[user.role]
                      return (
                        <TableRow key={user.id} className="border-borde text-black">
                          <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={config.class}>
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-danger hover:text-danger">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Alert Thresholds */}
          {activeTab === "alerts" && (
            <Card className="border-borde text-black">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Bell className="h-5 w-5" />
                    ตั้งค่าเกณฑ์แจ้งเตือน
                  </CardTitle>
                  <CardDescription>กำหนดค่าที่จะทริกเกอร์แจ้งเตือนเมื่อพารามิเตอร์เกินขีดจำกัด</CardDescription>
                </div>
                <Dialog open={isAddThresholdOpen} onOpenChange={setIsAddThresholdOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      เพิ่มเกณฑ์
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-borde text-black">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">เพิ่มเกณฑ์แจ้งเตือน</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        กำหนดขีดจำกัดสำหรับพารามิเตอร์ของเครื่องจักร
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">เครื่องจักร</label>
                          <Select>
                            <SelectTrigger className="bg-muted/50 border-borde text-black">
                              <SelectValue placeholder="เลือก" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-borde text-black">
                              <SelectItem value="P1">P1 - เครื่องอัด</SelectItem>
                              <SelectItem value="P2">P2 - เครื่องอัด</SelectItem>
                              <SelectItem value="P3">P3 - เครื่องอัด</SelectItem>
                              <SelectItem value="M1">M1 - เครื่องผสม</SelectItem>
                              <SelectItem value="M2">M2 - เครื่องผสม</SelectItem>
                              <SelectItem value="D1">D1 - เครื่องอบแห้ง</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">พารามิเตอร์</label>
                          <Select>
                            <SelectTrigger className="bg-muted/50 border-borde text-black">
                              <SelectValue placeholder="เลือก" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-borde text-black">
                              <SelectItem value="temperature">อุณหภูมิ</SelectItem>
                              <SelectItem value="pressure">แรงดัน</SelectItem>
                              <SelectItem value="speed">ความเร็วรอบ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">ค่าต่ำสุด</label>
                          <Input type="number" className="bg-muted/50 border-borde text-black" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">ค่าสูงสุด</label>
                          <Input type="number" className="bg-muted/50 border-borde text-black" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">รหัส Error</label>
                        <Input placeholder="e.g., E-1042" className="bg-muted/50 border-borde text-black" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddThresholdOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button onClick={() => setIsAddThresholdOpen(false)}>
                        บันทึก
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-borde text-black hover:bg-transparent">
                      <TableHead className="text-muted-foreground">เครื่องจักร</TableHead>
                      <TableHead className="text-muted-foreground">พารามิเตอร์</TableHead>
                      <TableHead className="text-right text-muted-foreground">ค่าต่ำสุด</TableHead>
                      <TableHead className="text-right text-muted-foreground">ค่าสูงสุด</TableHead>
                      <TableHead className="text-muted-foreground">รหัส Error</TableHead>
                      <TableHead className="text-right text-muted-foreground">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alertThresholds.map((threshold) => (
                      <TableRow key={threshold.id} className="border-borde text-black">
                        <TableCell>
                          <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                            {threshold.machine}
                          </span>
                        </TableCell>
                        <TableCell className="text-foreground">{threshold.parameter}</TableCell>
                        <TableCell className="text-right font-mono text-foreground">{threshold.minValue}</TableCell>
                        <TableCell className="text-right font-mono text-foreground">{threshold.maxValue}</TableCell>
                        <TableCell>
                          <span className="rounded bg-danger/20 px-2 py-0.5 font-mono text-xs text-danger">
                            {threshold.errorCode}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-danger hover:text-danger">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Machines Settings */}
          {activeTab === "machines" && (
            <Card className="border-borde text-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Cog className="h-5 w-5" />
                  ตั้งค่าเครื่องจักร
                </CardTitle>
                <CardDescription>จัดการข้อมูลและการตั้งค่าเครื่องจักร</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="P1">
                  <TabsList className="mb-4 bg-muted">
                    <TabsTrigger value="P1">P1</TabsTrigger>
                    <TabsTrigger value="P2">P2</TabsTrigger>
                    <TabsTrigger value="P3">P3</TabsTrigger>
                    <TabsTrigger value="M1">M1</TabsTrigger>
                    <TabsTrigger value="M2">M2</TabsTrigger>
                    <TabsTrigger value="D1">D1</TabsTrigger>
                  </TabsList>
                  <TabsContent value="P1" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">ชื่อเครื่องจักร</label>
                        <Input defaultValue="เครื่องอัด P1" className="bg-muted/50 border-borde text-black" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">รุ่น/Model</label>
                        <Input defaultValue="HYD-5000X" className="bg-muted/50 border-borde text-black" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">วันที่ติดตั้ง</label>
                        <Input type="date" defaultValue="2022-06-15" className="bg-muted/50 border-borde text-black" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">รอบซ่อมบำรุง (ชม.)</label>
                        <Input type="number" defaultValue="500" className="bg-muted/50 border-borde text-black" />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm text-muted-foreground">หมายเหตุ</label>
                        <Input defaultValue="เครื่องหลักสำหรับการอัดขึ้นรูปคาร์บอนไฟเบอร์" className="bg-muted/50 border-borde text-black" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        บันทึก
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="P2" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">ชื่อเครื่องจักร</label>
                        <Input defaultValue="เครื่องอัด P2" className="bg-muted/50 border-borde text-black" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">รุ่น/Model</label>
                        <Input defaultValue="HYD-5000X" className="bg-muted/50 border-borde text-black" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        บันทึก
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
