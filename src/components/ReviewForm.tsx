import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ReviewFormProps {
  bookingId: string;
  roomId: string;
  roomName: string;
  onComplete?: () => void;
}

export function ReviewForm({ bookingId, roomId, roomName, onComplete }: ReviewFormProps) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    if (!reviewText.trim()) { toast.error("Please write a review"); return; }

    setSubmitting(true);
    const { error } = await supabase.from("room_reviews").insert({
      user_id: user.id,
      booking_id: bookingId,
      room_id: roomId,
      room_name: roomName,
      rating,
      review_text: reviewText.trim(),
    });
    setSubmitting(false);

    if (error) {
      if (error.code === "23505") toast.error("You've already reviewed this booking");
      else toast.error("Failed to submit review");
      return;
    }

    toast.success("Thank you for your review!");
    qc.invalidateQueries({ queryKey: ["room-reviews"] });
    qc.invalidateQueries({ queryKey: ["my-reviews"] });
    onComplete?.();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(n)}
              className="p-0.5"
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  n <= (hoverRating || rating) ? "text-primary fill-primary" : "text-border"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Your Review</label>
        <Textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience..."
          className="min-h-[80px] rounded-xl resize-none"
          maxLength={1000}
        />
      </div>
      <Button onClick={handleSubmit} disabled={submitting} className="w-full rounded-xl">
        {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...</> : "Submit Review"}
      </Button>
    </div>
  );
}
