import { MyStayLayout } from "@/components/MyStayLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarDays, Bed, Loader2, X, ChevronRight, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/formatCurrency";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, isBefore, isAfter, isWithinInterval } from "date-fns";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReviewForm } from "@/components/ReviewForm";
import { useState } from "react";

type Booking = {
  id: string; room_name: string; check_in: string; check_out: string;
  total_price: number; status: string; guests: number;
};

function getDisplayStatus(booking: Booking): string {
  const today = new Date();
  const checkIn = parseISO(booking.check_in);
  const checkOut = parseISO(booking.check_out);
  if (booking.status === "cancelled") return "Cancelled";
  if (isBefore(today, checkIn)) return "Upcoming";
  if (isAfter(today, checkOut)) return "Completed";
  if (isWithinInterval(today, { start: checkIn, end: checkOut })) return "Confirmed";
  return "Confirmed";
}

const statusColor: Record<string, string> = {
  Confirmed: "border-accent/30 text-accent bg-accent/10",
  Upcoming: "border-primary/30 text-primary bg-primary/10",
  Completed: "border-border text-muted-foreground bg-muted/50",
  Cancelled: "border-destructive/30 text-destructive bg-destructive/10",
};

export default function MyBookings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  // Fetch bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, room_name, check_in, check_out, total_price, status, guests")
        .eq("user_id", user!.id)
        .order("check_in", { ascending: false });
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });

  // Fetch existing reviews by this user
  const { data: myReviews = [] } = useQuery({
    queryKey: ["my-reviews", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("room_reviews").select("booking_id").eq("user_id", user!.id);
      if (error) return [];
      return data.map((r) => r.booking_id);
    },
    enabled: !!user,
  });

  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success("Booking cancelled successfully.");
    },
    onError: () => {
      toast.error("Failed to cancel booking. Please try again.");
    },
  });

  return (
    <MyStayLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
        <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-4 md:mb-5 tracking-tight">My Bookings</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 md:p-10 text-center">
            <Bed className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No bookings yet.</p>
            <Button variant="gold-outline" size="sm" asChild className="mt-4">
              <Link to="/rooms">Browse Rooms</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {bookings.map((b) => {
              const displayStatus = getDisplayStatus(b);
              return (
                <div key={b.id} className="rounded-2xl border border-border bg-card p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 hover-lift">
                  <div className="flex-1">
                    <h3 className="font-heading text-lg md:text-xl font-medium text-foreground tracking-tight">{b.room_name}</h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground tracking-wide">
                      <CalendarDays className="h-3.5 w-3.5 text-primary/40" />
                      {format(parseISO(b.check_in), "MMM d, yyyy")} — {format(parseISO(b.check_out), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <span className={cn("px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-medium border", statusColor[displayStatus] || statusColor.Confirmed)}>
                      {displayStatus}
                    </span>
                    <span className="text-lg font-heading font-semibold text-primary">{formatINR(b.total_price)}</span>
                    {(displayStatus === "Upcoming" || displayStatus === "Confirmed") && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                            <X className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel your reservation at <strong>{b.room_name}</strong> ({format(parseISO(b.check_in), "MMM d")} – {format(parseISO(b.check_out), "MMM d, yyyy")})? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                            <AlertDialogAction onClick={() => cancelBooking.mutate(b.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Cancel Booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {displayStatus === "Completed" && !myReviews.includes(b.id) && (
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8" title="Leave a review" onClick={() => setReviewBooking(b)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    )}
                    {displayStatus === "Completed" && myReviews.includes(b.id) && (
                      <span className="flex items-center gap-1 text-xs text-accent"><Star className="h-3 w-3 fill-accent" />Reviewed</span>
                    )}
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8" asChild>
                      <Link to={`/rooms/${b.room_name}`}><ChevronRight className="h-4 w-4" /></Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Review Dialog */}
      <Dialog open={!!reviewBooking} onOpenChange={(open) => !open && setReviewBooking(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Your Stay</DialogTitle>
            <DialogDescription>{reviewBooking?.room_name} — {reviewBooking && format(parseISO(reviewBooking.check_in), "MMM d")} to {reviewBooking && format(parseISO(reviewBooking.check_out), "MMM d, yyyy")}</DialogDescription>
          </DialogHeader>
          {reviewBooking && (
            <ReviewForm
              bookingId={reviewBooking.id}
              roomId={reviewBooking.id}
              roomName={reviewBooking.room_name}
              onComplete={() => setReviewBooking(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </MyStayLayout>
  );
}
