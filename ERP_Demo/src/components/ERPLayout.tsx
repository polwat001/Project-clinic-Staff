import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Truck, Calculator,
  ChevronDown, ChevronRight, Menu, X, BarChart3, FileText,
  ArrowRightLeft, MapPin, ClipboardList, Receipt, BookOpen, DollarSign
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; path: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { label: "แดชบอร์ด", icon: LayoutDashboard, path: "/" },
  {
    label: "คลังสินค้า", icon: Package, children: [
      { label: "สินค้าคงเหลือ", path: "/inventory", icon: Package },
      { label: "เคลื่อนไหวสต็อก", path: "/inventory/movements", icon: ArrowRightLeft },
      { label: "พิกัดจัดเก็บ", path: "/inventory/locations", icon: MapPin },
    ]
  },
  {
    label: "การขาย", icon: ShoppingCart, children: [
      { label: "ใบเสนอราคา", path: "/sales/quotations", icon: FileText },
      { label: "ใบสั่งขาย", path: "/sales/orders", icon: ClipboardList },
      { label: "ปฏิทินส่งของ", path: "/sales/calendar", icon: BarChart3 },
    ]
  },
  {
    label: "การซื้อ", icon: Truck, children: [
      { label: "ใบขอซื้อ", path: "/purchase/requests", icon: FileText },
      { label: "ใบสั่งซื้อ", path: "/purchase/orders", icon: ClipboardList },
      { label: "ปฏิทินรับของ", path: "/purchase/calendar", icon: BarChart3 },
    ]
  },
  {
    label: "บัญชี", icon: Calculator, children: [
      { label: "ลูกหนี้/เจ้าหนี้", path: "/accounting/arap", icon: Receipt },
      { label: "สมุดรายวัน", path: "/accounting/journal", icon: BookOpen },
      { label: "ต้นทุนสินค้า", path: "/accounting/costing", icon: DollarSign },
    ]
  },
];

export default function ERPLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expanded, setExpanded] = useState<string[]>(["คลังสินค้า", "การขาย", "การซื้อ", "บัญชี"]);
  const location = useLocation();

  const toggleExpand = (label: string) => {
    setExpanded(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };

  const isActive = (path?: string) => path === location.pathname;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden"}`}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            ERP
          </div>
          <div>
            <h1 className="text-sm font-semibold text-sidebar-accent-foreground">DemoERP</h1>
            <p className="text-[11px] text-sidebar-foreground">ระบบบริหารจัดการ</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {navItems.map((item) => {
            if (!item.children) {
              return (
                <Link key={item.label} to={item.path!} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive(item.path) ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground"}`}>
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            }

            const isExp = expanded.includes(item.label);
            const hasActiveChild = item.children.some(c => isActive(c.path));

            return (
              <div key={item.label}>
                <button onClick={() => toggleExpand(item.label)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${hasActiveChild ? "text-sidebar-accent-foreground" : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"}`}>
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isExp ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                {isExp && (
                  <div className="ml-4 pl-3 border-l border-sidebar-border space-y-0.5 mt-0.5">
                    {item.children.map(child => (
                      <Link key={child.path} to={child.path} className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] transition-colors ${isActive(child.path) ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"}`}>
                        <child.icon className="w-3.5 h-3.5 shrink-0" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-sidebar-border">
          <p className="text-[11px] text-sidebar-foreground">v1.0.0 Demo</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-md hover:bg-muted transition-colors">
            {sidebarOpen ? <X className="w-5 h-5 text-muted-foreground lg:hidden" /> : <Menu className="w-5 h-5 text-muted-foreground" />}
            <Menu className="w-5 h-5 text-muted-foreground hidden lg:block" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">AD</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
