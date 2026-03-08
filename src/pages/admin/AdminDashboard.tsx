import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { TrendingUp, Users, BedDouble, DollarSign, SprayCan, CalendarCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const kpis = [
  { label: "Total Bookings", value: "1,248", change: "+12%", icon: CalendarCheck, accent: true },
  { label: "Occupancy Rate", value: "87%", change: "+5%", icon: BedDouble, emerald: true },
  { label: "Revenue Today", value: "$24,580", change: "+8%", icon: DollarSign, accent: true },
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
  { name: "Suite", value: 35, color: "hsl(43, 76%, 52%)" },
  { name: "Deluxe", value: 45, color: "hsl(142, 71%, 45%)" },
  { name: "Penthouse", value: 20, color: "hsl(240, 4%, 40%)" },
];

const recentBookings = [
  { guest: "Sarah Chen", room: "Ocean View Suite", checkIn: "Mar 15", status: "Confirmed" },
  { guest: "Michael Ross", room: "City Skyline Deluxe", checkIn: "Mar 16", status: "Pending" },
  { guest: "Emma Watson", room: "Royal Penthouse", checkIn: "Mar 17", status: "Confirmed" },
  { guest: "David Kim", room: "Garden Retreat Suite", checkIn: "Mar 18", status: "Confirmed" },
];

const tooltipStyle = {
  background: "hsl(240, 5%, 9%)",
  border: "1px solid hsl(240, 4%, 16%)",
  borderRadius: 12,
  color: "hsl(40, 14%, 96%)",
  fontSize: 12,
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h1 className="font-heading text-3xl font-medium text-foreground mb-1 tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mb-10">Welcome back. Here's your hotel overview.</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.6 }}
            className="rounded-2xl border border-border/40 bg-card/50 p-5 hover-lift"
          >
            <div className="h-9 w-9 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
              <kpi.icon className={`h-4.5 w-4.5 ${kpi.destructive ? 'text-destructive' : kpi.emerald ? 'text-accent' : 'text-primary'}`} />
            </div>
            <p className="text-2xl font-heading font-semibold text-foreground tracking-tight">{kpi.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1 tracking-wide">{kpi.label}</p>
            {kpi.change && (
              <span className={`text-[11px] mt-1.5 block font-medium ${kpi.destructive ? 'text-destructive' : 'text-accent'}`}>
                {kpi.change}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="rounded-2xl border border-border/40 bg-card/50 p-6"
        >
          <h3 className="font-heading text-lg font-medium text-foreground mb-5 tracking-tight">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 4%, 14%)" />
              <XAxis dataKey="month" stroke="hsl(220, 9%, 40%)" fontSize={11} />
              <YAxis stroke="hsl(220, 9%, 40%)" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="revenue" fill="hsl(43, 76%, 52%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="rounded-2xl border border-border/40 bg-card/50 p-6"
        >
          <h3 className="font-heading text-lg font-medium text-foreground mb-5 tracking-tight">Weekly Occupancy</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 4%, 14%)" />
              <XAxis dataKey="day" stroke="hsl(220, 9%, 40%)" fontSize={11} />
              <YAxis stroke="hsl(220, 9%, 40%)" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rate" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ fill: "hsl(142, 71%, 45%)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Room Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="rounded-2xl border border-border/40 bg-card/50 p-6"
        >
          <h3 className="font-heading text-lg font-medium text-foreground mb-5 tracking-tight">Room Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={roomTypeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3} strokeWidth={0}>
                {roomTypeData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-5 mt-3">
            {roomTypeData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="rounded-2xl border border-border/40 bg-card/50 p-6 lg:col-span-2"
        >
          <h3 className="font-heading text-lg font-medium text-foreground mb-5 tracking-tight">Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/20 border border-border/20">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-heading font-semibold">
                    {b.guest[0]}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{b.guest}</p>
                    <p className="text-[11px] text-muted-foreground">{b.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-muted-foreground">{b.checkIn}</p>
                  <span className={`text-[11px] font-medium ${b.status === "Confirmed" ? "text-accent" : "text-primary"}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
