import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, BedDouble, Users, SprayCan, Wrench,
  CreditCard, BarChart3, UserCog, Settings, LogOut, ChevronLeft, Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
          "fixed top-0 left-0 h-screen z-40 flex flex-col border-r border-border transition-all duration-300",
          collapsed ? "w-[70px]" : "w-[260px]"
        )}
        style={{ background: "hsl(var(--sidebar-background))" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          {!collapsed && (
            <Link to="/admin">
              <span className="font-heading text-xl font-bold gradient-gold-text">HQ8X</span>
              <span className="text-xs text-muted-foreground ml-2">Admin</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground transition-colors">
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Link to="/">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive transition-colors w-full">
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className={cn("flex-1 transition-all duration-300", collapsed ? "ml-[70px]" : "ml-[260px]")}>
        <header className="sticky top-0 z-30 glass-panel h-16 flex items-center px-8 border-b border-border">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">A</div>
            {!collapsed && <span className="text-sm font-medium text-foreground">Admin</span>}
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
