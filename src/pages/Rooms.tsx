import { useState } from "react";
import { Link } from "react-router-dom";
import { GuestNav } from "@/components/GuestNav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { rooms } from "@/data/rooms";
import { motion } from "framer-motion";
import { Star, Users, Maximize2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "Suite", "Deluxe", "Penthouse"];

export default function Rooms() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? rooms : rooms.filter((r) => r.category === active);

  return (
    <div className="min-h-screen bg-background">
      <GuestNav />
      <div className="pt-32 md:pt-36 pb-24 md:pb-28 px-5 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-primary tracking-[0.3em] uppercase text-[11px] mb-4 font-medium">Accommodations</p>
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-medium text-foreground mb-4 tracking-tight">
              Rooms & Suites
            </h1>
            <div className="section-divider mt-5 mb-6" />
            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
              Choose from our collection of meticulously designed rooms and suites.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex justify-center gap-2 mb-12 md:mb-16 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  "text-[11px] tracking-[0.18em] uppercase font-medium px-5 md:px-6 py-2.5 rounded-full border transition-all duration-300",
                  active === cat
                    ? "border-primary/50 text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {filtered.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
              >
                <Link to={`/rooms/${room.id}`} className="group block">
                  <div className="rounded-2xl overflow-hidden bg-card border border-border hover-lift">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-primary bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/15">
                          {room.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 md:p-6">
                      <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-2 tracking-tight">{room.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">{room.description}</p>
                      <div className="flex items-center gap-3 md:gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1.5"><Maximize2 className="h-3 w-3" />{room.size}</span>
                        <span className="flex items-center gap-1.5"><Users className="h-3 w-3" />{room.capacity} Guests</span>
                        <span className="flex items-center gap-1.5"><Star className="h-3 w-3 text-primary fill-primary" />{room.rating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl md:text-2xl font-heading font-semibold text-primary">${room.price}</span>
                          <span className="text-xs text-muted-foreground ml-1">/night</span>
                        </div>
                        <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-1">
                          View <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
