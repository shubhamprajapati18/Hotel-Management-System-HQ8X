import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Clock, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  waiting: { label: "Waiting", icon: <Clock className="h-3 w-3" />, className: "bg-primary/20 text-primary" },
  contacted: { label: "Contacted", icon: <UserPlus className="h-3 w-3" />, className: "bg-blue-500/20 text-blue-500" },
  booked: { label: "Booked", icon: <CheckCircle className="h-3 w-3" />, className: "bg-accent/20 text-accent" },
  cancelled: { label: "Cancelled", icon: <XCircle className="h-3 w-3" />, className: "bg-destructive/20 text-destructive" },
};

interface WaitlistForm {
  guest_name: string;
  guest_email: string;
  phone: string;
  room_preference: string;
  check_in_desired: string;
  check_out_desired: string;
  guests: number;
  notes: string;
  status: string;
}

const defaultForm: WaitlistForm = {
  guest_name: "", guest_email: "", phone: "", room_preference: "",
  check_in_desired: "", check_out_desired: "", guests: 1, notes: "", status: "waiting",
};

export default function AdminWaitlist() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm] = useState<WaitlistForm>(defaultForm);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-waitlist"],
    queryFn: async () => {
      const { data, error } = await supabase.from("waitlist").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = statusFilter === "all" ? items : items.filter((i) => i.status === statusFilter);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, guests: Number(form.guests) };
      if (editingId) {
        const { error } = await supabase.from("waitlist").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("waitlist").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-waitlist"] });
      toast.success(editingId ? "Entry updated" : "Added to waitlist");
      closeDialog();
    },
    onError: () => toast.error("Failed to save"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("waitlist").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-waitlist"] });
      toast.success("Removed from waitlist");
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("waitlist").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-waitlist"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update"),
  });

  const openCreate = () => { setEditingId(null); setForm(defaultForm); setDialogOpen(true); };
  const openEdit = (item: typeof items[0]) => {
    setEditingId(item.id);
    setForm({
      guest_name: item.guest_name, guest_email: item.guest_email, phone: item.phone || "",
      room_preference: item.room_preference || "", check_in_desired: item.check_in_desired,
      check_out_desired: item.check_out_desired, guests: item.guests, notes: item.notes || "", status: item.status,
    });
    setDialogOpen(true);
  };
  const closeDialog = () => { setDialogOpen(false); setEditingId(null); setForm(defaultForm); };

  const waitingCount = items.filter((i) => i.status === "waiting").length;

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Waitlist</h1>
            <p className="text-muted-foreground text-sm">{items.length} entries · {waitingCount} waiting</p>
          </div>
          <Button variant="gold" onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Entry</Button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {["all", "waiting", "contacted", "booked", "cancelled"].map((s) => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" className="capitalize text-xs" onClick={() => setStatusFilter(s)}>
              {s === "all" ? "All" : statusConfig[s]?.label || s}
            </Button>
          ))}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="admin-section text-center py-16">
          <Clock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No waitlist entries{statusFilter !== "all" ? " with this status" : ""}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => {
            const sc = statusConfig[item.status] || statusConfig.waiting;
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="admin-section p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm">{item.guest_name}</h3>
                      <Badge className={`text-[10px] gap-1 ${sc.className}`}>{sc.icon}{sc.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.guest_email}{item.phone ? ` · ${item.phone}` : ""}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                      <span>Desired: {format(parseISO(item.check_in_desired), "MMM d")} – {format(parseISO(item.check_out_desired), "MMM d, yyyy")}</span>
                      {item.room_preference && <span>· Prefers: {item.room_preference}</span>}
                      <span>· {item.guests} guest{item.guests > 1 ? "s" : ""}</span>
                    </div>
                    {item.notes && <p className="text-xs text-muted-foreground/60 mt-1">{item.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Select value={item.status} onValueChange={(v) => updateStatusMutation.mutate({ id: item.id, status: v })}>
                      <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waiting">Waiting</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="booked">Booked</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setDeletingItem({ id: item.id, name: item.guest_name }); setDeleteDialogOpen(true); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Waitlist Entry" : "Add to Waitlist"}</DialogTitle>
            <DialogDescription>{editingId ? "Update guest details." : "Add a guest to the waitlist."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Guest Name *</Label><Input className="mt-1" value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} placeholder="Jane Doe" /></div>
              <div><Label>Email *</Label><Input className="mt-1" type="email" value={form.guest_email} onChange={(e) => setForm({ ...form, guest_email: e.target.value })} placeholder="jane@example.com" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Phone</Label><Input className="mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 0123" /></div>
              <div><Label>Room Preference</Label><Input className="mt-1" value={form.room_preference} onChange={(e) => setForm({ ...form, room_preference: e.target.value })} placeholder="Deluxe Suite" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Desired Check-in *</Label><Input className="mt-1" type="date" value={form.check_in_desired} onChange={(e) => setForm({ ...form, check_in_desired: e.target.value })} /></div>
              <div><Label>Desired Check-out *</Label><Input className="mt-1" type="date" value={form.check_out_desired} onChange={(e) => setForm({ ...form, check_out_desired: e.target.value })} /></div>
            </div>
            <div><Label>Guests</Label><Input className="mt-1" type="number" min={1} value={form.guests} onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) || 1 })} /></div>
            <div><Label>Notes</Label><Textarea className="mt-1" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special notes..." rows={3} /></div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.guest_name || !form.guest_email || !form.check_in_desired || !form.check_out_desired}>
              {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Add to Waitlist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) { setDeleteDialogOpen(false); setDeletingItem(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove from Waitlist</DialogTitle>
            <DialogDescription>Remove "{deletingItem?.name}" from the waitlist?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeletingItem(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={() => deletingItem && deleteMutation.mutate(deletingItem.id)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
