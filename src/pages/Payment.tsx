import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { GuestNav } from "@/components/GuestNav";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/formatCurrency";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Users, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Payment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  const roomId = params.get("roomId") || "";
  const roomName = params.get("roomName") || "";
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = params.get("guests") || "1";
  const specialRequests = params.get("specialRequests") || "";
  const total = Number(params.get("total") || 0);
  const subtotal = Number(params.get("subtotal") || 0);
  const serviceFee = Number(params.get("serviceFee") || 0);
  const nights = Number(params.get("nights") || 0);
  const pricePerNight = Number(params.get("pricePerNight") || 0);

  if (!roomId || !roomName || !checkIn || !checkOut) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Invalid booking details.</p>
          <Link to="/rooms"><Button variant="gold-outline">Back to Rooms</Button></Link>
        </div>
      </div>
    );
  }

  const handlePaymentDone = async () => {
    if (!user) { toast.error("Please sign in first"); navigate("/login"); return; }
    setProcessing(true);

    const { data, error } = await supabase.from("bookings").insert({
      user_id: user.id,
      room_id: roomId,
      room_name: roomName,
      check_in: checkIn,
      check_out: checkOut,
      guests: parseInt(guests),
      special_requests: specialRequests || null,
      total_price: total,
      payment_status: "paid",
    }).select().single();

    setProcessing(false);
    if (error) { toast.error("Booking failed. Please try again."); return; }

    const confirmParams = new URLSearchParams({
      bookingId: data.id,
      roomName,
      checkIn,
      checkOut,
      guests,
      total: String(total),
    });
    navigate(`/booking-confirmation?${confirmParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <GuestNav />
      <div className="pt-28 pb-20 px-5 md:px-6">
        <div className="container mx-auto max-w-3xl">
          <Link to="/rooms" className="inline-flex items-center text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 mb-6">
            <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Cancel Booking
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-10">
              <p className="text-primary tracking-[0.3em] uppercase text-[11px] mb-3 font-medium">Secure Checkout</p>
              <h1 className="font-heading text-3xl md:text-4xl font-medium text-foreground tracking-tight">Complete Your Booking</h1>
              <div className="section-divider mt-5" />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-[1fr_340px] gap-8">
            {/* Booking Summary */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
              <div className="rounded-2xl border border-border bg-card p-6 md:p-7 space-y-5">
                <h2 className="font-heading text-xl font-medium text-foreground tracking-tight">Booking Details</h2>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{roomName}</p>
                      <p className="text-xs text-muted-foreground">{formatINR(pricePerNight)} per night</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CalendarDays className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{checkIn} → {checkOut}</p>
                      <p className="text-xs text-muted-foreground">{nights} night{nights > 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{guests} Guest{Number(guests) > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                </div>

                {specialRequests && (
                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">Special Requests</p>
                    <p className="text-sm text-foreground/80">{specialRequests}</p>
                  </div>
                )}

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>{formatINR(pricePerNight)} × {nights} nights</span><span>{formatINR(subtotal)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Service fee</span><span>{formatINR(serviceFee)}</span></div>
                  <div className="flex justify-between font-medium text-foreground pt-3 border-t border-border text-base">
                    <span>Total</span>
                    <span className="text-primary font-heading text-xl">{formatINR(total)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <div className="rounded-2xl border border-border bg-card p-6 md:p-7 space-y-5">
                <h2 className="font-heading text-xl font-medium text-foreground tracking-tight">Payment</h2>

                <div className="rounded-xl border border-dashed border-border p-6 text-center bg-secondary/30">
                  <ShieldCheck className="h-10 w-10 text-primary/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Simulated Payment</p>
                  <p className="text-xs text-muted-foreground/70">Payment gateway integration coming soon. Click below to simulate payment.</p>
                </div>

                <Button
                  variant="gold"
                  className="w-full py-6 rounded-xl text-sm tracking-wider uppercase font-medium"
                  onClick={handlePaymentDone}
                  disabled={processing}
                >
                  {processing ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
                  ) : (
                    <>💳 Payment Done — {formatINR(total)}</>
                  )}
                </Button>

                <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed">
                  By clicking above you agree to our terms. This is a simulated payment — no charges will be made.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
