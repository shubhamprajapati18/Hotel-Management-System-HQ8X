import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

const occupancyTrend = [
  { month: "Jan", rate: 72 }, { month: "Feb", rate: 68 }, { month: "Mar", rate: 82 },
  { month: "Apr", rate: 78 }, { month: "May", rate: 88 }, { month: "Jun", rate: 92 },
  { month: "Jul", rate: 95 }, { month: "Aug", rate: 93 }, { month: "Sep", rate: 85 },
  { month: "Oct", rate: 80 }, { month: "Nov", rate: 87 }, { month: "Dec", rate: 91 },
];

const revPAR = [
  { month: "Jan", value: 185 }, { month: "Feb", value: 172 }, { month: "Mar", value: 210 },
  { month: "Apr", value: 198 }, { month: "May", value: 245 }, { month: "Jun", value: 232 },
  { month: "Jul", value: 268 }, { month: "Aug", value: 255 }, { month: "Sep", value: 220 },
  { month: "Oct", value: 205 }, { month: "Nov", value: 238 }, { month: "Dec", value: 262 },
];

const adr = [
  { month: "Jan", value: 258 }, { month: "Feb", value: 252 }, { month: "Mar", value: 275 },
  { month: "Apr", value: 265 }, { month: "May", value: 290 }, { month: "Jun", value: 285 },
  { month: "Jul", value: 310 }, { month: "Aug", value: 298 }, { month: "Sep", value: 270 },
  { month: "Oct", value: 260 }, { month: "Nov", value: 282 }, { month: "Dec", value: 305 },
];

const chartStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" };

export default function AdminReports() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Reports & Analytics</h1>
        <p className="text-muted-foreground text-sm mb-8">Performance metrics and trends</p>
      </motion.div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Avg. Occupancy", value: "87%", sub: "Last 12 months" },
          { label: "ADR", value: "$279", sub: "Average Daily Rate" },
          { label: "RevPAR", value: "$224", sub: "Revenue Per Available Room" },
          { label: "Total Revenue", value: "$684K", sub: "YTD" },
        ].map((k) => (
          <div key={k.label} className="kpi-card text-center">
            <p className="text-2xl font-bold text-primary">{k.value}</p>
            <p className="text-xs text-foreground font-medium mt-1">{k.label}</p>
            <p className="text-xs text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Occupancy Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={occupancyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={chartStyle} />
              <Area type="monotone" dataKey="rate" fill="hsla(43, 76%, 52%, 0.15)" stroke="hsl(var(--primary))" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="admin-section">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">RevPAR Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revPAR}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
              <XAxis dataKey="month" stroke="hsl(220 9% 56%)" fontSize={12} />
              <YAxis stroke="hsl(220 9% 56%)" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={chartStyle} />
              <Line type="monotone" dataKey="value" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={{ fill: "hsl(142 71% 45%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="admin-section lg:col-span-2">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Average Daily Rate (ADR)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={adr}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
              <XAxis dataKey="month" stroke="hsl(220 9% 56%)" fontSize={12} />
              <YAxis stroke="hsl(220 9% 56%)" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={chartStyle} />
              <Bar dataKey="value" fill="hsl(43 76% 52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
