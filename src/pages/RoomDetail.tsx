import { useParams, Link, useNavigate } from "react-router-dom";
import { formatINR } from "@/lib/formatCurrency";
import { GuestNav } from "@/components/GuestNav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { rooms as staticRooms } from "@/data/rooms";
import { motion } from "framer-motion";
import { Star, Users, Maximize2, Check, ArrowLeft, CalendarDays, Loader2, ImageIcon, Camera, ShieldCheck } from "lucide-react";
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
import { RoomImageLightbox } from "@/components/RoomImageLightbox";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const staticRoom = staticRooms.find((r) => r.id === id);
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

  const { data: galleryImages = [] } = useQuery({
    queryKey: ["room-gallery", dbId],
    queryFn: async () => {
      if (!dbId) return [];
      const { data, error } = await supabase.from("room_images").select("*").eq("room_id", dbId).order("sort_order");
      if (error) return [];
      return data;
    },
    enabled: !!dbId,
  });

  const actualRoomIdForReviews = dbId || id || "";
  const { data: roomReviews = [] } = useQuery({
    queryKey: ["room-reviews", actualRoomIdForReviews],
    queryFn: async () => {
      const { data, error } = await supabase.from("room_reviews").select("*").eq("room_id", actualRoomIdForReviews).order("created_at", { ascending: false });
      if (error) return [];
      return data;
    },
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

  const allImages: string[] = [];
  if (room?.image) allImages.push(room.image);
  if (staticRoom?.gallery) {
    staticRoom.gallery.forEach((img) => allImages.push(img));
  }
  galleryImages.forEach((img) => allImages.push(img.image_url));

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

  const handleBooking = () => {
    if (!checkIn || !checkOut) { toast.error("Please select check-in and check-out dates"); return; }
    if (!user) { toast.error("Please sign in to book a room"); navigate("/login"); return; }
    const params = new URLSearchParams({
      roomId: actualRoomId,
      roomName: room.name,
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
      guests,
      specialRequests: specialRequests.trim(),
      total: String(total),
      subtotal: String(subtotal),
      serviceFee: String(serviceFee),
      nights: String(nights),
      pricePerNight: String(room.price),
    });
    navigate(`/payment?${params.toString()}`);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const staticReviews = [
    { name: "Alexandra M.", text: "An absolutely stunning room with impeccable service. The views were breathtaking and every detail was thoughtfully considered.", rating: 5 },
    { name: "James T.", text: "Every detail was perfect. We'll definitely return for another stay. The concierge went above and beyond.", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GuestNav />

      <main className="flex-1 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto max-w-6xl px-5 md:px-6 pt-6 pb-5"
        >
          <Link to="/rooms" className="inline-flex items-center text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 mb-4 group">
            <ArrowLeft className="h-3.5 w-3.5 mr-2 group-hover:-translate-x-0.5 transition-transform" /> Back to Rooms
          </Link>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">{room.name}</h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-5 mt-3 text-muted-foreground text-xs tracking-wide">
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-primary bg-primary/5 border border-primary/15 px-3 py-1 rounded-full">{room.category}</span>
            {room.size && <span className="flex items-center gap-1.5"><Maximize2 className="h-3.5 w-3.5" />{room.size}</span>}
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{room.capacity} Guests</span>
            {room.rating > 0 && <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-primary fill-primary" />{room.rating} ({room.reviews} reviews)</span>}
          </div>
        </motion.div>

        {/* Hero Image Grid + Booking Card */}
        <div className="container mx-auto max-w-6xl px-5 md:px-6 pb-8">
          <div className="grid lg:grid-cols-[1fr_380px] gap-5 md:gap-6 items-start">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main image */}
              <div
                className="relative rounded-2xl overflow-hidden bg-secondary cursor-pointer aspect-[16/10]"
                onClick={() => allImages.length > 0 && openLightbox(0)}
              >
                {room.image ? (
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-20 w-20 text-muted-foreground/20" /></div>
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, hsla(240,10%,10%,0.35) 100%)" }} />

                {allImages.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
                    className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-white/80 hover:text-white text-xs bg-black/40 backdrop-blur-sm px-3.5 py-2 rounded-full transition-colors"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    View all {allImages.length} photos
                  </button>
                )}
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2.5 mt-2.5 overflow-x-auto pb-1">
                  {allImages.slice(1).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => openLightbox(i + 1)}
                      className="shrink-0 w-24 h-16 md:w-28 md:h-[4.5rem] rounded-xl overflow-hidden border-2 border-transparent hover:border-primary/40 transition-all duration-200 group"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Booking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="lg:sticky lg:top-28"
            >
              <div className="rounded-2xl border border-border bg-card shadow-sm p-6 md:p-7">
                <div className="text-center mb-6">
                  <span className="font-heading text-3xl md:text-4xl font-semibold text-primary">{formatINR(room.price)}</span>
                  <span className="text-muted-foreground text-sm ml-1">/night</span>
                </div>

                <div className="space-y-3 mb-5">
                  {/* Check-in */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block font-medium">Check-in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left h-11 rounded-xl text-sm", !checkIn && "text-muted-foreground")}>
                          <CalendarDays className="mr-2 h-4 w-4 text-primary/50" />{checkIn ? format(checkIn, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus className="p-3 pointer-events-auto" disabled={(d) => d < new Date()} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* Check-out */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block font-medium">Check-out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left h-11 rounded-xl text-sm", !checkOut && "text-muted-foreground")}>
                          <CalendarDays className="mr-2 h-4 w-4 text-primary/50" />{checkOut ? format(checkOut, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus className="p-3 pointer-events-auto" disabled={(d) => d < (checkIn || new Date())} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* Guests */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block font-medium">Guests</label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                          <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "Guest" : "Guests"}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Special Requests */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block font-medium">Special Requests</label>
                    <Textarea placeholder="Late check-in, extra pillows..." value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} className="rounded-xl resize-none min-h-[60px] text-sm" maxLength={500} />
                  </div>
                </div>

                {/* Price breakdown */}
                {nights > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border pt-3 mb-5 space-y-2 text-sm"
                  >
                    <div className="flex justify-between text-muted-foreground"><span>{formatINR(room.price)} × {nights} night{nights > 1 ? "s" : ""}</span><span>{formatINR(subtotal)}</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>Service fee</span><span>{formatINR(serviceFee)}</span></div>
                    <div className="flex justify-between font-medium text-foreground pt-2.5 border-t border-border"><span>Total</span><span className="text-primary font-heading text-lg">{formatINR(total)}</span></div>
                  </motion.div>
                )}

                <Button variant="gold" className="w-full py-5 rounded-xl text-sm tracking-wider uppercase" onClick={handleBooking} disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Booking...</> : "Book Now"}
                </Button>

                <p className="text-center text-[11px] text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> You won't be charged yet
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content sections */}
        <div className="container mx-auto max-w-6xl px-5 md:px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            <div className="space-y-12 md:space-y-16">
              {/* Description */}
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
                <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-4 tracking-tight">The Experience</h2>
                <p className="text-muted-foreground leading-[1.85] text-[15px]">{room.description}</p>
              </motion.section>

              {/* Photo Gallery */}
              {allImages.length > 1 && (
                <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
                  <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-5 tracking-tight">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allImages.map((img, i) => (
                      <button key={i} onClick={() => openLightbox(i)} className="relative rounded-xl overflow-hidden aspect-[4/3] group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <img src={img} alt={`${room.name} – Photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </button>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Amenities */}
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
                <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-5 tracking-tight">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 md:gap-4">
                  {room.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-3 text-foreground/80 py-1">
                      <div className="h-7 w-7 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Reviews */}
              <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
                <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-5 tracking-tight">Guest Reviews</h2>
                <div className="space-y-4">
                  {roomReviews.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border bg-card p-5 md:p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-heading font-semibold">G</div>
                        <div>
                          <span className="text-sm font-medium text-foreground">Verified Guest</span>
                          <div className="flex mt-0.5">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3 w-3 text-primary fill-primary" />)}</div>
                        </div>
                        <span className="ml-auto text-xs text-muted-foreground">{format(new Date(r.created_at), "MMM d, yyyy")}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.review_text}</p>
                    </div>
                  ))}
                  {staticReviews.map((r, i) => (
                    <div key={`static-${i}`} className="rounded-xl border border-border bg-card p-5 md:p-6">
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
              </motion.section>
            </div>

            {/* Empty right column to maintain grid alignment with booking card above */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </main>

      <Footer />
      <RoomImageLightbox images={allImages} initialIndex={lightboxIndex} open={lightboxOpen} onOpenChange={setLightboxOpen} />
    </div>
  );
}
