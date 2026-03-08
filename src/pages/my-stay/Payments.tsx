import { MyStayLayout } from "@/components/MyStayLayout";
import { motion } from "framer-motion";
import { CreditCard, Loader2 } from "lucide-react";
import { formatINR } from "@/lib/formatCurrency";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

export default function Payments() {
  const { user } = useAuth();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-payments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, room_name, check_in, check_out, total_price, status, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const total = bookings.filter(b => b.status !== "cancelled").reduce((sum, b) => sum + Number(b.total_price), 0);

  return (
    <MyStayLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
        <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-1 tracking-tight">Payments</h2>
        <p className="text-sm text-muted-foreground mb-6">View your booking charges and payment history.</p>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 md:p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground tracking-wider uppercase">Total Spent</p>
            <p className="font-heading text-2xl md:text-3xl font-semibold text-primary mt-1">{formatINR(total)}</p>
          </div>
          <CreditCard className="h-8 w-8 text-primary/30" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground text-sm">No payment history yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="hidden md:grid grid-cols-[1fr_120px_100px_100px] gap-4 px-5 py-3 bg-secondary/50 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
              <span>Room</span><span>Date</span><span>Status</span><span className="text-right">Amount</span>
            </div>
            {bookings.map((b) => (
              <div key={b.id} className="grid md:grid-cols-[1fr_120px_100px_100px] gap-2 md:gap-4 px-5 py-4 border-b border-border last:border-0 items-center">
                <span className="font-medium text-foreground text-sm">{b.room_name}</span>
                <span className="text-xs text-muted-foreground">{format(parseISO(b.created_at), "MMM d, yyyy")}</span>
                <span className={`text-xs font-medium ${b.status === "cancelled" ? "text-destructive" : "text-primary"}`}>
                  {b.status === "cancelled" ? "Refunded" : "Paid"}
                </span>
                <span className={`text-sm font-heading font-semibold text-right ${b.status === "cancelled" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  ₹{Number(b.total_price)}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </MyStayLayout>
  );
}
