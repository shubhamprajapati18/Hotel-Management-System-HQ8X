import { MyStayLayout } from "@/components/MyStayLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Zap, Droplets, ThermometerSun, Wifi, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

const categories = [
  { icon: Zap, label: "Electrical", desc: "Lights, outlets, or appliances not working" },
  { icon: Droplets, label: "Plumbing", desc: "Leaks, drainage, or water pressure issues" },
  { icon: ThermometerSun, label: "HVAC", desc: "Air conditioning or heating problems" },
  { icon: Wifi, label: "Connectivity", desc: "Wi-Fi, TV, or phone issues" },
  { icon: Wrench, label: "Other", desc: "Furniture, locks, or other room issues" },
];

const statusColor: Record<string, string> = {
  pending: "border-primary/30 text-primary bg-primary/10",
  "in-progress": "border-accent/30 text-accent bg-accent/10",
  completed: "border-border text-muted-foreground bg-muted/50",
};

export default function MaintenancePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["service-requests", "maintenance", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("user_id", user!.id)
        .eq("type", "maintenance")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitRequest = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("service_requests").insert({
        user_id: user!.id,
        type: "maintenance",
        category,
        description,
        urgency,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests", "maintenance"] });
      toast.success("Maintenance request submitted! Our team will be there shortly.");
      setCategory("");
      setDescription("");
      setUrgency("");
    },
    onError: () => toast.error("Failed to submit request. Please try again."),
  });

  return (
    <MyStayLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
        <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-1 tracking-tight">Report Maintenance</h2>
        <p className="text-sm text-muted-foreground mb-6">Let us know about any issues in your room and we'll fix them promptly.</p>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-7 space-y-5 mb-8">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Issue Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setCategory(cat.label)}
                  className={`rounded-xl border p-3 text-center transition-all duration-300 ${
                    category === cat.label
                      ? "border-primary/40 bg-primary/8 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <cat.icon className="h-5 w-5 mx-auto mb-1.5" />
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Urgency</label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger><SelectValue placeholder="Select urgency level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low — Not urgent</SelectItem>
                <SelectItem value="medium">Medium — Inconvenient</SelectItem>
                <SelectItem value="high">High — Affecting my stay</SelectItem>
                <SelectItem value="emergency">Emergency — Immediate attention</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
            <Textarea
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <Button variant="luxury" onClick={() => submitRequest.mutate()} disabled={!category || !description.trim() || !urgency || submitRequest.isPending} className="w-full sm:w-auto">
            {submitRequest.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...</> : "Submit Request"}
          </Button>
        </div>

        {/* Request History */}
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : requests.length > 0 && (
          <div>
            <h3 className="font-heading text-lg font-medium text-foreground mb-3 tracking-tight">Previous Reports</h3>
            <div className="space-y-2">
              {requests.slice(0, 10).map((r: any) => (
                <div key={r.id} className="rounded-xl border border-border bg-card px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{r.category}</p>
                      {r.urgency && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">• {r.urgency}</span>}
                    </div>
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
