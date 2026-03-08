import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GuestNav } from "@/components/GuestNav";
import { motion } from "framer-motion";
import { Star, Wifi, Waves, UtensilsCrossed, Dumbbell, Sparkles, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-hotel.jpg";
import { rooms } from "@/data/rooms";

const amenities = [
  { icon: Wifi, label: "High-Speed Wi-Fi" },
  { icon: Waves, label: "Infinity Pool" },
  { icon: UtensilsCrossed, label: "Fine Dining" },
  { icon: Dumbbell, label: "Fitness Center" },
  { icon: Sparkles, label: "Luxury Spa" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <GuestNav />

      {/* Hero Section — Cinematic */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Luxury hotel lobby with golden accents"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, hsla(240,6%,6%,0.25) 0%, hsla(240,6%,6%,0.7) 60%, hsla(240,6%,6%,0.95) 100%)" }}
        />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-primary/80 tracking-[0.4em] uppercase text-[11px] font-medium"
            >
              Est. 2024 · World-Class Hospitality
            </motion.p>
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="font-heading text-5xl md:text-7xl lg:text-[5.5rem] font-medium text-foreground leading-[1.05] tracking-tight"
            >
              Where Hospitality{" "}
              <br className="hidden md:block" />
              Meets{" "}
              <span className="gradient-gold-text italic">Perfection</span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-foreground/45 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light"
            >
              Discover world-class accommodations, personalized services, and unforgettable experiences at our award-winning properties.
            </motion.p>
            <motion.div
              custom={3}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
            >
              <Link to="/rooms">
                <Button variant="luxury" size="lg" className="text-sm px-10 py-6 tracking-wider uppercase font-medium">
                  Explore Rooms
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/rooms">
                <Button variant="gold-outline" size="lg" className="text-sm px-10 py-6 tracking-wider uppercase font-medium">
                  Book Your Stay
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-9 border border-foreground/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-primary/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured Rooms — Editorial Grid */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <p className="text-primary/70 tracking-[0.3em] uppercase text-[11px] mb-4 font-medium">Accommodations</p>
            <h2 className="font-heading text-4xl md:text-6xl font-medium text-foreground mb-5 tracking-tight">
              Rooms & Suites
            </h2>
            <div className="section-divider mt-6 mb-6" />
            <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
              Each room is a masterpiece of design, offering unparalleled comfort and breathtaking views of the city and beyond.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {rooms.slice(0, 3).map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/rooms/${room.id}`} className="group block">
                  <div className="rounded-2xl overflow-hidden bg-card border border-border/50 hover-lift">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                      <div className="absolute top-5 left-5">
                        <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-primary bg-background/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/20">
                          {room.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 pb-7">
                      <h3 className="font-heading text-2xl font-medium text-foreground mb-2 tracking-tight">{room.name}</h3>
                      <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">{room.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                          <span className="text-sm text-foreground/80">{room.rating}</span>
                          <span className="text-xs text-muted-foreground">({room.reviews})</span>
                        </div>
                        <div>
                          <span className="text-2xl font-heading font-semibold text-primary">${room.price}</span>
                          <span className="text-xs text-muted-foreground ml-1">/night</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mt-16"
          >
            <Link to="/rooms">
              <Button variant="gold-outline" size="lg" className="text-xs tracking-[0.15em] uppercase px-8">
                View All Rooms
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-28 px-6 border-t border-b border-border/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-primary/70 tracking-[0.3em] uppercase text-[11px] mb-4 font-medium">World-Class</p>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground tracking-tight">
              Hotel Amenities
            </h2>
            <div className="section-divider mt-6" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {amenities.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="rounded-2xl border border-border/40 bg-card/50 p-7 text-center hover-lift cursor-default group"
              >
                <a.icon className="h-7 w-7 text-primary/80 mx-auto mb-4 group-hover:text-primary transition-colors duration-500" />
                <p className="text-xs font-medium text-foreground/70 tracking-wide">{a.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary/70 tracking-[0.3em] uppercase text-[11px] mb-4 font-medium">Begin Today</p>
            <h2 className="font-heading text-4xl md:text-6xl font-medium text-foreground mb-6 tracking-tight">
              Begin Your{" "}
              <span className="gradient-gold-text italic">Journey</span>
            </h2>
            <div className="section-divider mt-4 mb-8" />
            <p className="text-muted-foreground max-w-md mx-auto mb-12 text-sm leading-relaxed">
              Let us craft an unforgettable experience tailored to your desires. Every moment, perfectly curated.
            </p>
            <Link to="/rooms">
              <Button variant="luxury" size="lg" className="text-sm px-12 py-6 tracking-wider uppercase font-medium">
                Reserve Your Stay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-16 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-heading text-2xl font-medium tracking-wide gradient-gold-text">HQ8X</span>
          <p className="text-xs text-muted-foreground/60 tracking-wider">
            © 2026 HQ8X Hotel Experience Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
