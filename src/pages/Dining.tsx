import { GuestNav } from "@/components/GuestNav";
import { motion } from "framer-motion";
import { Clock, MapPin, Star, UtensilsCrossed, Wine, Coffee, Cake } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, any> = { UtensilsCrossed, Wine, Coffee, Cake };
const getIcon = (name: string) => iconMap[name] || UtensilsCrossed;

export default function Dining() {
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ["dining-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("dining_options").select("*").eq("active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <GuestNav />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-primary tracking-[0.3em] uppercase text-[11px] mb-4 font-medium">Culinary Excellence</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }} className="font-heading text-4xl md:text-6xl lg:text-7xl font-medium text-foreground tracking-tight mb-5">
          Dining & <span className="italic gradient-gold-text">Cuisine</span>
        </motion.h1>
        <div className="section-divider mt-4 mb-6 mx-auto" />
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
          From sunrise coffees to midnight tastings, every meal is an occasion to celebrate the art of fine dining.
        </motion.p>
      </section>

      {/* Restaurants */}
      <section className="pb-24 md:pb-32 px-6">
        <div className="container mx-auto max-w-5xl space-y-8 md:space-y-10">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
          ) : restaurants.length === 0 ? (
            <div className="text-center py-16">
              <UtensilsCrossed className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No dining options available at the moment.</p>
            </div>
          ) : (
            restaurants.map((r, i) => {
              const IconComp = getIcon(r.icon);
              return (
                <motion.div key={r.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }} className="rounded-2xl border border-border bg-card p-7 md:p-10 hover-lift">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <IconComp className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                        <h3 className="font-heading text-2xl md:text-3xl font-medium text-foreground tracking-tight">{r.name}</h3>
                        {r.highlight && (
                          <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">{r.highlight}</span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{r.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {r.cuisine && <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-primary" /> {r.cuisine}</span>}
                        {r.hours && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary/60" /> {r.hours}</span>}
                        {r.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary/60" /> {r.location}</span>}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button variant="gold-outline" size="sm" className="text-xs tracking-wider uppercase">Reserve Table</Button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* In-Room Dining CTA */}
      <section className="py-20 md:py-28 px-6 bg-card border-t border-border">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-primary tracking-[0.3em] uppercase text-[11px] mb-4 font-medium">24-Hour Service</p>
            <h2 className="font-heading text-3xl md:text-5xl font-medium text-foreground mb-5 tracking-tight">
              In-Room <span className="italic gradient-gold-text">Dining</span>
            </h2>
            <div className="section-divider mt-4 mb-8 mx-auto" />
            <p className="text-muted-foreground max-w-md mx-auto mb-10 text-sm leading-relaxed">
              Enjoy our full menu from the comfort of your suite. Our in-room dining service is available around the clock.
            </p>
            <Button variant="gold" size="lg" className="text-sm px-10 py-6 tracking-wider uppercase font-medium">View Menu</Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
