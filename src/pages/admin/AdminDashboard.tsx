import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Users, BedDouble, DollarSign, SprayCan, CalendarCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { rooms } from "@/data/rooms";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays, startOfDay, endOfDay, isWithinInterval, parseISO, addDays } from "date-fns";

const TOTAL_ROOMS = rooms.length;

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 10,
  color: "hsl(var(--foreground))",
  fontSize: 12,
  boxShadow: "0 4px 16px hsla(0, 0%, 0%, 0.08)",
};

export default function AdminDashboard() {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: serviceRequests = [], isLoading: loadingSR } = useQuery({
    queryKey: ["admin-service-requests-count"],
    queryFn: async () => {
      const { data, error } = await supabase.from("service_requests").select("id, status");
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("user_id, first_name, last_name");
      if (error) throw error;
      return data;
    },
  });

  const isLoading = loadingBookings || loadingSR;

  // KPIs
  const totalBookings = bookings.length;

  const activeBookings = bookings.filter((b) => {
    return b.check_in <= todayStr && b.check_out >= todayStr && b.status !== "cancelled";
  });
  const occupancyRate = TOTAL_ROOMS > 0 ? Math.round((activeBookings.length / TOTAL_ROOMS) * 100) : 0;
  const availableRooms = Math.max(0, TOTAL_ROOMS - activeBookings.length);

  const todayRevenue = bookings
    .filter((b) => format(new Date(b.created_at), "yyyy-MM-dd") === todayStr)
    .reduce((sum, b) => sum + Number(b.total_price), 0);

  const pendingTasks = serviceRequests.filter((sr) => sr.status === "pending").length;

  const next7 = format(addDays(today, 7), "yyyy-MM-dd");
  const upcomingCheckins = bookings.filter((b) => b.check_in >= todayStr && b.check_in <= next7 && b.status !== "cancelled").length;

  const kpis = [
    { label: "Total Bookings", value: totalBookings.toLocaleString(), change: "", icon: CalendarCheck },
    { label: "Occupancy Rate", value: `${occupancyRate}%`, change: "", icon: BedDouble, emerald: true },
    { label: "Revenue Today", value: `₹${todayRevenue.toLocaleString()}`, change: "", icon: DollarSign },
    { label: "Available Rooms", value: String(availableRooms), change: "", icon: BedDouble },
    { label: "Pending Tasks", value: String(pendingTasks), change: "", icon: SprayCan, destructive: pendingTasks > 0 },
    { label: "Upcoming Check-ins", value: String(upcomingCheckins), change: "", icon: Users, emerald: true },
  ];

  // Weekly Revenue Chart (last 7 days)
  const weeklyRevenueData = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(today, 6 - i);
    const dayStr = format(day, "yyyy-MM-dd");
    const revenue = bookings
      .filter((b) => format(new Date(b.created_at), "yyyy-MM-dd") === dayStr)
      .reduce((sum, b) => sum + Number(b.total_price), 0);
    return { day: format(day, "EEE"), revenue };
  });

  // Weekly Occupancy Chart (last 7 days)
  const occupancyData = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(today, 6 - i);
    const dayStr = format(day, "yyyy-MM-dd");
    const occupied = bookings.filter(
      (b) => b.check_in <= dayStr && b.check_out >= dayStr && b.status !== "cancelled"
    ).length;
    return { day: format(day, "EEE"), rooms: occupied };
  });

  // Recent Bookings (latest 5)
  const profileMap = new Map(profiles.map((p) => [p.user_id, `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Guest"]));

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map((b) => ({
      guest: profileMap.get(b.user_id) || "Guest",
      room: b.room_name,
      checkIn: format(parseISO(b.check_in), "MMM d"),
      checkOut: format(parseISO(b.check_out), "MMM d"),
      status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
      amount: `₹${Number(b.total_price).toLocaleString()}`,
    }));

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-1 tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mb-8 md:mb-10">Welcome back. Here's your hotel overview.</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-8 md:mb-10">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))
          : kpis.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                className="rounded-2xl border border-border bg-card p-4 md:p-5 hover-lift"
              >
                <div className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-primary/8 flex items-center justify-center mb-3 md:mb-4">
                  <kpi.icon className={`h-4 w-4 ${kpi.destructive ? "text-destructive" : kpi.emerald ? "text-accent" : "text-primary"}`} />
                </div>
                <p className="text-xl md:text-2xl font-heading font-semibold text-foreground tracking-tight">{kpi.value}</p>
                <p className="text-[10px] md:text-[11px] text-muted-foreground mt-1 tracking-wide">{kpi.label}</p>
              </motion.div>
            ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h3 className="font-heading text-lg font-medium text-foreground mb-4 md:mb-5 tracking-tight">Weekly Revenue</h3>
          {isLoading ? (
            <Skeleton className="h-[220px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h3 className="font-heading text-lg font-medium text-foreground mb-4 md:mb-5 tracking-tight">Weekly Occupancy (Rooms)</h3>
          {isLoading ? (
            <Skeleton className="h-[220px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="rooms" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }} className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <h3 className="font-heading text-lg font-medium text-foreground tracking-tight">Recent Bookings</h3>
          <Link to="/admin/reservations" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-300">
            View All →
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : recentBookings.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-[11px] font-medium text-muted-foreground tracking-wider uppercase">Guest</th>
                  <th className="pb-3 text-[11px] font-medium text-muted-foreground tracking-wider uppercase">Room</th>
                  <th className="pb-3 text-[11px] font-medium text-muted-foreground tracking-wider uppercase">Check In</th>
                  <th className="pb-3 text-[11px] font-medium text-muted-foreground tracking-wider uppercase">Check Out</th>
                  <th className="pb-3 text-[11px] font-medium text-muted-foreground tracking-wider uppercase">Status</th>
                  <th className="pb-3 text-[11px] font-medium text-muted-foreground tracking-wider uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-heading font-semibold shrink-0">
                          {b.guest[0]}
                        </div>
                        <span className="text-[13px] font-medium text-foreground">{b.guest}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-[13px] text-muted-foreground">{b.room}</td>
                    <td className="py-3.5 text-[13px] text-muted-foreground">{b.checkIn}</td>
                    <td className="py-3.5 text-[13px] text-muted-foreground">{b.checkOut}</td>
                    <td className="py-3.5">
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                        b.status === "Confirmed" ? "bg-accent/10 text-accent" :
                        b.status === "Cancelled" ? "bg-destructive/10 text-destructive" :
                        "bg-primary/10 text-primary"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-[13px] font-medium text-foreground text-right">{b.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
