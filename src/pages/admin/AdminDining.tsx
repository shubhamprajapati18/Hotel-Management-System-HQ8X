import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Eye, EyeOff, UtensilsCrossed, Wine, Coffee, Cake } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

const iconOptions = [
  { value: "UtensilsCrossed", label: "Utensils", Icon: UtensilsCrossed },
  { value: "Wine", label: "Wine", Icon: Wine },
  { value: "Coffee", label: "Coffee", Icon: Coffee },
  { value: "Cake", label: "Cake", Icon: Cake },
];

export const getIconComponent = (name: string) => {
  return iconOptions.find((o) => o.value === name)?.Icon || UtensilsCrossed;
};

interface DiningForm {
  name: string;
  cuisine: string;
  icon: string;
  hours: string;
  description: string;
  highlight: string;
  location: string;
  active: boolean;
}

const defaultForm: DiningForm = {
  name: "",
  cuisine: "",
  icon: "UtensilsCrossed",
  hours: "",
  description: "",
  highlight: "",
  location: "",
  active: true,
};

export default function AdminDining() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm] = useState<DiningForm>(defaultForm);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-dining"],
    queryFn: async () => {
      const { data, error } = await supabase.from("dining_options").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        cuisine: form.cuisine,
        icon: form.icon,
        hours: form.hours,
        description: form.description,
        highlight: form.highlight,
        location: form.location,
        active: form.active,
      };
      if (editingId) {
        const { error } = await supabase.from("dining_options").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const maxOrder = items.length > 0 ? Math.max(...items.map((o) => o.sort_order)) + 1 : 0;
        const { error } = await supabase.from("dining_options").insert({ ...payload, sort_order: maxOrder });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dining"] });
      toast.success(editingId ? "Restaurant updated" : "Restaurant created");
      closeDialog();
    },
    onError: () => toast.error("Failed to save"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("dining_options").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dining"] });
      toast.success("Restaurant deleted");
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("dining_options").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dining"] });
      toast.success("Visibility updated");
    },
    onError: () => toast.error("Failed to update"),
  });

  const openCreate = () => { setEditingId(null); setForm(defaultForm); setDialogOpen(true); };
  const openEdit = (item: typeof items[0]) => {
    setEditingId(item.id);
    setForm({ name: item.name, cuisine: item.cuisine, icon: item.icon, hours: item.hours, description: item.description, highlight: item.highlight, location: item.location, active: item.active });
    setDialogOpen(true);
  };
  const closeDialog = () => { setDialogOpen(false); setEditingId(null); setForm(defaultForm); };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Dining</h1>
            <p className="text-muted-foreground text-sm">Manage restaurants and dining options ({items.length} venues)</p>
          </div>
          <Button variant="gold" onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Restaurant</Button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="admin-section text-center py-16">
          <UtensilsCrossed className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No dining options yet. Add your first restaurant.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => {
            const IconComp = getIconComponent(item.icon);
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`admin-section p-6 ${!item.active ? "opacity-60" : ""}`}>
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading text-lg font-semibold text-foreground">{item.name}</h3>
                      {item.highlight && <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.highlight}</span>}
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>{item.cuisine}</span>
                      <span>·</span>
                      <span>{item.hours}</span>
                      <span>·</span>
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Switch checked={item.active} onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: item.id, active: checked })} />
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {item.active ? <><Eye className="h-3 w-3" /> Visible</> : <><EyeOff className="h-3 w-3" /> Hidden</>}
                      </span>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setDeletingItem({ id: item.id, name: item.name }); setDeleteDialogOpen(true); }}><Trash2 className="h-3.5 w-3.5" /></Button>
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
            <DialogTitle>{editingId ? "Edit Restaurant" : "Add New Restaurant"}</DialogTitle>
            <DialogDescription>{editingId ? "Update restaurant details." : "Add a new dining venue."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Name *</Label>
              <Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="The Grand Table" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cuisine</Label>
                <Input className="mt-1" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} placeholder="International Fine Dining" />
              </div>
              <div>
                <Label>Icon</Label>
                <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="flex items-center gap-2"><opt.Icon className="h-4 w-4" />{opt.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea className="mt-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the dining experience..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hours</Label>
                <Input className="mt-1" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} placeholder="6:30 PM – 11:00 PM" />
              </div>
              <div>
                <Label>Location</Label>
                <Input className="mt-1" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Lobby Level" />
              </div>
            </div>
            <div>
              <Label>Highlight Badge</Label>
              <Input className="mt-1" value={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.value })} placeholder="Michelin-Starred" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} />
              <Label>Active (visible to guests)</Label>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name || !form.description}>
              {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) { setDeleteDialogOpen(false); setDeletingItem(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Restaurant</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{deletingItem?.name}"? This cannot be undone.</DialogDescription>
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
