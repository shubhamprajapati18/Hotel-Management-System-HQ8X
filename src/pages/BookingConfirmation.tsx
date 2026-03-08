import { useSearchParams, Link } from "react-router-dom";
import { GuestNav } from "@/components/GuestNav";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/formatCurrency";
import { motion } from "framer-motion";
import { CheckCircle2, CalendarDays, Users, ArrowRight, Home } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function BookingConfirmation() {
  const [params] = useSearchParams();

  const bookingId = params.get("bookingId") || "";
  const roomName = params.get("roomName") || "";
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = params.get("guests") || "1";
  const total = Number(params.get("total") || 0);

  return (
    <div className="min-h-screen bg-background">
      <GuestNav />
      <div className="pt-28 pb-24 px-5 md:px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-accent/10 mb-6"
            >
              <CheckCircle2 className="h-10 w-10 text-accent" />
            </motion.div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight mb-3">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
              Your reservation has been successfully placed. We look forward to welcoming you!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-medium text-foreground tracking-tight">Reservation Details</h2>
              <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">Confirmed</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Booking ID</span>
                <span className="text-sm font-mono text-foreground">{bookingId.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Room</span>
                <span className="text-sm font-medium text-foreground">{roomName}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Check-in</span>
                <span className="text-sm text-foreground">{checkIn}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Check-out</span>
                <span className="text-sm text-foreground">{checkOut}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Guests</span>
                <span className="text-sm text-foreground">{guests}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-foreground">Total Paid</span>
                <span className="text-xl font-heading font-semibold text-primary">{formatINR(total)}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/my-stay">
              <Button variant="gold" size="lg" className="text-sm tracking-wider uppercase px-8 py-5 w-full sm:w-auto">
                View My Bookings <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="gold-outline" size="lg" className="text-sm tracking-wider uppercase px-8 py-5 w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
