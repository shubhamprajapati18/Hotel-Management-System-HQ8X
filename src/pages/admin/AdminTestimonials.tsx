import { AdminLayout } from "@/components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

interface TestimonialForm {
  guest_name: string;
  guest_image: string;
  rating: number;
  review_text: string;
  active: boolean;
  sort_order: number;
}

const emptyForm: TestimonialForm = { guest_name: "", guest_image: "", rating: 5, review_text: "", active: true, sort_order: 0 };

export default function AdminTestimonials() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from("testimonials").update(form).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success(editId ? "Testimonial updated" : "Testimonial created");
      setDialogOpen(false);
      setEditId(null);
      setForm(emptyForm);
    },
    onError: () => toast.error("Failed to save testimonial"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Testimonial deleted");
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("testimonials").update({ active: !active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });

  const openEdit = (t: any) => {
    setEditId(t.id);
    setForm({ guest_name: t.guest_name, guest_image: t.guest_image || "", rating: t.rating, review_text: t.review_text, active: t.active, sort_order: t.sort_order });
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-medium tracking-tight text-foreground">Testimonials</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage homepage testimonials</p>
          </div>
          <Button onClick={() => { setEditId(null); setForm(emptyForm); setDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Add Testimonial
          </Button>
        </div>

        <div className="admin-section overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : testimonials.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No testimonials yet</TableCell></TableRow>
              ) : testimonials.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {t.guest_image ? (
                        <img src={t.guest_image} alt={t.guest_name} className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-semibold text-sm">
                          {t.guest_name[0]}
                        </div>
                      )}
                      <span className="text-sm font-medium">{t.guest_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3 w-3 text-primary fill-primary" />)}</div>
                  </TableCell>
                  <TableCell className="max-w-[200px]"><p className="text-sm text-muted-foreground line-clamp-2">{t.review_text}</p></TableCell>
                  <TableCell>
                    <button onClick={() => toggleActive.mutate({ id: t.id, active: t.active })} className="flex items-center gap-1.5 text-xs">
                      {t.active ? <Eye className="h-3.5 w-3.5 text-accent" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                      {t.active ? "Active" : "Hidden"}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.sort_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(t.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Add"} Testimonial</DialogTitle>
            <DialogDescription>Fill in the guest testimonial details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Guest Name *</label>
              <Input value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} placeholder="John Doe" maxLength={100} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Profile Image URL</label>
              <Input value={form.guest_image} onChange={(e) => setForm({ ...form, guest_image: e.target.value })} placeholder="https://..." maxLength={500} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Rating</label>
              <Select value={String(form.rating)} onValueChange={(v) => setForm({ ...form, rating: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((n) => <SelectItem key={n} value={String(n)}>{n} Star{n > 1 ? "s" : ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Review Text *</label>
              <Textarea value={form.review_text} onChange={(e) => setForm({ ...form, review_text: e.target.value })} placeholder="Write the review..." className="min-h-[100px]" maxLength={1000} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Sort Order</label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
            <Button
              className="w-full"
              onClick={() => saveMutation.mutate()}
              disabled={!form.guest_name.trim() || !form.review_text.trim() || saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving..." : editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
