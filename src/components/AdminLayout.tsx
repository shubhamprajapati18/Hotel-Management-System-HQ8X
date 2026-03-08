import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, BedDouble, Users, SprayCan, Wrench,
  CreditCard, BarChart3, UserCog, Settings, LogOut, ChevronLeft, Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Reservations", icon: CalendarDays, path: "/admin/reservations" },
  { label: "Rooms", icon: BedDouble, path: "/admin/rooms" },
  { label: "Guests", icon: Users, path: "/admin/guests" },
  { label: "Housekeeping", icon: SprayCan, path: "/admin/housekeeping" },
  { label: "Maintenance", icon: Wrench, path: "/admin/maintenance" },
  { label: "Payments", icon: CreditCard, path: "/admin/payments" },
  { label: "Reports", icon: BarChart3, path: "/admin/reports" },
  { label: "Staff", icon: UserCog, path: "/admin/staff" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen z-40 flex flex-col border-r border-border/40 transition-all duration-500",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
        style={{ background: "hsl(var(--sidebar-background))" }}
      >
        <div className="flex items-center justify-between px-5 py-6 border-b border-border/30">
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-heading text-xl font-medium tracking-wide gradient-gold-text">HQ8X</span>
              <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/60 font-medium">Admin</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground/50 hover:text-foreground transition-colors duration-300"
          >
            {collapsed ? <Menu className="h-4.5 w-4.5" /> : <ChevronLeft className="h-4.5 w-4.5" />}
          </button>
        </div>

        <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40"
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/30">
          <Link to="/">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-muted-foreground/60 hover:text-destructive transition-colors duration-300 w-full">
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className={cn("flex-1 transition-all duration-500", collapsed ? "ml-[72px]" : "ml-[260px]")}>
        <header className="sticky top-0 z-30 h-16 flex items-center px-8 border-b border-border/30 bg-background/80 backdrop-blur-xl">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-heading font-semibold">
              A
            </div>
            {!collapsed && <span className="text-[13px] font-medium text-foreground/70">Admin</span>}
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
