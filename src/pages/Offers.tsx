import { GuestNav } from "@/components/GuestNav";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Percent, Gift, Crown, Tag, Loader2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.ElementType> = {
  Crown,
  Calendar,
  Gift,
  Percent,
  Tag,
};

export default function Offers() {
  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["guest-offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

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
        <div className="container mx-auto max-w-5xl">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : offers.length === 0 ? (
            <p className="text-muted-foreground text-center py-16 text-sm">No offers available at the moment. Check back soon!</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              {offers.map((offer, i) => {
                const IconComp = iconMap[offer.icon] || Gift;
                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    className="rounded-2xl border border-border bg-card p-7 md:p-9 hover-lift flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                          <IconComp className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-primary">{offer.tag}</span>
                      </div>
                      <span className="font-heading text-xl md:text-2xl font-semibold text-primary">{offer.discount}</span>
                    </div>
                    <h3 className="font-heading text-2xl font-medium text-foreground mb-2 tracking-tight">{offer.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3 flex-1">{offer.description}</p>
                    <p className="text-xs text-muted-foreground/60 mb-5">{offer.validity}</p>
                    <Link to="/rooms">
                      <Button variant="gold-outline" size="sm" className="text-xs tracking-wider uppercase w-full sm:w-auto">
                        Book This Offer <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
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

      <Footer />
    </div>
  );
}
