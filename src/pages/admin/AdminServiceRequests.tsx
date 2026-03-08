import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Loader2, ConciergeBell, SprayCan, Wrench, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";

const typeIcon: Record<string, typeof ConciergeBell> = {
  room_service: ConciergeBell,
  housekeeping: SprayCan,
  maintenance: Wrench,
};

const typeLabel: Record<string, string> = {
  room_service: "Room Service",
  housekeeping: "Housekeeping",
  maintenance: "Maintenance",
};

const statusColor: Record<string, string> = {
  pending: "border-primary/30 text-primary bg-primary/10",
  "in-progress": "border-accent/30 text-accent bg-accent/10",
  completed: "border-border text-muted-foreground bg-muted/50",
};

const statusIcon: Record<string, typeof Clock> = {
  pending: Clock,
  "in-progress": AlertCircle,
  completed: CheckCircle2,
};

export default function AdminServiceRequests() {
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-service-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch guest profiles for all unique user_ids
      const userIds = [...new Set((data || []).map((r: any) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", userIds);

      const profileMap: Record<string, { first_name: string | null; last_name: string | null }> = {};
      (profiles || []).forEach((p: any) => { profileMap[p.user_id] = p; });

      return (data || []).map((r: any) => ({
        ...r,
        guest_name: profileMap[r.user_id]
          ? `${profileMap[r.user_id].first_name || ""} ${profileMap[r.user_id].last_name || ""}`.trim() || "Guest"
          : "Guest",
      }));
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("service_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-requests"] });
      toast.success("Status updated.");
    },
    onError: () => toast.error("Failed to update status."),
  });

  const filtered = requests.filter((r: any) => {
    if (filterType !== "all" && r.type !== filterType) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  const counts = {
    pending: requests.filter((r: any) => r.status === "pending").length,
    "in-progress": requests.filter((r: any) => r.status === "in-progress").length,
    completed: requests.filter((r: any) => r.status === "completed").length,
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6 md:mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-medium text-foreground tracking-tight">Service Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage guest room service, housekeeping, and maintenance requests.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Pending", count: counts.pending, color: "text-primary", bg: "bg-primary/8" },
            { label: "In Progress", count: counts["in-progress"], color: "text-accent", bg: "bg-accent/8" },
            { label: "Completed", count: counts.completed, color: "text-muted-foreground", bg: "bg-muted/50" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4 md:p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={cn("font-heading text-2xl font-semibold mt-1", s.color)}>{s.count}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="room_service">Room Service</SelectItem>
              <SelectItem value="housekeeping">Housekeeping</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground text-sm">No service requests found.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="hidden md:grid grid-cols-[1fr_120px_120px_100px_140px_140px] gap-3 px-5 py-3 bg-secondary/50 text-[11px] font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
              <span>Details</span>
              <span>Type</span>
              <span>Category</span>
              <span>Urgency</span>
              <span>Date</span>
              <span>Status</span>
            </div>
            {filtered.map((r: any) => {
              const Icon = typeIcon[r.type] || ConciergeBell;
              return (
                <div key={r.id} className="grid md:grid-cols-[1fr_120px_120px_100px_140px_140px] gap-2 md:gap-3 px-5 py-4 border-b border-border last:border-0 items-center">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{r.description || r.category}</p>
                    <p className="text-xs text-muted-foreground truncate">User: {r.user_id.slice(0, 8)}…</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-primary/60" />
                    <span className="text-xs text-foreground">{typeLabel[r.type] || r.type}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.category}</span>
                  <span className={cn("text-xs font-medium capitalize", r.urgency === "emergency" || r.urgency === "high" ? "text-destructive" : "text-muted-foreground")}>
                    {r.urgency || "—"}
                  </span>
                  <span className="text-xs text-muted-foreground">{format(parseISO(r.created_at), "MMM d, h:mm a")}</span>
                  <Select
                    value={r.status}
                    onValueChange={(val) => updateStatus.mutate({ id: r.id, status: val })}
                  >
                    <SelectTrigger className={cn("h-8 text-[11px] rounded-lg border", statusColor[r.status] || statusColor.pending)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
