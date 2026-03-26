"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { KpiSection } from "@/components/dashboard/kpi-section"
import { OrderListSection } from "@/components/dashboard/order-list-section"
import { MachineStatusSection } from "@/components/dashboard/machine-status-section"
import { AlertCircle, Clock } from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardShell>
      {/* Alert Banner */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-danger/30 bg-danger/10 p-4">
        <AlertCircle className="h-5 w-5 shrink-0 text-danger" />
        <div className="flex-1">
          <p className="text-sm font-medium text-danger">
            เครื่องอัด P1 หยุดทำงาน - รหัสข้อผิดพลาด E-1042
          </p>
          <p className="text-xs text-danger/70">
            แรงดันไฮดรอลิกต่ำกว่าเกณฑ์ กรุณาตรวจสอบ
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-danger/70">
          <Clock className="h-3 w-3" />
          <span>5 นาทีที่แล้ว</span>
        </div>
      </div>

      {/* Dashboard Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          ภาพรวมการผลิตวันที่ 26 มีนาคม 2026
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* KPI Section - Left */}
        <div className="lg:col-span-3">
          <KpiSection />
        </div>

        {/* Order List & Machine Status - Center & Right */}
        <div className="flex flex-col gap-6 lg:col-span-9">
          <OrderListSection />
          <MachineStatusSection />
        </div>
      </div>
    </DashboardShell>
  )
}
