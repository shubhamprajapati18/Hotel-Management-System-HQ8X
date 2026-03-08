import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, Mail, Clock, Eye } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminContactSubmissions() {
  const queryClient = useQueryClient();
  const [viewItem, setViewItem] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["admin-contact-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markReviewedMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").update({ status: "reviewed" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-submissions"] });
      toast.success("Marked as reviewed");
    },
    onError: () => toast.error("Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-submissions"] });
      toast.success("Submission deleted");
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const newCount = submissions.filter((s) => s.status === "new").length;

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Contact Submissions</h1>
            <p className="text-muted-foreground text-sm">
              {submissions.length} submissions · {newCount} new
            </p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
      ) : submissions.length === 0 ? (
        <div className="admin-section text-center py-16">
          <Mail className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No contact submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`admin-section p-5 cursor-pointer hover:bg-accent/30 transition-colors ${item.status === "new" ? "border-l-4 border-l-primary" : ""}`}
              onClick={() => setViewItem(item)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground text-sm truncate">{item.subject}</h3>
                    <Badge variant={item.status === "new" ? "default" : "secondary"} className="text-[10px]">
                      {item.status === "new" ? "New" : "Reviewed"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs truncate">{item.name} · {item.email}</p>
                  <p className="text-muted-foreground/60 text-xs mt-1 line-clamp-1">{item.message}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(item.created_at), "MMM d, yyyy")}
                  </span>
                  {item.status === "new" && (
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); markReviewedMutation.mutate(item.id); }}>
                      <CheckCircle className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setDeletingId(item.id); setDeleteDialogOpen(true); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewItem?.subject}</DialogTitle>
            <DialogDescription>From {viewItem?.name} ({viewItem?.email}) · {viewItem && format(new Date(viewItem.created_at), "PPpp")}</DialogDescription>
          </DialogHeader>
          <div className="mt-2 p-4 bg-secondary/50 rounded-xl text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {viewItem?.message}
          </div>
          <DialogFooter className="mt-4">
            {viewItem?.status === "new" && (
              <Button variant="outline" onClick={() => { markReviewedMutation.mutate(viewItem.id); setViewItem({ ...viewItem, status: "reviewed" }); }}>
                <CheckCircle className="h-4 w-4 mr-2" />Mark Reviewed
              </Button>
            )}
            <Button variant="destructive" onClick={() => { setDeletingId(viewItem?.id); setDeleteDialogOpen(true); setViewItem(null); }}>
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) { setDeleteDialogOpen(false); setDeletingId(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Submission</DialogTitle>
            <DialogDescription>Are you sure? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeletingId(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={() => deletingId && deleteMutation.mutate(deletingId)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
