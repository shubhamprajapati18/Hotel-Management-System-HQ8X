import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect } from "react";

export function TestimonialsSection() {
  const { data: testimonials = [] } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").eq("active", true).order("sort_order");
      if (error) return [];
      return data;
    },
  });

  const [current, setCurrent] = useState(0);
  const count = testimonials.length;

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % count), 6000);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + count) % count);
  const next = () => setCurrent((c) => (c + 1) % count);
  const t = testimonials[current];

  return (
    <section className="py-24 md:py-32 px-6 border-t border-border">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 md:mb-16"
        >
          <p className="text-primary tracking-[0.3em] uppercase text-[11px] mb-4 font-medium">Testimonials</p>
          <h2 className="font-heading text-3xl md:text-5xl font-medium text-foreground tracking-tight">
            What Our Guests Say
          </h2>
          <div className="section-divider mt-6" />
        </motion.div>

        <motion.div
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Quote className="h-8 w-8 text-primary/20 mx-auto mb-6 rotate-180" />

          <p className="font-heading text-xl md:text-2xl lg:text-[1.7rem] text-foreground/80 leading-relaxed max-w-2xl mx-auto mb-8 italic">
            "{t.review_text}"
          </p>

          <div className="flex items-center justify-center gap-3 mb-3">
            {t.guest_image ? (
              <img src={t.guest_image} alt={t.guest_name} className="h-12 w-12 rounded-full object-cover border-2 border-primary/20" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-semibold text-lg border-2 border-primary/20">
                {t.guest_name[0]}
              </div>
            )}
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{t.guest_name}</p>
              <div className="flex mt-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-primary fill-primary" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {count > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
