import { MyStayLayout } from "@/components/MyStayLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SprayCan, Shirt, BedDouble, Sparkles, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

const services = [
  { icon: SprayCan, label: "Room Cleaning", desc: "Standard room cleaning and sanitization" },
  { icon: BedDouble, label: "Fresh Linens", desc: "Replace bed sheets, pillowcases, and towels" },
  { icon: Shirt, label: "Laundry Service", desc: "Pickup and delivery of laundry and dry cleaning" },
  { icon: Sparkles, label: "Deep Clean", desc: "Thorough deep cleaning of the entire room" },
];

const statusColor: Record<string, string> = {
  pending: "border-primary/30 text-primary bg-primary/10",
  "in-progress": "border-accent/30 text-accent bg-accent/10",
  completed: "border-border text-muted-foreground bg-muted/50",
};

export default function Housekeeping() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["service-requests", "housekeeping", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("user_id", user!.id)
        .eq("type", "housekeeping")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitRequest = useMutation({
    mutationFn: async ({ category, description }: { category: string; description?: string }) => {
      const { error } = await supabase.from("service_requests").insert({
        user_id: user!.id,
        type: "housekeeping",
        category,
        description: description || null,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["service-requests", "housekeeping"] });
      toast.success(`${vars.category} requested! Our team is on the way.`);
      setNotes("");
    },
    onError: () => toast.error("Failed to submit request. Please try again."),
  });

  return (
    <MyStayLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
        <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-1 tracking-tight">Housekeeping</h2>
        <p className="text-sm text-muted-foreground mb-6">Request cleaning, fresh linens, laundry, or other housekeeping services.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {services.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-card p-5 md:p-6 flex items-start gap-4 hover-lift">
              <div className="h-10 w-10 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-base font-medium text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 mb-3">{item.desc}</p>
                <Button variant="gold-outline" size="sm" onClick={() => submitRequest.mutate({ category: item.label })} disabled={submitRequest.isPending}>
                  {submitRequest.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Request"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-6 mb-8">
          <h3 className="font-heading text-base font-medium text-foreground mb-3">Additional Notes</h3>
          <Textarea
            placeholder="Any specific instructions for housekeeping (e.g., preferred time, areas to focus on)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Response time: 15-30 minutes
            </div>
            <Button variant="luxury" size="sm" onClick={() => submitRequest.mutate({ category: "Custom", description: notes })} disabled={!notes.trim() || submitRequest.isPending}>
              Submit
            </Button>
          </div>
        </div>

        {/* Request History */}
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : requests.length > 0 && (
          <div>
            <h3 className="font-heading text-lg font-medium text-foreground mb-3 tracking-tight">Recent Requests</h3>
            <div className="space-y-2">
              {requests.slice(0, 10).map((r: any) => (
                <div key={r.id} className="rounded-xl border border-border bg-card px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{r.category}</p>
                    {r.description && <p className="text-xs text-muted-foreground truncate">{r.description}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{format(parseISO(r.created_at), "MMM d, h:mm a")}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-medium border ${statusColor[r.status] || statusColor.pending}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </MyStayLayout>
  );
}
