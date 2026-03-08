import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Loader2, SprayCan } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, parseISO } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const statusColor: Record<string, string> = {
  pending: "border-primary/30 text-primary bg-primary/10",
  "in-progress": "border-accent/30 text-accent bg-accent/10",
  completed: "border-border text-muted-foreground bg-muted/50",
};

export default function AdminHousekeeping() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("admin-housekeeping-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "service_requests" }, () => {
        queryClient.invalidateQueries({ queryKey: ["admin-housekeeping"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-housekeeping"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("type", "housekeeping")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const userIds = [...new Set((data || []).map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", userIds);

      const profileMap: Record<string, string> = {};
      (profiles || []).forEach((p) => {
        profileMap[p.user_id] = `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Guest";
      });

      return (data || []).map((r) => ({
        ...r,
        guest_name: profileMap[r.user_id] || "Guest",
      }));
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("service_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-housekeeping"] });
      toast.success("Status updated.");
    },
    onError: () => toast.error("Failed to update status."),
  });

  const counts = {
    pending: requests.filter((r) => r.status === "pending").length,
    "in-progress": requests.filter((r) => r.status === "in-progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Housekeeping</h1>
        <p className="text-muted-foreground text-sm mb-8">Track and manage cleaning requests</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Pending", count: counts.pending, color: "text-primary" },
          { label: "In Progress", count: counts["in-progress"], color: "text-accent" },
          { label: "Completed", count: counts.completed, color: "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="kpi-card text-center">
            <p className={cn("text-3xl font-bold", s.color)}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : requests.length === 0 ? (
        <div className="admin-section text-center py-10">
          <SprayCan className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No housekeeping requests yet.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Guest</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Category</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Description</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Requested</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r: any) => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{r.guest_name}</td>
                  <td className="py-3 px-4 text-foreground/80 capitalize">{r.category}</td>
                  <td className="py-3 px-4 text-muted-foreground">{r.description || "—"}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {formatDistanceToNow(parseISO(r.created_at), { addSuffix: true })}
                  </td>
                  <td className="py-3 px-4">
                    <Select value={r.status} onValueChange={(val) => updateStatus.mutate({ id: r.id, status: val })}>
                      <SelectTrigger className={cn("h-8 text-[11px] rounded-lg border w-[130px]", statusColor[r.status] || statusColor.pending)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
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
