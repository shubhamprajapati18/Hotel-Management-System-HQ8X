import { useState } from "react";
import { Link } from "react-router-dom";
import { GuestNav } from "@/components/GuestNav";
import { Button } from "@/components/ui/button";
import { rooms } from "@/data/rooms";
import { motion } from "framer-motion";
import { Star, Users, Maximize2 } from "lucide-react";

const categories = ["All", "Suite", "Deluxe", "Penthouse"];

export default function Rooms() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? rooms : rooms.filter((r) => r.category === active);

  return (
    <div className="min-h-screen bg-background">
      <GuestNav />
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-3">Accommodations</p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">Rooms & Suites</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our collection of meticulously designed rooms and suites.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={active === cat ? "gold" : "ghost"}
                size="sm"
                onClick={() => setActive(cat)}
                className="tracking-wide"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/rooms/${room.id}`} className="group block">
                  <div className="glass-panel rounded-xl overflow-hidden hover-lift">
                    <div className="relative h-56 overflow-hidden">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 right-4 glass-panel px-3 py-1 rounded-full text-xs font-medium text-primary">
                        {room.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{room.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{room.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{room.size}</span>
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{room.capacity} Guests</span>
                        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-primary fill-primary" />{room.rating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">${room.price}</span>
                          <span className="text-sm text-muted-foreground"> /night</span>
                        </div>
                        <Button variant="gold-outline" size="sm">View Details</Button>
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
