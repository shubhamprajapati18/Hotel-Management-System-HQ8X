import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { TrendingUp, Users, BedDouble, DollarSign, SprayCan, CalendarCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const kpis = [
  { label: "Total Bookings", value: "1,248", change: "+12%", icon: CalendarCheck, color: "text-primary" },
  { label: "Occupancy Rate", value: "87%", change: "+5%", icon: BedDouble, color: "text-accent" },
  { label: "Revenue Today", value: "$24,580", change: "+8%", icon: DollarSign, color: "text-primary" },
  { label: "Available Rooms", value: "23", change: "", icon: BedDouble, color: "text-muted-foreground" },
  { label: "Pending Housekeeping", value: "7", change: "-3", icon: SprayCan, color: "text-destructive" },
  { label: "Upcoming Check-ins", value: "15", change: "", icon: Users, color: "text-accent" },
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
  { name: "Suite", value: 35, color: "#D4AF37" },
  { name: "Deluxe", value: 45, color: "#22C55E" },
  { name: "Penthouse", value: 20, color: "#6366F1" },
];

const recentBookings = [
  { guest: "Sarah Chen", room: "Ocean View Suite", checkIn: "Mar 15", status: "Confirmed" },
  { guest: "Michael Ross", room: "City Skyline Deluxe", checkIn: "Mar 16", status: "Pending" },
  { guest: "Emma Watson", room: "Royal Penthouse", checkIn: "Mar 17", status: "Confirmed" },
  { guest: "David Kim", room: "Garden Retreat Suite", checkIn: "Mar 18", status: "Confirmed" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm mb-8">Welcome back. Here's your hotel overview.</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="kpi-card hover-lift"
          >
            <kpi.icon className={`h-5 w-5 ${kpi.color} mb-3`} />
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            {kpi.change && <span className="text-xs text-accent mt-1 block">{kpi.change}</span>}
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="admin-section">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
              <XAxis dataKey="month" stroke="hsl(220 9% 56%)" fontSize={12} />
              <YAxis stroke="hsl(220 9% 56%)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "hsl(240 5% 10%)", border: "1px solid hsl(240 4% 20%)", borderRadius: 8, color: "#F9FAFB" }} />
              <Bar dataKey="revenue" fill="hsl(43 76% 52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="admin-section">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Weekly Occupancy</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
              <XAxis dataKey="day" stroke="hsl(220 9% 56%)" fontSize={12} />
              <YAxis stroke="hsl(220 9% 56%)" fontSize={12} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ background: "hsl(240 5% 10%)", border: "1px solid hsl(240 4% 20%)", borderRadius: 8, color: "#F9FAFB" }} />
              <Line type="monotone" dataKey="rate" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={{ fill: "hsl(142 71% 45%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Room Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="admin-section">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Room Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={roomTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                {roomTypeData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(240 5% 10%)", border: "1px solid hsl(240 4% 20%)", borderRadius: 8, color: "#F9FAFB" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {roomTypeData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="admin-section lg:col-span-2">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{b.guest[0]}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.guest}</p>
                    <p className="text-xs text-muted-foreground">{b.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{b.checkIn}</p>
                  <span className={`text-xs font-medium ${b.status === "Confirmed" ? "text-accent" : "text-primary"}`}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
