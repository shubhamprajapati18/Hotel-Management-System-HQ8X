import { GuestNav } from "@/components/GuestNav";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CalendarDays, Bell, CreditCard, User, Bed, ConciergeBell, Wrench, SprayCan, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const bookings = [
  { id: 1, room: "Ocean View Suite", checkIn: "Mar 15, 2026", checkOut: "Mar 19, 2026", status: "Confirmed", price: 1800 },
  { id: 2, room: "City Skyline Deluxe", checkIn: "Apr 5, 2026", checkOut: "Apr 8, 2026", status: "Upcoming", price: 960 },
  { id: 3, room: "Royal Penthouse", checkIn: "Jan 10, 2026", checkOut: "Jan 14, 2026", status: "Completed", price: 4800 },
];

const statusColor: Record<string, string> = {
  Confirmed: "bg-accent/20 text-accent",
  Upcoming: "bg-primary/20 text-primary",
  Completed: "bg-muted text-muted-foreground",
};

const quickActions = [
  { icon: SprayCan, label: "Request Housekeeping", action: () => toast.success("Housekeeping request sent!") },
  { icon: ConciergeBell, label: "Order Room Service", action: () => toast.success("Room service ordered!") },
  { icon: Wrench, label: "Report Maintenance", action: () => toast.success("Maintenance issue reported!") },
  { icon: Clock, label: "Extend Stay", action: () => toast.success("Stay extension requested!") },
];

const sideNav = [
  { icon: Bed, label: "My Bookings" },
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
      <div className="pt-28 pb-16 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-1">Welcome back</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">My Stay</h1>
          </motion.div>

          <div className="grid lg:grid-cols-[240px_1fr] gap-8">
            {/* Side Nav */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
              <div className="glass-panel rounded-xl p-4 space-y-1 sticky top-28">
                {sideNav.map((item, i) => (
                  <button
                    key={item.label}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition-colors ${
                      i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((a) => (
                    <button
                      key={a.label}
                      onClick={a.action}
                      className="glass-panel rounded-xl p-5 text-center hover-lift cursor-pointer group"
                    >
                      <a.icon className="h-6 w-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-medium text-foreground/80">{a.label}</p>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Bookings */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-4">My Bookings</h2>
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="glass-panel rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover-lift">
                      <div className="flex-1">
                        <h3 className="font-heading text-lg font-semibold text-foreground">{b.room}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {b.checkIn} — {b.checkOut}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[b.status]}`}>
                          {b.status}
                        </span>
                        <span className="text-lg font-bold text-primary">${b.price}</span>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Notifications */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Recent Notifications</h2>
                <div className="glass-panel rounded-xl p-5 space-y-3">
                  {[
                    "Your Ocean View Suite booking is confirmed for Mar 15.",
                    "Room service menu updated — new spring specialties available.",
                    "Spa appointment available: Book your relaxation session today.",
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                      <Bell className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground/80">{n}</p>
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
