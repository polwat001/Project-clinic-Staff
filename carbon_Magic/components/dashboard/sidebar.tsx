"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  SlidersHorizontal,
  History,
  Settings,
  ChevronLeft,
  X,
  ClipboardList,
  Wrench,
  CheckSquare,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

const menuItems = [
  { icon: LayoutDashboard, label: "ภาพรวม", href: "/" },
  { icon: ClipboardList, label: "เตรียมการผลิต", href: "/pre-production" },
  { icon: Wrench, label: "บันทึกผลผลิต", href: "/operator" },
  { icon: CheckSquare, label: "ตรวจสอบ/อนุมัติ", href: "/approval" },
  { icon: BarChart3, label: "แดชบอร์ดวางแผน", href: "/planning" },
  { icon: SlidersHorizontal, label: "แผงควบคุม", href: "/control" },
  { icon: History, label: "ประวัติ", href: "/history" },
  { icon: Settings, label: "การตั้งค่า", href: "/settings" },
]

export function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-4">
          {!isCollapsed && (
            <span className="text-lg font-semibold text-sidebar-foreground">เมนู</span>
          )}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="hidden text-sidebar-foreground hover:bg-sidebar-accent lg:flex"
              onClick={onToggleCollapse}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1 p-">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.label} href={item.href} onClick={onClose}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start py-6 flex items-center gap-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-xl",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-lg bg-sidebar-accent/50 p-3">
              <p className="text-xs text-sidebar-foreground/70">เวอร์ชัน</p>
              <p className="text-sm font-medium text-sidebar-foreground">v2.4.1</p>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
