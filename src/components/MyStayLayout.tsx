import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { GuestNav } from "@/components/GuestNav";
import { motion } from "framer-motion";
import { Bed, ConciergeBell, SprayCan, Wrench, CreditCard, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";

const sideNav = [
  { icon: Bed, label: "My Bookings", path: "/my-stay" },
  { icon: ConciergeBell, label: "Room Services", path: "/my-stay/room-services" },
  { icon: SprayCan, label: "Housekeeping", path: "/my-stay/housekeeping" },
  { icon: Wrench, label: "Maintenance", path: "/my-stay/maintenance" },
  { icon: CreditCard, label: "Payments", path: "/my-stay/payments" },
  { icon: Bell, label: "Notifications", path: "/my-stay/notifications" },
  { icon: User, label: "Profile", path: "/my-stay/profile" },
];

export function MyStayLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <GuestNav />
      <div className="pt-28 md:pt-32 pb-16 md:pb-20 px-5 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10 md:mb-12">
            <p className="text-primary tracking-[0.3em] uppercase text-[11px] mb-2 font-medium">Welcome back</p>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">My Stay</h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.6 }} className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-10">
            <div>
              <h2 className="font-heading text-lg md:text-xl font-medium text-foreground tracking-tight">Ready for your next getaway?</h2>
              <p className="text-sm text-muted-foreground mt-1">Explore our rooms & suites and book your perfect stay.</p>
            </div>
            <Button variant="luxury" size="lg" asChild className="shrink-0">
              <Link to="/rooms">Book Your Stay</Link>
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-[200px_1fr] gap-8 md:gap-10">
            {/* Side Nav */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="hidden lg:block">
              <div className="rounded-2xl border border-border bg-card p-2.5 space-y-0.5 sticky top-28">
                {sideNav.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-300",
                        isActive ? "bg-primary/8 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            {/* Mobile Nav */}
            <div className="lg:hidden overflow-x-auto -mx-5 px-5">
              <div className="flex gap-2 pb-2">
                {sideNav.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-300 border",
                        isActive ? "border-primary/30 bg-primary/8 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8 md:space-y-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
