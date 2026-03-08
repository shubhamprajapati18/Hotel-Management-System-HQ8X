import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronRight } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { useState, useEffect } from "react";

const statusStyles: Record<string, string> = {
  confirmed: "bg-accent/20 text-accent",
  pending: "bg-primary/20 text-primary",
  "checked-in": "bg-blue-500/20 text-blue-400",
  cancelled: "bg-destructive/20 text-destructive",
};

export default function AdminReservations() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-all-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
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

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("admin-bookings-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        queryClient.invalidateQueries({ queryKey: ["admin-all-bookings"] });
        queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const profileMap = new Map(profiles.map((p) => [p.user_id, `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Guest"]));

  const reservations = bookings.map((b) => ({
    id: b.id.slice(0, 8).toUpperCase(),
    fullId: b.id,
    guest: profileMap.get(b.user_id) || "Guest",
    room: b.room_name,
    checkIn: format(parseISO(b.check_in), "MMM d, yyyy"),
    checkOut: format(parseISO(b.check_out), "MMM d, yyyy"),
    status: b.status,
    amount: `$${Number(b.total_price).toLocaleString()}`,
  }));

  const filtered = search
    ? reservations.filter((r) =>
        r.guest.toLowerCase().includes(search.toLowerCase()) ||
        r.room.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase())
      )
    : reservations;

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Reservations</h1>
            <p className="text-muted-foreground text-sm">Manage all guest bookings ({bookings.length} total)</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                className="pl-9 bg-secondary border-border w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section overflow-x-auto">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm py-12 text-center">
            {search ? "No bookings match your search." : "No bookings found."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Guest</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Room</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Check-in</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Check-out</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.fullId} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{r.id}</td>
                  <td className="py-3 px-4 font-medium text-foreground">{r.guest}</td>
                  <td className="py-3 px-4 text-foreground/80">{r.room}</td>
                  <td className="py-3 px-4 text-muted-foreground">{r.checkIn}</td>
                  <td className="py-3 px-4 text-muted-foreground">{r.checkOut}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[r.status] || "bg-muted text-muted-foreground"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-primary">{r.amount}</td>
                  <td className="py-3 px-4"><Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </AdminLayout>
  );
}
