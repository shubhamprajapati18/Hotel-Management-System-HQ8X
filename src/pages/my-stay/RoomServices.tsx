import { MyStayLayout } from "@/components/MyStayLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConciergeBell, Coffee, UtensilsCrossed, Wine, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

const menuItems = [
  { icon: Coffee, label: "Breakfast", desc: "Continental or full breakfast delivered to your room", price: "$35" },
  { icon: UtensilsCrossed, label: "Lunch / Dinner", desc: "Order from our fine dining menu", price: "$55+" },
  { icon: Wine, label: "Beverages", desc: "Wine, cocktails, or non-alcoholic drinks", price: "$15+" },
  { icon: ConciergeBell, label: "Special Request", desc: "Custom orders and dietary accommodations", price: "Varies" },
];

const statusColor: Record<string, string> = {
  pending: "border-primary/30 text-primary bg-primary/10",
  "in-progress": "border-accent/30 text-accent bg-accent/10",
  completed: "border-border text-muted-foreground bg-muted/50",
};

export default function RoomServices() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["service-requests", "room_service", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("user_id", user!.id)
        .eq("type", "room_service")
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
        type: "room_service",
        category,
        description: description || null,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["service-requests", "room_service"] });
      toast.success(`${vars.category} order placed! We'll deliver it shortly.`);
      setNotes("");
    },
    onError: () => toast.error("Failed to submit request. Please try again."),
  });

  return (
    <MyStayLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
        <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-1 tracking-tight">Room Services</h2>
        <p className="text-sm text-muted-foreground mb-6">Order food, beverages, or special items to your room.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {menuItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-card p-5 md:p-6 flex flex-col gap-3 hover-lift">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/8 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-medium text-foreground">{item.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <span className="text-sm font-heading font-semibold text-primary whitespace-nowrap">{item.price}</span>
              </div>
              <Button variant="gold-outline" size="sm" onClick={() => submitRequest.mutate({ category: item.label })} className="self-end" disabled={submitRequest.isPending}>
                {submitRequest.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Order Now"}
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-6 mb-8">
          <h3 className="font-heading text-base font-medium text-foreground mb-3">Custom Request</h3>
          <Textarea
            placeholder="Describe what you'd like (e.g., extra pillows, birthday cake, specific dietary needs)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Average delivery: 20-30 minutes
            </div>
            <Button variant="luxury" size="sm" onClick={() => submitRequest.mutate({ category: "Custom Request", description: notes })} disabled={!notes.trim() || submitRequest.isPending}>
              Submit Request
            </Button>
          </div>
        </div>

        {/* Request History */}
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : requests.length > 0 && (
          <div>
            <h3 className="font-heading text-lg font-medium text-foreground mb-3 tracking-tight">Recent Orders</h3>
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
