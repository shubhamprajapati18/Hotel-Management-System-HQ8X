import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronRight, User, Calendar, BedDouble, DollarSign, CreditCard, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  confirmed: "bg-accent/20 text-accent",
  pending: "bg-primary/20 text-primary",
  "checked-in": "bg-blue-500/20 text-blue-400",
  cancelled: "bg-destructive/20 text-destructive",
};

const paymentStatusConfig: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
  paid: { icon: <CheckCircle2 className="h-4 w-4" />, label: "Paid", className: "bg-accent/20 text-accent border-accent/30" },
  pending: { icon: <Clock className="h-4 w-4" />, label: "Pending", className: "bg-primary/20 text-primary border-primary/30" },
  failed: { icon: <XCircle className="h-4 w-4" />, label: "Failed", className: "bg-destructive/20 text-destructive border-destructive/30" },
  refunded: { icon: <AlertCircle className="h-4 w-4" />, label: "Refunded", className: "bg-muted text-muted-foreground border-border" },
};

const statusOptions = [
  { value: "confirmed", label: "Confirmed" },
  { value: "checked-in", label: "Checked In" },
  { value: "cancelled", label: "Cancelled" },
  { value: "pending", label: "Pending" },
];

export default function AdminReservations() {
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
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

  const markPaymentMutation = useMutation({
    mutationFn: async ({ bookingId, paymentStatus }: { bookingId: string; paymentStatus: string }) => {
      const { error } = await supabase.from("bookings").update({ payment_status: paymentStatus }).eq("id", bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-bookings"] });
      toast.success("Payment status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update payment status");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-bookings"] });
      toast.success("Booking status updated");
    },
    onError: () => {
      toast.error("Failed to update booking status");
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("admin-bookings-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        queryClient.invalidateQueries({ queryKey: ["admin-all-bookings"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const profileMap = new Map(profiles.map((p) => [p.user_id, `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Guest"]));

  const reservations = bookings.map((b) => ({
    id: b.id.slice(0, 8).toUpperCase(),
    fullId: b.id,
    guest: profileMap.get(b.user_id) || "Guest",
    userId: b.user_id,
    room: b.room_name,
    roomId: b.room_id,
    checkIn: b.check_in,
    checkOut: b.check_out,
    checkInFormatted: format(parseISO(b.check_in), "MMM d, yyyy"),
    checkOutFormatted: format(parseISO(b.check_out), "MMM d, yyyy"),
    status: b.status,
    paymentStatus: b.payment_status || "pending",
    amount: Number(b.total_price),
    amountFormatted: `$${Number(b.total_price).toLocaleString()}`,
    guests: b.guests,
    specialRequests: b.special_requests,
    createdAt: format(parseISO(b.created_at), "MMM d, yyyy 'at' h:mm a"),
  }));

  const filtered = search
    ? reservations.filter((r) =>
        r.guest.toLowerCase().includes(search.toLowerCase()) ||
        r.room.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase())
      )
    : reservations;

  const selected = reservations.find((r) => r.fullId === selectedBooking);
  const paymentInfo = selected ? paymentStatusConfig[selected.paymentStatus] || paymentStatusConfig.pending : null;

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
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Payment</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const pConfig = paymentStatusConfig[r.paymentStatus] || paymentStatusConfig.pending;
                return (
                  <tr
                    key={r.fullId}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{r.id}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{r.guest}</td>
                    <td className="py-3 px-4 text-foreground/80">{r.room}</td>
                    <td className="py-3 px-4 text-muted-foreground">{r.checkInFormatted}</td>
                    <td className="py-3 px-4 text-muted-foreground">{r.checkOutFormatted}</td>
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={r.status}
                        onValueChange={(value) => updateStatusMutation.mutate({ bookingId: r.fullId, status: value })}
                      >
                        <SelectTrigger className={`w-[130px] h-7 text-xs font-medium border-0 capitalize ${statusStyles[r.status] || "bg-muted text-muted-foreground"}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="capitalize text-xs">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${pConfig.className}`}>
                        {pConfig.icon} {pConfig.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-primary">{r.amountFormatted}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(r.fullId)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Reservation Detail Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Reservation #{selected.id}</DialogTitle>
                <DialogDescription>Created {selected.createdAt}</DialogDescription>
              </DialogHeader>

              <div className="mt-2 space-y-6">
                {/* Guest Info */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{selected.guest}</p>
                    <p className="text-xs text-muted-foreground">{selected.guests} guest{selected.guests > 1 ? "s" : ""}</p>
                  </div>
                </div>

                <Separator />

                {/* Stay Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Stay Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Room</p>
                        <p className="font-medium text-foreground">{selected.room}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Check-in</p>
                        <p className="font-medium text-foreground">{selected.checkInFormatted}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Check-out</p>
                        <p className="font-medium text-foreground">{selected.checkOutFormatted}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-semibold text-primary">{selected.amountFormatted}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selected.specialRequests && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Special Requests</h3>
                      <p className="text-sm text-foreground bg-secondary/50 rounded-lg p-3">{selected.specialRequests}</p>
                    </div>
                  </>
                )}

                <Separator />

                {/* Booking Status */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Booking Status</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${statusStyles[selected.status] || "bg-muted text-muted-foreground"}`}>
                      {selected.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["confirmed", "checked-in", "cancelled"].filter(s => s !== selected.status).map((s) => (
                      <Button
                        key={s}
                        variant="outline"
                        size="sm"
                        className="capitalize"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => updateStatusMutation.mutate({ bookingId: selected.fullId, status: s })}
                      >
                        Mark as {s}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Payment Status */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment Status</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    {paymentInfo && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${paymentInfo.className}`}>
                        {paymentInfo.icon} {paymentInfo.label}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-primary ml-auto">{selected.amountFormatted}</span>
                  </div>

                  {selected.paymentStatus !== "paid" && (
                    <Button
                      className="w-full"
                      onClick={() => markPaymentMutation.mutate({ bookingId: selected.fullId, paymentStatus: "paid" })}
                      disabled={markPaymentMutation.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {markPaymentMutation.isPending ? "Updating..." : "Mark Payment as Successful"}
                    </Button>
                  )}

                  {selected.paymentStatus === "paid" && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => markPaymentMutation.mutate({ bookingId: selected.fullId, paymentStatus: "refunded" })}
                      disabled={markPaymentMutation.isPending}
                    >
                      {markPaymentMutation.isPending ? "Processing..." : "Mark as Refunded"}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
