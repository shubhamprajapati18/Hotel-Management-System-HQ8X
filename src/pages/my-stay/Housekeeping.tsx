import { MyStayLayout } from "@/components/MyStayLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SprayCan, Shirt, BedDouble, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const services = [
  { icon: SprayCan, label: "Room Cleaning", desc: "Standard room cleaning and sanitization" },
  { icon: BedDouble, label: "Fresh Linens", desc: "Replace bed sheets, pillowcases, and towels" },
  { icon: Shirt, label: "Laundry Service", desc: "Pickup and delivery of laundry and dry cleaning" },
  { icon: Sparkles, label: "Deep Clean", desc: "Thorough deep cleaning of the entire room" },
];

export default function Housekeeping() {
  const [notes, setNotes] = useState("");

  return (
    <MyStayLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
        <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-1 tracking-tight">Housekeeping</h2>
        <p className="text-sm text-muted-foreground mb-6">Request cleaning, fresh linens, laundry, or other housekeeping services.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {services.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-card p-5 md:p-6 flex items-start gap-4 hover-lift">
              <div className="h-10 w-10 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-base font-medium text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 mb-3">{item.desc}</p>
                <Button variant="gold-outline" size="sm" onClick={() => toast.success(`${item.label} requested! Our team is on the way.`)}>
                  Request
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h3 className="font-heading text-base font-medium text-foreground mb-3">Additional Notes</h3>
          <Textarea
            placeholder="Any specific instructions for housekeeping (e.g., preferred time, areas to focus on)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Response time: 15-30 minutes
            </div>
            <Button variant="luxury" size="sm" onClick={() => { toast.success("Housekeeping notes submitted!"); setNotes(""); }} disabled={!notes.trim()}>
              Submit
            </Button>
          </div>
        </div>
      </motion.div>
    </MyStayLayout>
  );
}
