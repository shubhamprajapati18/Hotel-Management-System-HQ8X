import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Crown, Calendar, Gift, Percent, Tag, Eye, EyeOff } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

const iconOptions = [
  { value: "Crown", label: "Crown", Icon: Crown },
  { value: "Calendar", label: "Calendar", Icon: Calendar },
  { value: "Gift", label: "Gift", Icon: Gift },
  { value: "Percent", label: "Percent", Icon: Percent },
  { value: "Tag", label: "Tag", Icon: Tag },
];

const getIconComponent = (name: string) => {
  return iconOptions.find((o) => o.value === name)?.Icon || Gift;
};

interface OfferForm {
  title: string;
  tag: string;
  description: string;
  discount: string;
  validity: string;
  icon: string;
  active: boolean;
}

const defaultForm: OfferForm = {
  title: "",
  tag: "Special",
  description: "",
  discount: "",
  validity: "",
  icon: "Gift",
  active: true,
};

export default function AdminOffers() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<{ id: string; title: string } | null>(null);
  const [form, setForm] = useState<OfferForm>(defaultForm);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("offers").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        tag: form.tag,
        description: form.description,
        discount: form.discount,
        validity: form.validity,
        icon: form.icon,
        active: form.active,
      };

      if (editingId) {
        const { error } = await supabase.from("offers").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const maxOrder = offers.length > 0 ? Math.max(...offers.map((o) => o.sort_order)) + 1 : 0;
        const { error } = await supabase.from("offers").insert({ ...payload, sort_order: maxOrder });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      toast.success(editingId ? "Offer updated" : "Offer created");
      closeDialog();
    },
    onError: () => toast.error("Failed to save offer"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("offers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      toast.success("Offer deleted");
      setDeleteDialogOpen(false);
      setDeletingOffer(null);
    },
    onError: () => toast.error("Failed to delete offer"),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("offers").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      toast.success("Offer visibility updated");
    },
    onError: () => toast.error("Failed to update offer"),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (offer: typeof offers[0]) => {
    setEditingId(offer.id);
    setForm({
      title: offer.title,
      tag: offer.tag,
      description: offer.description,
      discount: offer.discount,
      validity: offer.validity,
      icon: offer.icon,
      active: offer.active,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Offers</h1>
            <p className="text-muted-foreground text-sm">Manage special offers and promotions ({offers.length} offers)</p>
          </div>
          <Button variant="gold" onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Offer</Button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : offers.length === 0 ? (
        <div className="admin-section text-center py-16">
          <Gift className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No offers yet. Create your first offer.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {offers.map((offer, i) => {
            const IconComp = getIconComponent(offer.icon);
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`admin-section p-6 relative ${!offer.active ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <IconComp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-primary">{offer.tag}</span>
                      <h3 className="font-heading text-lg font-semibold text-foreground">{offer.title}</h3>
                    </div>
                  </div>
                  <span className="font-heading text-xl font-semibold text-primary">{offer.discount}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-2 line-clamp-2">{offer.description}</p>
                <p className="text-xs text-muted-foreground/60 mb-4">{offer.validity}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={offer.active}
                      onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: offer.id, active: checked })}
                    />
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {offer.active ? <><Eye className="h-3 w-3" /> Visible</> : <><EyeOff className="h-3 w-3" /> Hidden</>}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(offer)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setDeletingOffer({ id: offer.id, title: offer.title }); setDeleteDialogOpen(true); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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
            <DialogTitle>{editingId ? "Edit Offer" : "Add New Offer"}</DialogTitle>
            <DialogDescription>{editingId ? "Update offer details." : "Create a new special offer."}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label>Title</Label>
              <Input className="mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="The Royal Escape" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tag</Label>
                <Input className="mt-1" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="Exclusive" />
              </div>
              <div>
                <Label>Discount Label</Label>
                <Input className="mt-1" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="25% Off" />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea className="mt-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the offer..." rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Validity</Label>
                <Input className="mt-1" value={form.validity} onChange={(e) => setForm({ ...form, validity: e.target.value })} placeholder="Valid until June 30, 2026" />
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

            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} />
              <Label>Active (visible to guests)</Label>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.title || !form.description}>
              {saveMutation.isPending ? "Saving..." : editingId ? "Update Offer" : "Create Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) { setDeleteDialogOpen(false); setDeletingOffer(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Offer</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{deletingOffer?.title}"? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeletingOffer(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={() => deletingOffer && deleteMutation.mutate(deletingOffer.id)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
