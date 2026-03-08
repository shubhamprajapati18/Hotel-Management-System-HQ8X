import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Users, BedDouble, DollarSign, SprayCan, CalendarCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Link } from "react-router-dom";

const kpis = [
  { label: "Total Bookings", value: "1,248", change: "+12%", icon: CalendarCheck },
  { label: "Occupancy Rate", value: "87%", change: "+5%", icon: BedDouble, emerald: true },
  { label: "Revenue Today", value: "$24,580", change: "+8%", icon: DollarSign },
  { label: "Available Rooms", value: "23", change: "", icon: BedDouble },
  { label: "Pending Tasks", value: "7", change: "-3", icon: SprayCan, destructive: true },
  { label: "Upcoming Check-ins", value: "15", change: "", icon: Users, emerald: true },
];

const weeklyRevenueData = [
  { day: "Mon", revenue: 8200 },
  { day: "Tue", revenue: 7500 },
  { day: "Wed", revenue: 9100 },
  { day: "Thu", revenue: 10400 },
  { day: "Fri", revenue: 12800 },
  { day: "Sat", revenue: 14200 },
  { day: "Sun", revenue: 11300 },
];

const occupancyData = [
  { day: "Mon", rooms: 62 },
  { day: "Tue", rooms: 65 },
  { day: "Wed", rooms: 68 },
  { day: "Thu", rooms: 72 },
  { day: "Fri", rooms: 76 },
  { day: "Sat", rooms: 78 },
  { day: "Sun", rooms: 70 },
];

const recentBookings = [
  { guest: "Sarah Chen", room: "Ocean View Suite", checkIn: "Mar 15", checkOut: "Mar 18", status: "Confirmed", amount: "$2,400" },
  { guest: "Michael Ross", room: "City Skyline Deluxe", checkIn: "Mar 16", checkOut: "Mar 20", status: "Pending", amount: "$1,800" },
  { guest: "Emma Watson", room: "Royal Penthouse", checkIn: "Mar 17", checkOut: "Mar 22", status: "Confirmed", amount: "$5,200" },
  { guest: "David Kim", room: "Garden Retreat Suite", checkIn: "Mar 18", checkOut: "Mar 21", status: "Confirmed", amount: "$3,100" },
  { guest: "Lisa Park", room: "Harbour View Deluxe", checkIn: "Mar 19", checkOut: "Mar 23", status: "Pending", amount: "$2,600" },
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 10,
  color: "hsl(var(--foreground))",
  fontSize: 12,
  boxShadow: "0 4px 16px hsla(0, 0%, 0%, 0.08)",
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-1 tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mb-8 md:mb-10">Welcome back. Here's your hotel overview.</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-8 md:mb-10">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.5 }}
            className="rounded-2xl border border-border bg-card p-4 md:p-5 hover-lift"
          >
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-primary/8 flex items-center justify-center mb-3 md:mb-4">
              <kpi.icon className={`h-4 w-4 ${kpi.destructive ? 'text-destructive' : kpi.emerald ? 'text-accent' : 'text-primary'}`} />
            </div>
            <p className="text-xl md:text-2xl font-heading font-semibold text-foreground tracking-tight">{kpi.value}</p>
            <p className="text-[10px] md:text-[11px] text-muted-foreground mt-1 tracking-wide">{kpi.label}</p>
            {kpi.change && (
              <span className={`text-[10px] md:text-[11px] mt-1 block font-medium ${kpi.destructive ? 'text-destructive' : 'text-accent'}`}>
                {kpi.change}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h3 className="font-heading text-lg font-medium text-foreground mb-4 md:mb-5 tracking-tight">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h3 className="font-heading text-lg font-medium text-foreground mb-4 md:mb-5 tracking-tight">Weekly Occupancy (Rooms)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rooms" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Bookings - Full Width */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }} className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <h3 className="font-heading text-lg font-medium text-foreground tracking-tight">Recent Bookings</h3>
          <Link to="/admin/reservations" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-300">
            View All →
          </Link>
        </div>
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
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${b.status === "Confirmed" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-[13px] font-medium text-foreground text-right">{b.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
