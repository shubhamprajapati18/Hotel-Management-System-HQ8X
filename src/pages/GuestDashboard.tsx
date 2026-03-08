import { GuestNav } from "@/components/GuestNav";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CalendarDays, Bell, CreditCard, User, Bed, ConciergeBell, Wrench, SprayCan, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const bookings = [
  { id: 1, room: "Ocean View Suite", checkIn: "Mar 15, 2026", checkOut: "Mar 19, 2026", status: "Confirmed", price: 1800 },
  { id: 2, room: "City Skyline Deluxe", checkIn: "Apr 5, 2026", checkOut: "Apr 8, 2026", status: "Upcoming", price: 960 },
  { id: 3, room: "Royal Penthouse", checkIn: "Jan 10, 2026", checkOut: "Jan 14, 2026", status: "Completed", price: 4800 },
];

const statusColor: Record<string, string> = {
  Confirmed: "border-accent/30 text-accent bg-accent/10",
  Upcoming: "border-primary/30 text-primary bg-primary/10",
  Completed: "border-border text-muted-foreground bg-muted/30",
};

const quickActions = [
  { icon: SprayCan, label: "Request Housekeeping", action: () => toast.success("Housekeeping request sent!") },
  { icon: ConciergeBell, label: "Order Room Service", action: () => toast.success("Room service ordered!") },
  { icon: Wrench, label: "Report Maintenance", action: () => toast.success("Maintenance issue reported!") },
  { icon: Clock, label: "Extend Stay", action: () => toast.success("Stay extension requested!") },
];

const sideNav = [
  { icon: Bed, label: "My Bookings", active: true },
  { icon: ConciergeBell, label: "Room Services" },
  { icon: SprayCan, label: "Housekeeping" },
  { icon: Wrench, label: "Maintenance" },
  { icon: CreditCard, label: "Payments" },
  { icon: Bell, label: "Notifications" },
  { icon: User, label: "Profile" },
];

export default function GuestDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <GuestNav />
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <p className="text-primary/70 tracking-[0.3em] uppercase text-[11px] mb-2 font-medium">Welcome back</p>
            <h1 className="font-heading text-4xl md:text-5xl font-medium text-foreground tracking-tight">My Stay</h1>
          </motion.div>

          <div className="grid lg:grid-cols-[220px_1fr] gap-10">
            {/* Side Nav */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              <div className="rounded-2xl border border-border/40 bg-card/50 p-3 space-y-1 sticky top-28">
                {sideNav.map((item) => (
                  <button
                    key={item.label}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition-all duration-300",
                      item.active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="space-y-10">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7 }}
              >
                <h2 className="font-heading text-2xl font-medium text-foreground mb-5 tracking-tight">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((a) => (
                    <button
                      key={a.label}
                      onClick={a.action}
                      className="rounded-2xl border border-border/40 bg-card/50 p-6 text-center hover-lift cursor-pointer group transition-all duration-500"
                    >
                      <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-500">
                        <a.icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-xs font-medium text-foreground/60 tracking-wide">{a.label}</p>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Bookings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                <h2 className="font-heading text-2xl font-medium text-foreground mb-5 tracking-tight">My Bookings</h2>
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-border/40 bg-card/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover-lift"
                    >
                      <div className="flex-1">
                        <h3 className="font-heading text-xl font-medium text-foreground tracking-tight">{b.room}</h3>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground tracking-wide">
                          <CalendarDays className="h-3.5 w-3.5 text-primary/50" />
                          {b.checkIn} — {b.checkOut}
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className={cn("px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-medium border", statusColor[b.status])}>
                          {b.status}
                        </span>
                        <span className="text-lg font-heading font-semibold text-primary">${b.price}</span>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <h2 className="font-heading text-2xl font-medium text-foreground mb-5 tracking-tight">Notifications</h2>
                <div className="rounded-2xl border border-border/40 bg-card/50 p-6 space-y-4">
                  {[
                    "Your Ocean View Suite booking is confirmed for Mar 15.",
                    "Room service menu updated — new spring specialties available.",
                    "Spa appointment available: Book your relaxation session today.",
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b border-border/30 last:border-0 last:pb-0">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                        <Bell className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <p className="text-sm text-foreground/60 leading-relaxed">{n}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
