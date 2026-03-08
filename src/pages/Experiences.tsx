import { GuestNav } from "@/components/GuestNav";
import { motion } from "framer-motion";
import { Compass, Sunrise, Palette, Ship, Mountain, Music, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const experiences = [
  {
    icon: Sunrise,
    title: "Sunrise Yoga & Meditation",
    category: "Wellness",
    duration: "90 min",
    desc: "Begin your day with a guided yoga session on our oceanfront terrace as the sun rises. Includes a post-session herbal wellness drink.",
  },
  {
    icon: Ship,
    title: "Private Yacht Charter",
    category: "Adventure",
    duration: "Half Day",
    desc: "Explore the coastline aboard a private luxury yacht with a personal chef and crew. Includes gourmet lunch and champagne service.",
  },
  {
    icon: Palette,
    title: "Art & Culture Tour",
    category: "Culture",
    duration: "4 hours",
    desc: "A curated private tour of the city's finest galleries and cultural landmarks, led by a local art historian.",
  },
  {
    icon: Mountain,
    title: "Mountain Heritage Trek",
    category: "Adventure",
    duration: "Full Day",
    desc: "Embark on a guided trek through scenic mountain trails with stops at historic villages and a picnic lunch with panoramic views.",
  },
  {
    icon: Music,
    title: "Private Jazz Evening",
    category: "Entertainment",
    duration: "3 hours",
    desc: "An intimate evening of live jazz performance in our rooftop lounge, paired with bespoke cocktails and canapés.",
  },
  {
    icon: Compass,
    title: "Bespoke Concierge Experiences",
    category: "Exclusive",
    duration: "Custom",
    desc: "Tell us your dream experience and our concierge will craft a fully personalized itinerary just for you.",
  },
];

export default function Experiences() {
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
          Curated For You
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-medium text-foreground tracking-tight mb-5"
        >
          Signature <span className="italic gradient-gold-text">Experiences</span>
        </motion.h1>
        <div className="section-divider mt-4 mb-6 mx-auto" />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed"
        >
          Go beyond the ordinary with handcrafted experiences that transform your stay into lasting memories.
        </motion.p>
      </section>

      {/* Grid */}
      <section className="pb-24 md:pb-32 px-6">
        <div className="container mx-auto max-w-6xl grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.6 }}
              className="rounded-2xl border border-border bg-card p-7 md:p-8 hover-lift group flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <exp.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-primary">{exp.category}</span>
                  <p className="text-[10px] text-muted-foreground">{exp.duration}</p>
                </div>
              </div>
              <h3 className="font-heading text-xl font-medium text-foreground mb-2 tracking-tight">{exp.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">{exp.desc}</p>
              <Button variant="ghost" size="sm" className="mt-5 text-xs tracking-wider uppercase text-primary hover:text-primary p-0 h-auto justify-start">
                Learn More <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-6 bg-card border-t border-border">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-medium text-foreground mb-5 tracking-tight">
              Create Your <span className="italic gradient-gold-text">Own</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-10 text-sm leading-relaxed">
              Our concierge team is ready to design a bespoke itinerary around your passions and preferences.
            </p>
            <Link to="/contact">
              <Button variant="gold" size="lg" className="text-sm px-10 py-6 tracking-wider uppercase font-medium">
                Contact Concierge <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
