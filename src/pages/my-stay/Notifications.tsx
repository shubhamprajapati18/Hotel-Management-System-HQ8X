import { MyStayLayout } from "@/components/MyStayLayout";
import { motion } from "framer-motion";
import { Bell, ConciergeBell, SprayCan, Wrench, Loader2, CheckCheck, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const typeIcon: Record<string, typeof Bell> = {
  service_request: ConciergeBell,
  housekeeping: SprayCan,
  maintenance: Wrench,
  info: Info,
};

export default function Notifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("guest-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  const markAllRead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user!.id)
        .eq("read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <MyStayLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-1 tracking-tight">Notifications</h2>
            <p className="text-sm text-muted-foreground">Stay updated on your reservations and hotel services.</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="gold-outline" size="sm" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}>
              <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
              Mark all read
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No notifications yet.</p>
            <p className="text-muted-foreground/60 text-xs mt-1">You'll be notified when your service requests are updated.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {notifications.map((n: any) => {
              const Icon = typeIcon[n.type] || Bell;
              return (
                <div key={n.id} className={cn(
                  "flex items-start gap-4 p-5 border-b border-border last:border-0 transition-colors",
                  !n.read && "bg-primary/[0.03]"
                )}>
                  <div className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                    !n.read ? "bg-primary/10" : "bg-secondary"
                  )}>
                    <Icon className={cn("h-4 w-4", !n.read ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm leading-relaxed", !n.read ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {n.message}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(parseISO(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!n.read && <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </MyStayLayout>
  );
}
