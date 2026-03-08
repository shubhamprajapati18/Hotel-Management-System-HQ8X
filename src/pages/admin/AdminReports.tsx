import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Loader2, DollarSign, BedDouble, Users, TrendingUp, Wrench, CalendarCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { exportToCSV } from "@/lib/exportCSV";
import { formatINR, formatINRShort } from "@/lib/formatCurrency";
import { format, parseISO, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval, differenceInDays, subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const chartStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))", fontSize: 12 };
const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--destructive))", "hsl(43, 76%, 62%)", "hsl(200, 70%, 50%)", "hsl(280, 60%, 55%)"];

export default function AdminReports() {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const last12Start = startOfMonth(subMonths(today, 11));

  const { data: bookings = [], isLoading: lb } = useQuery({
    queryKey: ["report-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: rooms = [], isLoading: lr } = useQuery({
    queryKey: ["report-rooms"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rooms").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: serviceRequests = [], isLoading: lsr } = useQuery({
    queryKey: ["report-service-requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("service_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: staffPayments = [] } = useQuery({
    queryKey: ["report-staff-payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff_payments").select("*").order("paid_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["report-staff"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["report-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("user_id, first_name, last_name");
      if (error) throw error;
      return data;
    },
  });

  const isLoading = lb || lr || lsr;
  const totalRooms = rooms.length || 1;

  // ---- COMPUTED METRICS ----
  const activeBookings = bookings.filter((b: any) => b.status !== "cancelled");
  const totalRevenue = activeBookings.reduce((s: number, b: any) => s + Number(b.total_price), 0);
  const avgBookingValue = activeBookings.length ? totalRevenue / activeBookings.length : 0;

  // Current occupancy
  const currentOccupied = bookings.filter((b: any) => b.check_in <= todayStr && b.check_out >= todayStr && b.status !== "cancelled").length;
  const occupancyRate = Math.round((currentOccupied / totalRooms) * 100);

  // Avg stay length
  const avgStay = activeBookings.length
    ? activeBookings.reduce((s: number, b: any) => s + Math.max(1, differenceInDays(parseISO(b.check_out), parseISO(b.check_in))), 0) / activeBookings.length
    : 0;

  // Cancellation rate
  const cancelledCount = bookings.filter((b: any) => b.status === "cancelled").length;
  const cancellationRate = bookings.length ? Math.round((cancelledCount / bookings.length) * 100) : 0;

  // Total payroll spent
  const totalPayroll = staffPayments.reduce((s: number, p: any) => s + Number(p.amount), 0);

  // ---- MONTHLY REVENUE (last 12) ----
  const months12 = eachMonthOfInterval({ start: last12Start, end: today });
  const monthlyRevenue = months12.map((m) => {
    const key = format(m, "yyyy-MM");
    const rev = activeBookings
      .filter((b: any) => format(parseISO(b.created_at), "yyyy-MM") === key)
      .reduce((s: number, b: any) => s + Number(b.total_price), 0);
    return { month: format(m, "MMM yy"), revenue: rev };
  });

  // ---- MONTHLY BOOKINGS COUNT ----
  const monthlyBookings = months12.map((m) => {
    const key = format(m, "yyyy-MM");
    const count = bookings.filter((b: any) => format(parseISO(b.created_at), "yyyy-MM") === key).length;
    const cancelled = bookings.filter((b: any) => format(parseISO(b.created_at), "yyyy-MM") === key && b.status === "cancelled").length;
    return { month: format(m, "MMM yy"), bookings: count, cancelled };
  });

  // ---- MONTHLY OCCUPANCY ----
  const monthlyOccupancy = months12.map((m) => {
    const midMonth = format(new Date(m.getFullYear(), m.getMonth(), 15), "yyyy-MM-dd");
    const occupied = bookings.filter((b: any) => b.check_in <= midMonth && b.check_out >= midMonth && b.status !== "cancelled").length;
    return { month: format(m, "MMM yy"), rate: Math.round((occupied / totalRooms) * 100) };
  });

  // ---- ROOM CATEGORY BREAKDOWN ----
  const categoryRevenue: Record<string, number> = {};
  activeBookings.forEach((b: any) => {
    const room = rooms.find((r: any) => r.id === b.room_id || r.name === b.room_name);
    const cat = room?.category || "Other";
    categoryRevenue[cat] = (categoryRevenue[cat] || 0) + Number(b.total_price);
  });
  const categoryData = Object.entries(categoryRevenue).map(([name, value]) => ({ name, value }));

  // ---- BOOKING STATUS BREAKDOWN ----
  const statusCount: Record<string, number> = {};
  bookings.forEach((b: any) => { statusCount[b.status] = (statusCount[b.status] || 0) + 1; });
  const statusData = Object.entries(statusCount).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  // ---- SERVICE REQUESTS BREAKDOWN ----
  const srByType: Record<string, number> = {};
  serviceRequests.forEach((sr: any) => { srByType[sr.type] = (srByType[sr.type] || 0) + 1; });
  const srTypeData = Object.entries(srByType).map(([name, value]) => ({ name, value }));

  const srByStatus: Record<string, number> = {};
  serviceRequests.forEach((sr: any) => { srByStatus[sr.status] = (srByStatus[sr.status] || 0) + 1; });
  const srStatusData = Object.entries(srByStatus).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  // ---- PAYROLL MONTHLY ----
  const payrollMonthly = months12.map((m) => {
    const key = format(m, "yyyy-MM");
    const total = staffPayments.filter((p: any) => p.month === key).reduce((s: number, p: any) => s + Number(p.amount), 0);
    return { month: format(m, "MMM yy"), payroll: total };
  });

  // ---- DAILY REVENUE (last 30 days) ----
  const dailyRevenue = Array.from({ length: 30 }, (_, i) => {
    const day = subDays(today, 29 - i);
    const dayStr = format(day, "yyyy-MM-dd");
    const rev = activeBookings
      .filter((b: any) => format(parseISO(b.created_at), "yyyy-MM-dd") === dayStr)
      .reduce((s: number, b: any) => s + Number(b.total_price), 0);
    return { day: format(day, "MMM d"), revenue: rev };
  });

  // ---- EXPORT FUNCTIONS ----
  const profileMap: Record<string, string> = {};
  profiles.forEach((p: any) => { profileMap[p.user_id] = `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Guest"; });

  const exportRevenueReport = () => {
    exportToCSV(monthlyRevenue.map((m) => ({ Month: m.month, Revenue: m.revenue })), `revenue-report-${format(today, "yyyy-MM-dd")}`);
  };

  const exportBookingsReport = () => {
    exportToCSV(bookings.map((b: any) => ({
      Guest: profileMap[b.user_id] || "Guest", Room: b.room_name, "Check-in": b.check_in, "Check-out": b.check_out,
      Status: b.status, "Payment Status": b.payment_status, Amount: Number(b.total_price),
      "Booked On": format(parseISO(b.created_at), "yyyy-MM-dd"),
    })), `bookings-report-${format(today, "yyyy-MM-dd")}`);
  };

  const exportServiceReport = () => {
    exportToCSV(serviceRequests.map((sr: any) => ({
      Type: sr.type, Category: sr.category, Status: sr.status, Urgency: sr.urgency || "N/A",
      Description: sr.description || "", "Created At": format(parseISO(sr.created_at), "yyyy-MM-dd"),
    })), `service-requests-report-${format(today, "yyyy-MM-dd")}`);
  };

  const exportPayrollReport = () => {
    const staffMap: Record<string, string> = {};
    staff.forEach((s: any) => { staffMap[s.id] = s.name; });
    exportToCSV(staffPayments.map((p: any) => ({
      Staff: staffMap[p.staff_id] || "Unknown", Month: p.month, Amount: Number(p.amount),
      "Paid At": format(parseISO(p.paid_at), "yyyy-MM-dd HH:mm"), Notes: p.notes || "",
    })), `payroll-report-${format(today, "yyyy-MM-dd")}`);
  };

  const exportFullReport = () => {
    const rows = monthlyRevenue.map((m, i) => ({
      Month: m.month,
      Revenue: m.revenue,
      Bookings: monthlyBookings[i]?.bookings || 0,
      Cancelled: monthlyBookings[i]?.cancelled || 0,
      "Occupancy %": monthlyOccupancy[i]?.rate || 0,
      Payroll: payrollMonthly[i]?.payroll || 0,
      "Net (Revenue - Payroll)": m.revenue - (payrollMonthly[i]?.payroll || 0),
    }));
    exportToCSV(rows, `full-report-${format(today, "yyyy-MM-dd")}`);
  };

  const kpis = [
    { icon: DollarSign, value: `₹${totalRevenue.toLocaleString()}`, label: "Total Revenue", color: "text-primary" },
    { icon: BedDouble, value: `${occupancyRate}%`, label: "Occupancy Rate", color: "text-accent" },
    { icon: CalendarCheck, value: activeBookings.length, label: "Active Bookings", color: "text-primary" },
    { icon: TrendingUp, value: `₹${Math.round(avgBookingValue).toLocaleString()}`, label: "Avg Booking Value", color: "text-accent" },
    { icon: Users, value: `${avgStay.toFixed(1)} nights`, label: "Avg Stay Length", color: "text-primary" },
    { icon: Wrench, value: `${cancellationRate}%`, label: "Cancellation Rate", color: "text-destructive" },
  ];

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Reports & Analytics</h1>
            <p className="text-muted-foreground text-sm">Performance metrics, trends & exportable reports</p>
          </div>
          <Button variant="gold" onClick={exportFullReport} disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />Full Report CSV
          </Button>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          : kpis.map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="kpi-card text-center">
              <k.icon className={`h-5 w-5 ${k.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-foreground">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </motion.div>
          ))
        }
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
            <TabsTrigger value="services">Service Requests</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>

          {/* REVENUE TAB */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={exportRevenueReport}><Download className="h-4 w-4 mr-2" />Revenue CSV</Button>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-section">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Monthly Revenue (12 months)</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={chartStyle} formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Daily Revenue (30 days)</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={4} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip contentStyle={chartStyle} formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" fill="hsla(43, 76%, 52%, 0.15)" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="admin-section">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Revenue by Room Category</h3>
                {categoryData.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-10">No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={chartStyle} formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Revenue"]} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="admin-section">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Revenue vs Payroll</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={months12.map((m, i) => ({ month: format(m, "MMM yy"), revenue: monthlyRevenue[i]?.revenue || 0, payroll: payrollMonthly[i]?.payroll || 0 }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={chartStyle} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Revenue" />
                    <Bar dataKey="payroll" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Payroll" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </TabsContent>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={exportBookingsReport}><Download className="h-4 w-4 mr-2" />Bookings CSV</Button>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-section">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Monthly Bookings</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyBookings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip contentStyle={chartStyle} />
                    <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Total" />
                    <Bar dataKey="cancelled" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Cancelled" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Booking Status Breakdown</h3>
                {statusData.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-10">No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={11}>
                        {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={chartStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            </div>
          </TabsContent>

          {/* OCCUPANCY TAB */}
          <TabsContent value="occupancy" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-section">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Monthly Occupancy Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyOccupancy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <Tooltip contentStyle={chartStyle} formatter={(v: any) => [`${v}%`, "Occupancy"]} />
                  <Area type="monotone" dataKey="rate" fill="hsla(152, 60%, 42%, 0.15)" stroke="hsl(var(--accent))" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>

          {/* SERVICE REQUESTS TAB */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={exportServiceReport}><Download className="h-4 w-4 mr-2" />Service CSV</Button>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-section">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Requests by Type</h3>
                {srTypeData.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-10">No service requests yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={srTypeData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={120} />
                      <Tooltip contentStyle={chartStyle} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Requests by Status</h3>
                {srStatusData.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-10">No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={srStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={11}>
                        {srStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={chartStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            </div>
          </TabsContent>

          {/* PAYROLL TAB */}
          <TabsContent value="payroll" className="space-y-6">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={exportPayrollReport}><Download className="h-4 w-4 mr-2" />Payroll CSV</Button>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-section">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Monthly Payroll Expenses</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={payrollMonthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={chartStyle} formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Payroll"]} />
                    <Bar dataKey="payroll" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Payroll Summary</h3>
                <div className="space-y-4 py-4">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Total Staff</span>
                    <span className="text-lg font-bold text-foreground">{staff.length}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Active Staff</span>
                    <span className="text-lg font-bold text-accent">{staff.filter((s: any) => s.status === "Active").length}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Monthly Payroll Budget</span>
                    <span className="text-lg font-bold text-primary">₹{staff.filter((s: any) => s.status === "Active").reduce((s: number, st: any) => s + Number(st.salary), 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Total Paid (All Time)</span>
                    <span className="text-lg font-bold text-foreground">₹{totalPayroll.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Payments Made</span>
                    <span className="text-lg font-bold text-foreground">{staffPayments.length}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </AdminLayout>
  );
}
