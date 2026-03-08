import { GuestNav } from "@/components/GuestNav";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarDays, Bell, CreditCard, User, Bed, ConciergeBell, Wrench, SprayCan, Clock, ChevronRight, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, isBefore, isAfter, isWithinInterval } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Booking = {
  id: string;
  room_name: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  guests: number;
};

function getDisplayStatus(booking: Booking): string {
  const today = new Date();
  const checkIn = parseISO(booking.check_in);
  const checkOut = parseISO(booking.check_out);
  if (booking.status === "cancelled") return "Cancelled";
  if (isBefore(today, checkIn)) return "Upcoming";
  if (isAfter(today, checkOut)) return "Completed";
  if (isWithinInterval(today, { start: checkIn, end: checkOut })) return "Confirmed";
  return "Confirmed";
}

const statusColor: Record<string, string> = {
  Confirmed: "border-accent/30 text-accent bg-accent/10",
  Upcoming: "border-primary/30 text-primary bg-primary/10",
  Completed: "border-border text-muted-foreground bg-muted/50",
  Cancelled: "border-destructive/30 text-destructive bg-destructive/10",
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
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, room_name, check_in, check_out, total_price, status, guests")
        .eq("user_id", user!.id)
        .order("check_in", { ascending: false });
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });

  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success("Booking cancelled successfully.");
    },
    onError: () => {
      toast.error("Failed to cancel booking. Please try again.");
    },
  });

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
                {sideNav.map((item) => (
                  <button
                    key={item.label}
                    className={cn(
                      "flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-300",
                      item.active ? "bg-primary/8 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="space-y-8 md:space-y-10">
              {/* Quick Actions */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
                <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-4 md:mb-5 tracking-tight">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {quickActions.map((a) => (
                    <button key={a.label} onClick={a.action} className="rounded-2xl border border-border bg-card p-5 md:p-6 text-center hover-lift cursor-pointer group">
                      <div className="h-10 w-10 md:h-11 md:w-11 rounded-full bg-primary/8 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/15 transition-colors duration-300">
                        <a.icon className="h-4.5 w-4.5 md:h-5 md:w-5 text-primary" />
                      </div>
                      <p className="text-[11px] md:text-xs font-medium text-muted-foreground tracking-wide">{a.label}</p>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Bookings */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-4 md:mb-5 tracking-tight">My Bookings</h2>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-card p-8 md:p-10 text-center">
                    <Bed className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No bookings yet.</p>
                    <Button variant="gold-outline" size="sm" asChild className="mt-4">
                      <Link to="/rooms">Browse Rooms</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {bookings.map((b) => {
                      const displayStatus = getDisplayStatus(b);
                      return (
                        <div key={b.id} className="rounded-2xl border border-border bg-card p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 hover-lift">
                          <div className="flex-1">
                            <h3 className="font-heading text-lg md:text-xl font-medium text-foreground tracking-tight">{b.room_name}</h3>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground tracking-wide">
                              <CalendarDays className="h-3.5 w-3.5 text-primary/40" />
                              {format(parseISO(b.check_in), "MMM d, yyyy")} — {format(parseISO(b.check_out), "MMM d, yyyy")}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 md:gap-4">
                            <span className={cn("px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-medium border", statusColor[displayStatus] || statusColor.Confirmed)}>
                              {displayStatus}
                            </span>
                            <span className="text-lg font-heading font-semibold text-primary">${Number(b.total_price)}</span>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8" asChild>
                              <Link to={`/rooms/${b.room_name}`}>
                                <ChevronRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Notifications */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
                <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-4 md:mb-5 tracking-tight">Notifications</h2>
                <div className="rounded-2xl border border-border bg-card p-5 md:p-6 space-y-3 md:space-y-4">
                  {[
                    "Your Ocean View Suite booking is confirmed for Mar 15.",
                    "Room service menu updated — new spring specialties available.",
                    "Spa appointment available: Book your relaxation session today.",
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 md:gap-4 pb-3 md:pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="h-7 w-7 rounded-full bg-primary/8 flex items-center justify-center mt-0.5 shrink-0">
                        <Bell className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{n}</p>
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
