import { GuestNav } from "@/components/GuestNav";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactInfo = [
  { icon: MapPin, label: "Address", value: "1 Royal Marina Drive, Palm Jumeirah\nDubai, United Arab Emirates" },
  { icon: Phone, label: "Phone", value: "+971 4 888 8888" },
  { icon: Mail, label: "Email", value: "reservations@hq8x.com" },
  { icon: Clock, label: "Front Desk", value: "Available 24 hours, 7 days a week" },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject is too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
      return;
    }

    toast({ title: "Message Sent", description: "Our team will respond within 24 hours." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <GuestNav />

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-primary tracking-[0.3em] uppercase text-[11px] mb-4 font-medium">Get In Touch</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }} className="font-heading text-4xl md:text-6xl lg:text-7xl font-medium text-foreground tracking-tight mb-5">
          Contact <span className="italic gradient-gold-text">Us</span>
        </motion.h1>
        <div className="section-divider mt-4 mb-6 mx-auto" />
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
          We'd love to hear from you. Reach out for reservations, inquiries, or to plan your perfect stay.
        </motion.p>
      </section>

      {/* Content */}
      <section className="pb-24 md:pb-32 px-6">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-5 gap-10 md:gap-14">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-2 space-y-6">
            <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground tracking-tight mb-8">Reach Out</h2>
            {contactInfo.map((info) => (
              <div key={info.label} className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <info.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-1">{info.label}</p>
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{info.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-7 md:p-10">
              <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground tracking-tight mb-8">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Full Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                      placeholder="John Doe" />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                      placeholder="john@example.com" />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Subject</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                    placeholder="Reservation inquiry" />
                  {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Message</label>
                  <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
                    placeholder="Tell us how we can help..." />
                  {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                </div>
                <Button type="submit" variant="gold" size="lg" className="text-sm tracking-wider uppercase font-medium w-full sm:w-auto px-10 py-6" disabled={submitting}>
                  {submitting ? "Sending..." : <>Send Message <Send className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
