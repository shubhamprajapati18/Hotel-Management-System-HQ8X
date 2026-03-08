import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Loader2, Wrench } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const priorityStyles: Record<string, string> = {
  emergency: "text-destructive bg-destructive/10",
  high: "text-destructive bg-destructive/10",
  normal: "text-primary bg-primary/10",
  low: "text-muted-foreground bg-muted",
};

const statusColor: Record<string, string> = {
  pending: "border-primary/30 text-primary bg-primary/10",
  "in-progress": "border-accent/30 text-accent bg-accent/10",
  completed: "border-border text-muted-foreground bg-muted/50",
};

export default function AdminMaintenance() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("admin-maintenance-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "service_requests" }, () => {
        queryClient.invalidateQueries({ queryKey: ["admin-maintenance"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-maintenance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("type", "maintenance")
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
      queryClient.invalidateQueries({ queryKey: ["admin-maintenance"] });
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Maintenance</h1>
            <p className="text-muted-foreground text-sm">Track and manage repair requests</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Pending", count: counts.pending, color: "text-primary" },
          { label: "In Progress", count: counts["in-progress"], color: "text-accent" },
          { label: "Completed", count: counts.completed, color: "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="kpi-card text-center">
            <p className={cn("text-2xl font-bold", s.color)}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : requests.length === 0 ? (
        <div className="admin-section text-center py-10">
          <Wrench className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No maintenance requests yet.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Guest</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Issue</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Priority</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Reported</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r: any) => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{r.guest_name}</td>
                  <td className="py-3 px-4 text-foreground/80">{r.description || r.category}</td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", priorityStyles[r.urgency || "normal"])}>
                      {r.urgency || "normal"}
                    </span>
                  </td>
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
