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

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <GuestNav />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Luxury hotel lobby"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary tracking-[0.3em] uppercase text-sm mb-6 font-medium"
          >
            Welcome to HQ8X
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight"
          >
            Experience{" "}
            <span className="gradient-gold-text">Timeless</span>{" "}
            Luxury
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-foreground/60 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          >
            Discover world-class accommodations, personalized services, and unforgettable experiences at our award-winning properties.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/rooms">
              <Button variant="luxury" size="lg" className="text-base px-8 py-6">
                Explore Rooms
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/rooms">
              <Button variant="gold-outline" size="lg" className="text-base px-8 py-6">
                Book Your Stay
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-3">Accommodations</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Rooms & Suites
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each room is a masterpiece of design, offering unparalleled comfort and breathtaking views.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.slice(0, 3).map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link to={`/rooms/${room.id}`} className="group block">
                  <div className="glass-panel rounded-xl overflow-hidden hover-lift">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 glass-panel px-3 py-1 rounded-full text-sm font-medium text-primary">
                        {room.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{room.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{room.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-primary fill-primary" />
                          <span className="text-sm text-foreground">{room.rating}</span>
                          <span className="text-sm text-muted-foreground">({room.reviews})</span>
                        </div>
                        <div>
                          <span className="text-2xl font-bold text-primary">${room.price}</span>
                          <span className="text-sm text-muted-foreground"> /night</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/rooms">
              <Button variant="gold-outline" size="lg">
                View All Rooms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-24 px-6" style={{ background: "var(--gradient-card)" }}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary tracking-[0.2em] uppercase text-sm mb-3">World-Class</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
              Hotel Amenities
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {amenities.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel rounded-xl p-6 text-center hover-lift cursor-default"
              >
                <a.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">{a.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Begin Your <span className="gradient-gold-text">Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10">
              Let us craft an unforgettable experience tailored to your desires.
            </p>
            <Link to="/rooms">
              <Button variant="luxury" size="lg" className="text-base px-10 py-6">
                Reserve Your Stay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-heading text-xl font-bold gradient-gold-text">HQ8X</span>
          <p className="text-sm text-muted-foreground">© 2026 HQ8X Hotel Experience Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
