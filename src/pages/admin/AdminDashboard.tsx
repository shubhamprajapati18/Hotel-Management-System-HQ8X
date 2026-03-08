import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { TrendingUp, Users, BedDouble, DollarSign, SprayCan, CalendarCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const kpis = [
  { label: "Total Bookings", value: "1,248", change: "+12%", icon: CalendarCheck },
  { label: "Occupancy Rate", value: "87%", change: "+5%", icon: BedDouble, emerald: true },
  { label: "Revenue Today", value: "$24,580", change: "+8%", icon: DollarSign },
  { label: "Available Rooms", value: "23", change: "", icon: BedDouble },
  { label: "Pending Tasks", value: "7", change: "-3", icon: SprayCan, destructive: true },
  { label: "Upcoming Check-ins", value: "15", change: "", icon: Users, emerald: true },
];

const revenueData = [
  { month: "Jan", revenue: 42000 }, { month: "Feb", revenue: 38000 }, { month: "Mar", revenue: 55000 },
  { month: "Apr", revenue: 48000 }, { month: "May", revenue: 62000 }, { month: "Jun", revenue: 58000 },
  { month: "Jul", revenue: 71000 }, { month: "Aug", revenue: 68000 }, { month: "Sep", revenue: 54000 },
  { month: "Oct", revenue: 49000 }, { month: "Nov", revenue: 63000 }, { month: "Dec", revenue: 72000 },
];

const occupancyData = [
  { day: "Mon", rate: 78 }, { day: "Tue", rate: 82 }, { day: "Wed", rate: 85 },
  { day: "Thu", rate: 90 }, { day: "Fri", rate: 95 }, { day: "Sat", rate: 98 }, { day: "Sun", rate: 88 },
];

const roomTypeData = [
  { name: "Suite", value: 35, color: "hsl(43, 76%, 46%)" },
  { name: "Deluxe", value: 45, color: "hsl(142, 60%, 40%)" },
  { name: "Penthouse", value: 20, color: "hsl(240, 5%, 65%)" },
];

const recentBookings = [
  { guest: "Sarah Chen", room: "Ocean View Suite", checkIn: "Mar 15", status: "Confirmed" },
  { guest: "Michael Ross", room: "City Skyline Deluxe", checkIn: "Mar 16", status: "Pending" },
  { guest: "Emma Watson", room: "Royal Penthouse", checkIn: "Mar 17", status: "Confirmed" },
  { guest: "David Kim", room: "Garden Retreat Suite", checkIn: "Mar 18", status: "Confirmed" },
];

const tooltipStyle = {
  background: "hsl(0, 0%, 100%)",
  border: "1px solid hsl(40, 10%, 90%)",
  borderRadius: 10,
  color: "hsl(240, 10%, 10%)",
  fontSize: 12,
  boxShadow: "0 4px 16px hsla(240, 10%, 10%, 0.08)",
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
          <h3 className="font-heading text-lg font-medium text-foreground mb-4 md:mb-5 tracking-tight">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 10%, 92%)" />
              <XAxis dataKey="month" stroke="hsl(240, 5%, 60%)" fontSize={11} />
              <YAxis stroke="hsl(240, 5%, 60%)" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="revenue" fill="hsl(43, 76%, 46%)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h3 className="font-heading text-lg font-medium text-foreground mb-4 md:mb-5 tracking-tight">Weekly Occupancy</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 10%, 92%)" />
              <XAxis dataKey="day" stroke="hsl(240, 5%, 60%)" fontSize={11} />
              <YAxis stroke="hsl(240, 5%, 60%)" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rate" stroke="hsl(142, 60%, 40%)" strokeWidth={2} dot={{ fill: "hsl(142, 60%, 40%)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }} className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h3 className="font-heading text-lg font-medium text-foreground mb-4 md:mb-5 tracking-tight">Room Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={roomTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3} strokeWidth={0}>
                {roomTypeData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 md:gap-5 mt-2">
            {roomTypeData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="rounded-2xl border border-border bg-card p-5 md:p-6 lg:col-span-2">
          <h3 className="font-heading text-lg font-medium text-foreground mb-4 md:mb-5 tracking-tight">Recent Bookings</h3>
          <div className="space-y-2.5">
            {recentBookings.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3 md:p-3.5 rounded-xl bg-secondary/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-heading font-semibold">
                    {b.guest[0]}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{b.guest}</p>
                    <p className="text-[11px] text-muted-foreground">{b.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-muted-foreground">{b.checkIn}</p>
                  <span className={`text-[11px] font-medium ${b.status === "Confirmed" ? "text-accent" : "text-primary"}`}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
