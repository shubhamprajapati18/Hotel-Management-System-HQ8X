import { useParams, Link } from "react-router-dom";
import { GuestNav } from "@/components/GuestNav";
import { Button } from "@/components/ui/button";
import { rooms } from "@/data/rooms";
import { motion } from "framer-motion";
import { Star, Users, Maximize2, Check, ArrowLeft, CalendarDays } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function RoomDetail() {
  const { id } = useParams();
  const room = rooms.find((r) => r.id === id);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-heading text-xl">Room not found.</p>
      </div>
    );
  }

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000)) : 0;

  return (
    <div className="min-h-screen bg-background">
      <GuestNav />
      <div className="pt-24">
        {/* Hero Image — Cinematic */}
        <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
          <img src={room.image} alt={room.name} className="w-full h-full object-cover animate-ken-burns" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsla(240,6%,6%,0.1) 0%, hsla(240,6%,6%,0.85) 100%)" }} />
          <div className="absolute bottom-10 left-0 right-0 z-10 px-6">
            <div className="container mx-auto max-w-6xl">
              <Link
                to="/rooms"
                className="inline-flex items-center text-[11px] tracking-[0.15em] uppercase text-foreground/40 hover:text-primary transition-colors duration-300 mb-5"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Back to Rooms
              </Link>
              <h1 className="font-heading text-4xl md:text-6xl font-medium text-foreground tracking-tight">{room.name}</h1>
              <div className="flex items-center gap-5 mt-4 text-foreground/50 text-xs tracking-wide">
                <span className="flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5" />{room.size}</span>
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{room.capacity} Guests</span>
                <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-primary fill-primary" />{room.rating} ({room.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-6 py-20">
          <div className="grid lg:grid-cols-[1fr_380px] gap-16">
            {/* Left: Details */}
            <div className="space-y-14">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <h2 className="font-heading text-3xl font-medium text-foreground mb-5 tracking-tight">The Experience</h2>
                <p className="text-muted-foreground leading-[1.8] text-[15px]">{room.description}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}>
                <h2 className="font-heading text-3xl font-medium text-foreground mb-6 tracking-tight">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-3 text-foreground/70">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Reviews */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
                <h2 className="font-heading text-3xl font-medium text-foreground mb-6 tracking-tight">Guest Reviews</h2>
                <div className="space-y-5">
                  {[
                    { name: "Alexandra M.", text: "An absolutely stunning room with impeccable service. The views were breathtaking and every detail was thoughtfully considered.", rating: 5 },
                    { name: "James T.", text: "Every detail was perfect. We'll definitely return for another stay. The concierge went above and beyond.", rating: 5 },
                  ].map((r, i) => (
                    <div key={i} className="rounded-xl border border-border/40 bg-card/50 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-heading font-semibold">
                          {r.name[0]}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">{r.name}</span>
                          <div className="flex mt-0.5">
                            {Array.from({ length: r.rating }).map((_, j) => (
                              <Star key={j} className="h-3 w-3 text-primary fill-primary" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Booking Panel */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
              <div className="rounded-2xl border border-border/50 bg-card p-7 sticky top-28">
                <div className="text-center mb-8">
                  <span className="font-heading text-4xl font-semibold text-primary">${room.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">/night</span>
                </div>

                <div className="space-y-5 mb-8">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block font-medium">Check-in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left h-12 rounded-xl", !checkIn && "text-muted-foreground")}>
                          <CalendarDays className="mr-2 h-4 w-4 text-primary/60" />
                          {checkIn ? format(checkIn, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus className="p-3 pointer-events-auto" disabled={(d) => d < new Date()} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block font-medium">Check-out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left h-12 rounded-xl", !checkOut && "text-muted-foreground")}>
                          <CalendarDays className="mr-2 h-4 w-4 text-primary/60" />
                          {checkOut ? format(checkOut, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus className="p-3 pointer-events-auto" disabled={(d) => d < (checkIn || new Date())} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {nights > 0 && (
                  <div className="border-t border-border/40 pt-5 mb-6 space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>${room.price} × {nights} nights</span>
                      <span>${room.price * nights}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Service fee</span>
                      <span>${Math.round(room.price * nights * 0.1)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-foreground pt-3 border-t border-border/40">
                      <span>Total</span>
                      <span className="text-primary font-heading text-lg">${Math.round(room.price * nights * 1.1)}</span>
                    </div>
                  </div>
                )}

                <Button
                  variant="luxury"
                  className="w-full py-6 rounded-xl text-sm tracking-wider uppercase"
                  onClick={() => {
                    if (!checkIn || !checkOut) {
                      toast.error("Please select check-in and check-out dates");
                      return;
                    }
                    toast.success("Booking confirmed! Redirecting to My Stay...");
                  }}
                >
                  Book Now
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
