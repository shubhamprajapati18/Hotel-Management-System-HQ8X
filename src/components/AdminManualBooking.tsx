import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { formatINR } from "@/lib/formatCurrency";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { differenceInDays, parseISO } from "date-fns";

const emptyForm = {
  guest_name: "",
  guest_email: "",
  room_id: "",
  check_in: "",
  check_out: "",
  guests: 1,
  special_requests: "",
  status: "confirmed",
  payment_status: "pending",
};

export function AdminManualBooking() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const { data: rooms = [] } = useQuery({
    queryKey: ["admin-rooms-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rooms").select("id, name, price, category");
      if (error) throw error;
      return data;
    },
  });

  const selectedRoom = rooms.find((r) => r.id === form.room_id);
  const nights = form.check_in && form.check_out ? Math.max(1, differenceInDays(parseISO(form.check_out), parseISO(form.check_in))) : 0;
  const totalPrice = selectedRoom ? selectedRoom.price * nights : 0;

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!form.guest_name || !form.room_id || !form.check_in || !form.check_out) {
        throw new Error("Please fill all required fields");
      }

      // Check if a profile exists for this guest or create a pseudo user_id
      // For admin manual bookings, we use the admin's own user to avoid auth issues,
      // but store guest name in special_requests prefix
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        room_id: form.room_id,
        room_name: selectedRoom?.name || "",
        check_in: form.check_in,
        check_out: form.check_out,
        guests: form.guests,
        total_price: totalPrice,
        status: form.status,
        payment_status: form.payment_status,
        special_requests: `[Walk-in: ${form.guest_name}${form.guest_email ? ` | ${form.guest_email}` : ""}] ${form.special_requests}`.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-calendar-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-guests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast.success("Booking created successfully");
      setOpen(false);
      setForm(emptyForm);
    },
    onError: (err: any) => toast.error(err.message || "Failed to create booking"),
  });

  return (
    <>
      <Button variant="gold" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />Manual Booking
      </Button>

      <Dialog open={open} onOpenChange={(o) => { if (!o) { setOpen(false); setForm(emptyForm); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Manual Booking</DialogTitle>
            <DialogDescription>Add a walk-in or phone booking manually</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Guest Name *</Label><Input value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} placeholder="Guest name" /></div>
              <div><Label>Guest Email</Label><Input type="email" value={form.guest_email} onChange={(e) => setForm({ ...form, guest_email: e.target.value })} placeholder="Optional" /></div>
            </div>

            <div>
              <Label>Room *</Label>
              <Select value={form.room_id} onValueChange={(v) => setForm({ ...form, room_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select a room" /></SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name} — ₹{r.price}/night ({r.category})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div><Label>Check-in *</Label><Input type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} /></div>
              <div><Label>Check-out *</Label><Input type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} /></div>
              <div><Label>Guests</Label><Input type="number" min={1} max={10} value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="checked-in">Checked In</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment</Label>
                <Select value={form.payment_status} onValueChange={(v) => setForm({ ...form, payment_status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {totalPrice > 0 && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm">
                <span className="text-muted-foreground">{nights} night{nights > 1 ? "s" : ""} × ₹{selectedRoom?.price}/night = </span>
                <span className="font-semibold text-primary">₹{totalPrice.toLocaleString()}</span>
              </div>
            )}

            <div><Label>Special Requests</Label><Textarea value={form.special_requests} onChange={(e) => setForm({ ...form, special_requests: e.target.value })} rows={2} placeholder="Any notes..." /></div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => { setOpen(false); setForm(emptyForm); }}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Creating..." : "Create Booking"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
