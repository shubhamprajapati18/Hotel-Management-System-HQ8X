import { useParams, Link, useNavigate } from "react-router-dom";
import { GuestNav } from "@/components/GuestNav";
import { Button } from "@/components/ui/button";
import { rooms as staticRooms } from "@/data/rooms";
import { motion } from "framer-motion";
import { Star, Users, Maximize2, Check, ArrowLeft, CalendarDays, Loader2, ImageIcon } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

interface DisplayRoom {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string | null;
  price: number;
  size: string;
  capacity: number;
  amenities: string[];
  rating: number;
  reviews: number;
}

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("1");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check static rooms first
  const staticRoom = staticRooms.find((r) => r.id === id);

  // Check DB rooms if id starts with "db-"
  const dbId = id?.startsWith("db-") ? id.slice(3) : null;
  const { data: dbRoom } = useQuery({
    queryKey: ["room-detail", dbId],
    queryFn: async () => {
      if (!dbId) return null;
      const { data, error } = await supabase.from("rooms").select("*").eq("id", dbId).single();
      if (error) return null;
      return data;
    },
    enabled: !!dbId,
  });

  const room: DisplayRoom | null = staticRoom
    ? staticRoom
    : dbRoom
    ? {
        id: `db-${dbRoom.id}`,
        name: dbRoom.name,
        category: dbRoom.category,
        description: dbRoom.description || "",
        image: dbRoom.image_url,
        price: Number(dbRoom.price),
        size: dbRoom.size || "",
        capacity: dbRoom.capacity,
        amenities: dbRoom.amenities || [],
        rating: 4.5,
        reviews: 0,
      }
    : null;

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-heading text-xl">Room not found.</p>
      </div>
    );
  }

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000)) : 0;
  const subtotal = room.price * nights;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const actualRoomId = room.id.startsWith("db-") ? room.id.slice(3) : room.id;

  const handleBooking = async () => {
    if (!checkIn || !checkOut) { toast.error("Please select check-in and check-out dates"); return; }
    if (!user) { toast.error("Please sign in to book a room"); navigate("/login"); return; }

    setIsSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      room_id: actualRoomId,
      room_name: room.name,
      check_in: format(checkIn, "yyyy-MM-dd"),
      check_out: format(checkOut, "yyyy-MM-dd"),
      guests: parseInt(guests),
      special_requests: specialRequests.trim() || null,
      total_price: total,
    });

    setIsSubmitting(false);
    if (error) { toast.error("Booking failed. Please try again."); return; }
    toast.success("Booking confirmed! Redirecting to My Stay...");
    setTimeout(() => navigate("/my-stay"), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <GuestNav />
      <div className="pt-24">
        <div className="relative h-[45vh] md:h-[55vh] lg:h-[65vh] overflow-hidden bg-secondary">
          {room.image ? (
            <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-20 w-20 text-muted-foreground/20" /></div>
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsla(240,10%,10%,0.05) 0%, hsla(240,10%,10%,0.75) 100%)" }} />
          <div className="absolute bottom-8 md:bottom-10 left-0 right-0 z-10 px-5 md:px-6">
            <div className="container mx-auto max-w-6xl">
              <Link to="/rooms" className="inline-flex items-center text-[11px] tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors duration-300 mb-4">
                <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Back to Rooms
              </Link>
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight">{room.name}</h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-5 mt-3 md:mt-4 text-white/60 text-xs tracking-wide">
                {room.size && <span className="flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5" />{room.size}</span>}
                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{room.capacity} Guests</span>
                {room.rating > 0 && <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-gold-light fill-gold-light" />{room.rating} ({room.reviews} reviews)</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-5 md:px-6 py-12 md:py-20">
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 md:gap-16">
            <div className="space-y-10 md:space-y-14">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-4 tracking-tight">The Experience</h2>
                <p className="text-muted-foreground leading-[1.8] text-[15px]">{room.description}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
                <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-5 tracking-tight">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {room.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-3 text-foreground/70">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Check className="h-3.5 w-3.5 text-primary" /></div>
                      <span className="text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-5 tracking-tight">Guest Reviews</h2>
                <div className="space-y-4">
                  {[
                    { name: "Alexandra M.", text: "An absolutely stunning room with impeccable service. The views were breathtaking and every detail was thoughtfully considered.", rating: 5 },
                    { name: "James T.", text: "Every detail was perfect. We'll definitely return for another stay. The concierge went above and beyond.", rating: 5 },
                  ].map((r, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-5 md:p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-heading font-semibold">{r.name[0]}</div>
                        <div>
                          <span className="text-sm font-medium text-foreground">{r.name}</span>
                          <div className="flex mt-0.5">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3 w-3 text-primary fill-primary" />)}</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
              <div className="rounded-2xl border border-border bg-card p-6 md:p-7 sticky top-28">
                <div className="text-center mb-7">
                  <span className="font-heading text-3xl md:text-4xl font-semibold text-primary">${room.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">/night</span>
                </div>
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block font-medium">Check-in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left h-11 md:h-12 rounded-xl", !checkIn && "text-muted-foreground")}>
                          <CalendarDays className="mr-2 h-4 w-4 text-primary/50" />{checkIn ? format(checkIn, "PPP") : "Select date"}
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
                        <Button variant="outline" className={cn("w-full justify-start text-left h-11 md:h-12 rounded-xl", !checkOut && "text-muted-foreground")}>
                          <CalendarDays className="mr-2 h-4 w-4 text-primary/50" />{checkOut ? format(checkOut, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus className="p-3 pointer-events-auto" disabled={(d) => d < (checkIn || new Date())} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block font-medium">Guests</label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="h-11 md:h-12 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                          <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "Guest" : "Guests"}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block font-medium">Special Requests</label>
                    <Textarea placeholder="Late check-in, extra pillows, dietary needs..." value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} className="rounded-xl resize-none min-h-[80px] text-sm" maxLength={500} />
                  </div>
                </div>

                {nights > 0 && (
                  <div className="border-t border-border pt-4 mb-5 space-y-2.5 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>${room.price} × {nights} nights</span><span>${subtotal}</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>Service fee</span><span>${serviceFee}</span></div>
                    <div className="flex justify-between font-medium text-foreground pt-3 border-t border-border"><span>Total</span><span className="text-primary font-heading text-lg">${total}</span></div>
                  </div>
                )}

                <Button variant="gold" className="w-full py-6 rounded-xl text-sm tracking-wider uppercase" onClick={handleBooking} disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Booking...</> : "Book Now"}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
