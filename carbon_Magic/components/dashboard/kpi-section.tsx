"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OEEGauge } from "./oee-gauge"
import { ProductionChart } from "./production-chart"
import { TrendingDown, TrendingUp, Package, AlertTriangle } from "lucide-react"

interface MiniStatProps {
  title: string
  value: string
  change?: string
  trend?: "up" | "down"
  icon?: React.ReactNode
  status?: "success" | "warning" | "danger"
}

function MiniStatCard({ title, value, change, trend, icon, status = "success" }: MiniStatProps) {
  const statusColors = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${statusColors[status]}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-lg font-semibold text-foreground">{value}</p>
      </div>
      {change && (
        <div className={`flex items-center gap-1 text-xs ${trend === "up" ? "text-success" : "text-danger"}`}>
          {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {change}
        </div>
      )}
    </div>
  )
}

export function KpiSection() {
  return (
    <div className="flex flex-col gap-4">
      {/* OEE Card */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            ประสิทธิภาพโดยรวม (OEE)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OEEGauge value={89} />
        </CardContent>
      </Card>

      {/* Production Chart Card */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            ผลผลิตเทียบเป้าหมาย
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductionChart />
        </CardContent>
      </Card>

      {/* Mini Stats */}
      <div className="flex flex-col gap-3">
        <MiniStatCard
          title="ยอดผลิตวันนี้"
          value="16,042 ชิ้น"
          change="+8.2%"
          trend="up"
          icon={<Package className="h-5 w-5" />}
          status="success"
        />
        <MiniStatCard
          title="อัตราของเสีย (Scrap)"
          value="2.3%"
          change="-0.5%"
          trend="up"
          icon={<AlertTriangle className="h-5 w-5" />}
          status="warning"
        />
      </div>
    </div>
  )
}
