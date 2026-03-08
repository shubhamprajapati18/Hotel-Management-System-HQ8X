import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Users, Calendar } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

const statusStyles: Record<string, string> = {
  pending: "bg-primary/20 text-primary",
  confirmed: "bg-accent/20 text-accent",
  cancelled: "bg-destructive/20 text-destructive",
};

interface GroupForm {
  group_name: string;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  check_in: string;
  check_out: string;
  total_rooms: number;
  total_guests: number;
  notes: string;
  status: string;
}

const defaultForm: GroupForm = {
  group_name: "", organizer_name: "", organizer_email: "", organizer_phone: "",
  check_in: "", check_out: "", total_rooms: 1, total_guests: 2, notes: "", status: "pending",
};

export default function AdminGroupReservations() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm] = useState<GroupForm>(defaultForm);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["admin-group-reservations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("group_reservations").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, total_rooms: Number(form.total_rooms), total_guests: Number(form.total_guests) };
      if (editingId) {
        const { error } = await supabase.from("group_reservations").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("group_reservations").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-group-reservations"] });
      toast.success(editingId ? "Group reservation updated" : "Group reservation created");
      closeDialog();
    },
    onError: () => toast.error("Failed to save"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("group_reservations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-group-reservations"] });
      toast.success("Deleted");
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("group_reservations").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-group-reservations"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update"),
  });

  const openCreate = () => { setEditingId(null); setForm(defaultForm); setDialogOpen(true); };
  const openEdit = (g: typeof groups[0]) => {
    setEditingId(g.id);
    setForm({
      group_name: g.group_name, organizer_name: g.organizer_name, organizer_email: g.organizer_email,
      organizer_phone: g.organizer_phone || "", check_in: g.check_in, check_out: g.check_out,
      total_rooms: g.total_rooms, total_guests: g.total_guests, notes: g.notes || "", status: g.status,
    });
    setDialogOpen(true);
  };
  const closeDialog = () => { setDialogOpen(false); setEditingId(null); setForm(defaultForm); };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Group Reservations</h1>
            <p className="text-muted-foreground text-sm">Manage group bookings ({groups.length} total)</p>
          </div>
          <Button variant="gold" onClick={openCreate}><Plus className="h-4 w-4 mr-2" />New Group</Button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}</div>
      ) : groups.length === 0 ? (
        <div className="admin-section text-center py-16">
          <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No group reservations yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="admin-section p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-heading text-lg font-semibold text-foreground truncate">{g.group_name}</h3>
                      <Badge className={`text-[10px] ${statusStyles[g.status] || "bg-muted text-muted-foreground"}`}>{g.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{g.organizer_name} · {g.organizer_email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{format(parseISO(g.check_in), "MMM d")} – {format(parseISO(g.check_out), "MMM d, yyyy")}</span>
                  <span>{g.total_rooms} room{g.total_rooms > 1 ? "s" : ""}</span>
                  <span>{g.total_guests} guest{g.total_guests > 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Select value={g.status} onValueChange={(v) => updateStatusMutation.mutate({ id: g.id, status: v })}>
                    <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(g)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setDeletingItem({ id: g.id, name: g.group_name }); setDeleteDialogOpen(true); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              {g.notes && <p className="text-xs text-muted-foreground/70 mt-2 ml-14">{g.notes}</p>}
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Group Reservation" : "New Group Reservation"}</DialogTitle>
            <DialogDescription>{editingId ? "Update the group booking details." : "Create a new group booking."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Group Name *</Label>
              <Input className="mt-1" value={form.group_name} onChange={(e) => setForm({ ...form, group_name: e.target.value })} placeholder="Smith Family Reunion" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Organizer Name *</Label><Input className="mt-1" value={form.organizer_name} onChange={(e) => setForm({ ...form, organizer_name: e.target.value })} placeholder="John Smith" /></div>
              <div><Label>Email *</Label><Input className="mt-1" type="email" value={form.organizer_email} onChange={(e) => setForm({ ...form, organizer_email: e.target.value })} placeholder="john@example.com" /></div>
            </div>
            <div><Label>Phone</Label><Input className="mt-1" value={form.organizer_phone} onChange={(e) => setForm({ ...form, organizer_phone: e.target.value })} placeholder="+1 555 0123" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Check-in *</Label><Input className="mt-1" type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} /></div>
              <div><Label>Check-out *</Label><Input className="mt-1" type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Total Rooms</Label><Input className="mt-1" type="number" min={1} value={form.total_rooms} onChange={(e) => setForm({ ...form, total_rooms: parseInt(e.target.value) || 1 })} /></div>
              <div><Label>Total Guests</Label><Input className="mt-1" type="number" min={1} value={form.total_guests} onChange={(e) => setForm({ ...form, total_guests: parseInt(e.target.value) || 1 })} /></div>
            </div>
            <div><Label>Notes</Label><Textarea className="mt-1" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Special requirements..." rows={3} /></div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.group_name || !form.organizer_name || !form.organizer_email || !form.check_in || !form.check_out}>
              {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) { setDeleteDialogOpen(false); setDeletingItem(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Group Reservation</DialogTitle>
            <DialogDescription>Delete "{deletingItem?.name}"? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeletingItem(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={() => deletingItem && deleteMutation.mutate(deletingItem.id)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
