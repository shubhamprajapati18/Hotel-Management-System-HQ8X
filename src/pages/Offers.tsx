import { GuestNav } from "@/components/GuestNav";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Percent, Gift, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const offers = [
  {
    icon: Crown,
    tag: "Exclusive",
    title: "The Royal Escape",
    validity: "Valid until June 30, 2026",
    desc: "Book 3 nights in any Penthouse suite and receive the 4th night complimentary. Includes daily breakfast, spa credit, and airport transfers.",
    discount: "25% Off",
  },
  {
    icon: Calendar,
    tag: "Early Bird",
    title: "Advance Purchase Savings",
    validity: "Book 30+ days in advance",
    desc: "Plan ahead and save. Enjoy up to 20% off our best available rates when you book at least 30 days before your arrival.",
    discount: "20% Off",
  },
  {
    icon: Gift,
    tag: "Romance",
    title: "Honeymoon & Anniversary",
    validity: "Year-round",
    desc: "Celebrate love with a curated package: champagne on arrival, couples spa treatment, candlelit dinner, and rose petal turndown service.",
    discount: "Package",
  },
  {
    icon: Percent,
    tag: "Extended Stay",
    title: "Stay Longer, Save More",
    validity: "Minimum 5 nights",
    desc: "Extended stays are rewarded. Book 5 nights or more and receive 15% off, plus complimentary laundry service and late checkout.",
    discount: "15% Off",
  },
];

export default function Offers() {
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
          Exclusive Privileges
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-medium text-foreground tracking-tight mb-5"
        >
          Special <span className="italic gradient-gold-text">Offers</span>
        </motion.h1>
        <div className="section-divider mt-4 mb-6 mx-auto" />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed"
        >
          Thoughtfully designed packages and promotions to make your luxury experience even more exceptional.
        </motion.p>
      </section>

      {/* Offers Grid */}
      <section className="pb-24 md:pb-32 px-6">
        <div className="container mx-auto max-w-5xl grid sm:grid-cols-2 gap-6 md:gap-8">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="rounded-2xl border border-border bg-card p-7 md:p-9 hover-lift flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <offer.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-primary">{offer.tag}</span>
                </div>
                <span className="font-heading text-xl md:text-2xl font-semibold text-primary">{offer.discount}</span>
              </div>
              <h3 className="font-heading text-2xl font-medium text-foreground mb-2 tracking-tight">{offer.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3 flex-1">{offer.desc}</p>
              <p className="text-xs text-muted-foreground/60 mb-5">{offer.validity}</p>
              <Link to="/rooms">
                <Button variant="gold-outline" size="sm" className="text-xs tracking-wider uppercase w-full sm:w-auto">
                  Book This Offer <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 md:py-28 px-6 bg-card border-t border-border">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-medium text-foreground mb-5 tracking-tight">
              Never Miss an <span className="italic gradient-gold-text">Offer</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm leading-relaxed">
              Subscribe to our newsletter and be the first to receive exclusive rates and seasonal packages.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-xl border border-border bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
              <Button variant="gold" className="text-xs tracking-wider uppercase px-8">
                Subscribe
              </Button>
            </div>
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
