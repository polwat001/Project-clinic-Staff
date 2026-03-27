"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OEEGauge } from "@/components/dashboard/oee-gauge"
import { AlertTriangle, Clock3, Gauge, TrendingUp } from "lucide-react"

interface PlanningOrder {
  id: string
  productName: string
  targetQty: number
  producedQty: number
  hourlyRate: number
  dueAt: string
  line: string
}

const initialOrders: PlanningOrder[] = [
  {
    id: "PO-2026-110",
    productName: "Carbon Filter Type A",
    targetQty: 5000,
    producedQty: 3120,
    hourlyRate: 190,
    dueAt: "2026-03-27T18:30:00",
    line: "Press P1",
  },
  {
    id: "PO-2026-111",
    productName: "Carbon Block B200",
    targetQty: 3000,
    producedQty: 1280,
    hourlyRate: 135,
    dueAt: "2026-03-27T17:30:00",
    line: "Press P2",
  },
  {
    id: "PO-2026-112",
    productName: "Activated Carbon X",
    targetQty: 2500,
    producedQty: 2060,
    hourlyRate: 160,
    dueAt: "2026-03-27T20:30:00",
    line: "Mixer M1",
  },
]

function getEstimatedFinish(order: PlanningOrder) {
  const remain = Math.max(0, order.targetQty - order.producedQty)
  const hours = remain === 0 ? 0 : remain / Math.max(1, order.hourlyRate)
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
}

export default function PlanningPage() {
  const [orders, setOrders] = useState<PlanningOrder[]>(initialOrders)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
      setOrders((prev) =>
        prev.map((order) => {
          if (order.producedQty >= order.targetQty) return order

          const plus = Math.floor(Math.random() * 15) + 8
          return {
            ...order,
            producedQty: Math.min(order.targetQty, order.producedQty + plus),
            hourlyRate: Math.max(80, order.hourlyRate + Math.floor(Math.random() * 8 - 3)),
          }
        })
      )
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const totalTarget = useMemo(() => orders.reduce((sum, order) => sum + order.targetQty, 0), [orders])
  const totalProduced = useMemo(() => orders.reduce((sum, order) => sum + order.producedQty, 0), [orders])
  const globalProgress = totalTarget === 0 ? 0 : Math.round((totalProduced / totalTarget) * 100)

  const avgOEE = useMemo(() => {
    const base = 82 + Math.round((globalProgress / 100) * 10)
    return Math.min(96, base)
  }, [globalProgress])

  const delayedCount = useMemo(() => {
    return orders.filter((order) => getEstimatedFinish(order).getTime() > new Date(order.dueAt).getTime()).length
  }, [orders])

  return (
    <DashboardShell>
      <div className="rounded-xl bg-white p-5 text-slate-900">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Executive Planning Dashboard</h1>
            <p className="text-sm text-slate-400">Carbon Magic Dark Mode | WIP realtime + ETA forecast</p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            LIVE {now.toLocaleTimeString("th-TH")}
          </div>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-4 ">
          <Card className="border-slate-700 bg-slate-900 text-slate-100 ">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-300">
                <Gauge className="h-4 w-4 text-emerald-400" /> OEE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mx-auto max-w-[180px]">
                <OEEGauge value={avgOEE} label="OEE" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-900 text-slate-100">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-400">ความคืบหน้ารวม</p>
              <p className="mt-1 text-3xl font-bold text-emerald-300">{globalProgress}%</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-900 text-slate-100">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-400">ยอดผลิตสะสม</p>
              <p className="mt-1 text-3xl font-bold text-sky-300">{totalProduced.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-900 text-slate-100">
            <CardContent className="pt-6">
              <p className="text-xs text-slate-400">เสี่ยงไม่ทันกำหนด</p>
              <p className="mt-1 text-3xl font-bold text-rose-300">{delayedCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-700 bg-slate-900 text-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              WIP Orders + ETA Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => {
                const progress = Math.round((order.producedQty / order.targetQty) * 100)
                const eta = getEstimatedFinish(order)
                const due = new Date(order.dueAt)
                const isLate = eta.getTime() > due.getTime()

                return (
                  <div key={order.id} className="rounded-lg border border-slate-700 bg-slate-950/60 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-mono text-sm text-slate-200">{order.id}</p>
                        <p className="text-sm text-slate-400">{order.productName} | {order.line}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={isLate ? "bg-danger text-danger-foreground" : "bg-success text-success-foreground"}>
                          {isLate ? "ETA ล่าช้า" : "ETA ทันกำหนด"}
                        </Badge>
                        {isLate && (
                          <span className="inline-flex items-center gap-1 text-xs text-rose-300">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            เตือนส่งไม่ทัน
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-2 h-3 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${isLate ? "bg-rose-500" : "bg-emerald-500"}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>

                    <div className="grid gap-2 text-xs text-slate-300 md:grid-cols-5">
                      <span>Progress: {progress}%</span>
                      <span>ผลิตแล้ว: {order.producedQty.toLocaleString()}</span>
                      <span>เป้า: {order.targetQty.toLocaleString()}</span>
                      <span>สปีดปัจจุบัน: {order.hourlyRate} ชิ้น/ชม.</span>
                      <span className={isLate ? "text-rose-300" : "text-emerald-300"}>
                        <Clock3 className="mr-1 inline h-3.5 w-3.5" /> ETA {formatTime(eta)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
