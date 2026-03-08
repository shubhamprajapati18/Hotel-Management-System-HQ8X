import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type GuestRow = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  name: string;
  email: string;
  stays: number;
  totalSpent: number;
  lastVisit: string | null;
  status: string;
};

export default function AdminGuests() {
  const [search, setSearch] = useState("");

  const { data: guests = [], isLoading } = useQuery({
    queryKey: ["admin-guests"],
    queryFn: async () => {
      // Fetch all profiles
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, created_at");
      if (pErr) throw pErr;

      // Fetch all bookings
      const { data: bookings, error: bErr } = await supabase
        .from("bookings")
        .select("user_id, total_price, check_in, check_out, status");
      if (bErr) throw bErr;

      const today = new Date().toISOString().split("T")[0];

      // Aggregate bookings per user
      const userBookings: Record<string, { stays: number; totalSpent: number; lastVisit: string | null; hasActive: boolean }> = {};
      (bookings || []).forEach((b) => {
        if (!userBookings[b.user_id]) {
          userBookings[b.user_id] = { stays: 0, totalSpent: 0, lastVisit: null, hasActive: false };
        }
        const u = userBookings[b.user_id];
        u.stays += 1;
        u.totalSpent += Number(b.total_price) || 0;
        if (!u.lastVisit || b.check_in > u.lastVisit) u.lastVisit = b.check_in;
        if (b.check_in <= today && b.check_out >= today && b.status !== "cancelled") {
          u.hasActive = true;
        }
      });

      return (profiles || []).map((p): GuestRow => {
        const agg = userBookings[p.user_id] || { stays: 0, totalSpent: 0, lastVisit: null, hasActive: false };
        const name = `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Guest";
        let status = "Past";
        if (agg.hasActive) status = "Current";
        if (agg.totalSpent >= 10000) status = "VIP";
        return {
          user_id: p.user_id,
          first_name: p.first_name,
          last_name: p.last_name,
          name,
          email: "", // email not stored in profiles
          stays: agg.stays,
          totalSpent: agg.totalSpent,
          lastVisit: agg.lastVisit,
          status,
        };
      });
    },
  });

  const filtered = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Guests</h1>
            <p className="text-muted-foreground text-sm">Guest profiles and stay history</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guests..."
              className="pl-9 bg-secondary border-border w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="admin-section text-center py-10">
          <p className="text-muted-foreground text-sm">No guests found.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Guest</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Stays</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Total Spent</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Last Visit</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.user_id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                        {g.name[0]}
                      </div>
                      <span className="font-medium text-foreground">{g.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-foreground">{g.stays}</td>
                  <td className="py-3 px-4 text-primary font-semibold">
                    ${g.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {g.lastVisit || "—"}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium ${g.status === "VIP" ? "text-primary" : g.status === "Current" ? "text-accent" : "text-muted-foreground"}`}>
                      {g.status}
                    </span>
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
