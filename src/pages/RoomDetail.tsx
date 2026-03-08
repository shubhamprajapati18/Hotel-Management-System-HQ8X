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
        <p className="text-muted-foreground">Room not found.</p>
      </div>
    );
  }

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000)) : 0;

  return (
    <div className="min-h-screen bg-background">
      <GuestNav />
      <div className="pt-24">
        {/* Hero Image */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="absolute bottom-8 left-8 z-10">
            <Link to="/rooms" className="inline-flex items-center text-sm text-foreground/70 hover:text-primary transition-colors mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Rooms
            </Link>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">{room.name}</h1>
            <div className="flex items-center gap-4 mt-3 text-foreground/70">
              <span className="flex items-center gap-1"><Maximize2 className="h-4 w-4" />{room.size}</span>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" />{room.capacity} Guests</span>
              <span className="flex items-center gap-1"><Star className="h-4 w-4 text-primary fill-primary" />{room.rating} ({room.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">About This Room</h2>
                <p className="text-muted-foreground leading-relaxed">{room.description}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {room.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-foreground/80">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Reviews */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Guest Reviews</h2>
                <div className="space-y-4">
                  {[
                    { name: "Alexandra M.", text: "An absolutely stunning room with impeccable service. The views were breathtaking.", rating: 5 },
                    { name: "James T.", text: "Every detail was perfect. We'll definitely return for another stay.", rating: 5 },
                  ].map((r, i) => (
                    <div key={i} className="glass-panel rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{r.name[0]}</div>
                        <span className="text-sm font-medium text-foreground">{r.name}</span>
                        <div className="flex ml-auto">
                          {Array.from({ length: r.rating }).map((_, j) => (
                            <Star key={j} className="h-3.5 w-3.5 text-primary fill-primary" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Booking Panel */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="glass-panel rounded-xl p-6 sticky top-28">
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-primary">${room.price}</span>
                  <span className="text-muted-foreground"> /night</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Check-in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left", !checkIn && "text-muted-foreground")}>
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus className="p-3 pointer-events-auto" disabled={(d) => d < new Date()} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Check-out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left", !checkOut && "text-muted-foreground")}>
                          <CalendarDays className="mr-2 h-4 w-4" />
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
                  <div className="border-t border-border pt-4 mb-4 space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>${room.price} × {nights} nights</span>
                      <span>${room.price * nights}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Service fee</span>
                      <span>${Math.round(room.price * nights * 0.1)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">${Math.round(room.price * nights * 1.1)}</span>
                    </div>
                  </div>
                )}

                <Button
                  variant="luxury"
                  className="w-full py-6"
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
