import { GuestNav } from "@/components/GuestNav";
import { motion } from "framer-motion";
import { Wifi, Waves, UtensilsCrossed, Dumbbell, Sparkles, Car, Wine, ShieldCheck, Baby, Flower2, Coffee, Shirt } from "lucide-react";
import { Footer } from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const amenityCategories = [
  {
    title: "Wellness & Relaxation",
    items: [
      { icon: Sparkles, name: "Luxury Spa", desc: "Full-service spa with world-class therapists, aromatherapy suites, and private treatment rooms." },
      { icon: Waves, name: "Infinity Pool", desc: "Temperature-controlled infinity pool overlooking panoramic views, with poolside cabanas." },
      { icon: Dumbbell, name: "Fitness Center", desc: "State-of-the-art equipment, personal trainers, and yoga studios available 24/7." },
      { icon: Flower2, name: "Meditation Garden", desc: "Tranquil outdoor garden designed for mindfulness, surrounded by curated botanicals." },
    ],
  },
  {
    title: "Dining & Entertainment",
    items: [
      { icon: UtensilsCrossed, name: "Fine Dining", desc: "Award-winning restaurants featuring international cuisine by Michelin-starred chefs." },
      { icon: Wine, name: "Wine Cellar & Bar", desc: "Curated collection of over 500 vintages and a sophisticated cocktail lounge." },
      { icon: Coffee, name: "Artisan Café", desc: "Premium single-origin coffees, handcrafted pastries, and light bites throughout the day." },
    ],
  },
  {
    title: "Services & Convenience",
    items: [
      { icon: Wifi, name: "High-Speed Wi-Fi", desc: "Complimentary ultra-fast internet throughout the property and all guest rooms." },
      { icon: Car, name: "Valet Parking", desc: "Complimentary luxury valet service with secured underground parking." },
      { icon: Shirt, name: "Laundry & Pressing", desc: "Same-day dry cleaning, pressing, and bespoke garment care services." },
      { icon: ShieldCheck, name: "24/7 Concierge", desc: "Dedicated concierge team to curate personalized experiences and reservations." },
      { icon: Baby, name: "Family Services", desc: "Childcare, kids' club, and family-friendly amenities for a seamless stay." },
    ],
  },
];

export default function Amenities() {
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
          World-Class Facilities
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-medium text-foreground tracking-tight mb-5"
        >
          Hotel <span className="italic gradient-gold-text">Amenities</span>
        </motion.h1>
        <div className="section-divider mt-4 mb-6 mx-auto" />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed"
        >
          Every detail has been thoughtfully curated to elevate your stay into an unforgettable experience.
        </motion.p>
      </section>

      {/* Categories */}
      {amenityCategories.map((cat, ci) => (
        <section key={cat.title} className={`py-16 md:py-24 px-6 ${ci % 2 === 1 ? "bg-card" : ""}`}>
          <div className="container mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-heading text-2xl md:text-4xl font-medium text-foreground tracking-tight mb-12 md:mb-16 text-center"
            >
              {cat.title}
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {cat.items.map((item, i) => (
                <motion.div
                  key={item.name}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-card p-7 md:p-8 hover-lift group"
                >
                  <item.icon className="h-7 w-7 text-primary/70 mb-5 group-hover:text-primary transition-colors duration-300" />
                  <h3 className="font-heading text-xl font-medium text-foreground mb-2 tracking-tight">{item.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}
