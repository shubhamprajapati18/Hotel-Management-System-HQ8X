import { GuestNav } from "@/components/GuestNav";
import { motion } from "framer-motion";
import { Clock, MapPin, Star, UtensilsCrossed, Wine, Coffee, Cake } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const restaurants = [
  {
    name: "The Grand Table",
    cuisine: "International Fine Dining",
    icon: UtensilsCrossed,
    hours: "6:30 PM – 11:00 PM",
    desc: "An award-winning culinary journey featuring a seasonal tasting menu crafted by our Michelin-starred executive chef. Each dish is a masterpiece of flavour and presentation.",
    highlight: "Michelin-Starred",
    location: "Lobby Level",
  },
  {
    name: "Azure Lounge",
    cuisine: "Cocktails & Small Plates",
    icon: Wine,
    hours: "12:00 PM – 1:00 AM",
    desc: "A sophisticated bar and lounge featuring hand-crafted cocktails, rare spirits, and an exquisite selection of small plates. Live jazz performances on weekends.",
    highlight: "Live Music",
    location: "Rooftop, 32nd Floor",
  },
  {
    name: "Jardin Café",
    cuisine: "Artisan Coffee & Patisserie",
    icon: Coffee,
    hours: "6:30 AM – 6:00 PM",
    desc: "Start your morning with single-origin pour-overs and freshly baked viennoiserie in our garden-facing café. A serene space for a leisurely breakfast.",
    highlight: "Garden View",
    location: "Garden Level",
  },
  {
    name: "Silk Road",
    cuisine: "Asian Fusion",
    icon: Cake,
    hours: "12:00 PM – 10:30 PM",
    desc: "A culinary voyage through Asia's most celebrated flavors—from Japanese omakase to Thai curries—reimagined with contemporary flair and premium ingredients.",
    highlight: "Chef's Special",
    location: "2nd Floor",
  },
];

export default function Dining() {
  return (
    <div className="min-h-screen bg-background">
      <GuestNav />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-primary tracking-[0.3em] uppercase text-[11px] mb-4 font-medium"
        >
          Culinary Excellence
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-medium text-foreground tracking-tight mb-5"
        >
          Dining & <span className="italic gradient-gold-text">Cuisine</span>
        </motion.h1>
        <div className="section-divider mt-4 mb-6 mx-auto" />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed"
        >
          From sunrise coffees to midnight tastings, every meal is an occasion to celebrate the art of fine dining.
        </motion.p>
      </section>

      {/* Restaurants */}
      <section className="pb-24 md:pb-32 px-6">
        <div className="container mx-auto max-w-5xl space-y-8 md:space-y-10">
          {restaurants.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="rounded-2xl border border-border bg-card p-7 md:p-10 hover-lift"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <r.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                    <h3 className="font-heading text-2xl md:text-3xl font-medium text-foreground tracking-tight">{r.name}</h3>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                      {r.highlight}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{r.desc}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-primary" /> {r.cuisine}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary/60" /> {r.hours}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary/60" /> {r.location}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button variant="gold-outline" size="sm" className="text-xs tracking-wider uppercase">
                    Reserve Table
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* In-Room Dining CTA */}
      <section className="py-20 md:py-28 px-6 bg-card border-t border-border">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary tracking-[0.3em] uppercase text-[11px] mb-4 font-medium">24-Hour Service</p>
            <h2 className="font-heading text-3xl md:text-5xl font-medium text-foreground mb-5 tracking-tight">
              In-Room <span className="italic gradient-gold-text">Dining</span>
            </h2>
            <div className="section-divider mt-4 mb-8 mx-auto" />
            <p className="text-muted-foreground max-w-md mx-auto mb-10 text-sm leading-relaxed">
              Enjoy our full menu from the comfort of your suite. Our in-room dining service is available around the clock.
            </p>
            <Button variant="gold" size="lg" className="text-sm px-10 py-6 tracking-wider uppercase font-medium">
              View Menu
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border py-12 md:py-16 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-heading text-2xl font-medium tracking-wide gradient-gold-text">HQ8X</span>
          <p className="text-xs text-muted-foreground/60 tracking-wider">© 2026 HQ8X Hotel Experience Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
