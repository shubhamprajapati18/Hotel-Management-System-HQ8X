import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { DollarSign, Loader2, Download } from "lucide-react";
import { formatINR } from "@/lib/formatCurrency";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/lib/exportCSV";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, startOfDay, startOfWeek, startOfMonth } from "date-fns";

export default function AdminPayments() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const userIds = [...new Set((data || []).map((b) => b.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", userIds);

      const profileMap: Record<string, string> = {};
      (profiles || []).forEach((p) => {
        profileMap[p.user_id] = `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Guest";
      });

      return (data || []).map((b) => ({
        ...b,
        guest_name: profileMap[b.user_id] || "Guest",
      }));
    },
  });

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);

  const revenueToday = bookings
    .filter((b) => new Date(b.created_at) >= todayStart && b.status !== "cancelled")
    .reduce((s, b) => s + Number(b.total_price), 0);

  const revenueWeek = bookings
    .filter((b) => new Date(b.created_at) >= weekStart && b.status !== "cancelled")
    .reduce((s, b) => s + Number(b.total_price), 0);

  const revenueMonth = bookings
    .filter((b) => new Date(b.created_at) >= monthStart && b.status !== "cancelled")
    .reduce((s, b) => s + Number(b.total_price), 0);

  const pending = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((s, b) => s + Number(b.total_price), 0);

  const kpis = [
    { label: "Today", value: formatINR(revenueToday) },
    { label: "This Week", value: formatINR(revenueWeek) },
    { label: "This Month", value: formatINR(revenueMonth) },
    { label: "Pending", value: formatINR(pending) },
  ];

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Payments</h1>
            <p className="text-muted-foreground text-sm">Transaction history and revenue</p>
          </div>
          {bookings.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const csvData = bookings.map((b: any) => ({
                  Guest: b.guest_name,
                  Room: b.room_name,
                  "Check-in": b.check_in,
                  "Check-out": b.check_out,
                  Status: b.status,
                  "Payment Status": b.payment_status,
                  Amount: Number(b.total_price),
                  "Booked On": format(parseISO(b.created_at), "yyyy-MM-dd"),
                }));
                exportToCSV(csvData, `payments-${format(new Date(), "yyyy-MM-dd")}`);
              }}
            >
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card text-center">
            <DollarSign className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : bookings.length === 0 ? (
        <div className="admin-section text-center py-10">
          <p className="text-muted-foreground text-sm">No transactions yet.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Guest</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Room</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Dates</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Booked</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{b.guest_name}</td>
                  <td className="py-3 px-4 text-foreground/80">{b.room_name}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">
                    {b.check_in} → {b.check_out}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium capitalize ${
                      b.status === "cancelled" ? "text-destructive" :
                      b.status === "checked-in" ? "text-accent" :
                      "text-primary"
                    }`}>
                      {b.status}
                    </span>
                    <span className={`ml-2 text-[10px] font-medium capitalize ${
                      b.payment_status === "paid" ? "text-accent" :
                      b.payment_status === "refunded" ? "text-muted-foreground" :
                      "text-primary"
                    }`}>
                      ({b.payment_status})
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${b.status === "cancelled" ? "text-destructive" : "text-primary"}`}>
                    {formatINR(b.total_price)}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground text-xs">
                    {format(parseISO(b.created_at), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </AdminLayout>
  );
}
