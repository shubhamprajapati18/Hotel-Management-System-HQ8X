import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, BedDouble, Users, SprayCan, Wrench,
  CreditCard, BarChart3, UserCog, Settings, LogOut, ChevronLeft, Menu, Moon, Sun, ConciergeBell, Gift, UtensilsCrossed, MessageSquare,
  CalendarRange, UsersRound, ListChecks, Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Reservations", icon: CalendarDays, path: "/admin/reservations" },
  { label: "Booking Calendar", icon: CalendarRange, path: "/admin/booking-calendar" },
  { label: "Group Bookings", icon: UsersRound, path: "/admin/group-reservations" },
  { label: "Waitlist", icon: ListChecks, path: "/admin/waitlist" },
  { label: "Rooms", icon: BedDouble, path: "/admin/rooms" },
  { label: "Guests", icon: Users, path: "/admin/guests" },
  { label: "Housekeeping", icon: SprayCan, path: "/admin/housekeeping" },
  { label: "Service Requests", icon: ConciergeBell, path: "/admin/service-requests" },
  { label: "Maintenance", icon: Wrench, path: "/admin/maintenance" },
  { label: "Payments", icon: CreditCard, path: "/admin/payments" },
  { label: "Offers", icon: Gift, path: "/admin/offers" },
  { label: "Dining", icon: UtensilsCrossed, path: "/admin/dining" },
  { label: "Contact Msgs", icon: MessageSquare, path: "/admin/contact-submissions" },
  { label: "Reports", icon: BarChart3, path: "/admin/reports" },
  { label: "Staff", icon: UserCog, path: "/admin/staff" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("admin-dark") === "true"; } catch { return false; }
  });

  useEffect(() => {
    localStorage.setItem("admin-dark", String(dark));
  }, [dark]);

  // Ensure <html> never has dark — guest pages always light
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    return () => { document.documentElement.classList.remove("dark"); };
  }, []);

  return (
    <div className={cn("min-h-screen flex", dark ? "dark bg-[hsl(240,10%,8%)]" : "bg-background")}>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen z-40 flex flex-col bg-card border-r border-border transition-all duration-400",
          collapsed ? "w-[68px]" : "w-[250px]"
        )}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-border">
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-heading text-xl font-medium tracking-wide gradient-gold-text">HQ8X</span>
              <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium">Admin</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300",
                  active
                    ? "bg-primary/8 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-[17px] w-[17px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-2.5 border-t border-border">
          <Link to="/">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-muted-foreground hover:text-destructive transition-colors duration-300 w-full">
              <LogOut className="h-[17px] w-[17px] shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className={cn("flex-1 transition-all duration-400 bg-background text-foreground", collapsed ? "ml-[68px]" : "ml-[250px]")}>
        <header className="sticky top-0 z-30 h-14 flex items-center px-6 md:px-8 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="h-8 w-8 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-heading font-semibold">A</div>
            {!collapsed && <span className="text-[13px] font-medium text-foreground/70">Admin</span>}
          </div>
        </header>
        <div className="p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}
