import { MyStayLayout } from "@/components/MyStayLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConciergeBell, Coffee, UtensilsCrossed, Wine, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const menuItems = [
  { icon: Coffee, label: "Breakfast", desc: "Continental or full breakfast delivered to your room", price: "$35" },
  { icon: UtensilsCrossed, label: "Lunch / Dinner", desc: "Order from our fine dining menu", price: "$55+" },
  { icon: Wine, label: "Beverages", desc: "Wine, cocktails, or non-alcoholic drinks", price: "$15+" },
  { icon: ConciergeBell, label: "Special Request", desc: "Custom orders and dietary accommodations", price: "Varies" },
];

export default function RoomServices() {
  const [notes, setNotes] = useState("");

  const handleOrder = (item: string) => {
    toast.success(`${item} order placed! We'll deliver it shortly.`);
    setNotes("");
  };

  return (
    <MyStayLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
        <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-1 tracking-tight">Room Services</h2>
        <p className="text-sm text-muted-foreground mb-6">Order food, beverages, or special items to your room.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {menuItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-card p-5 md:p-6 flex flex-col gap-3 hover-lift">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/8 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-medium text-foreground">{item.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <span className="text-sm font-heading font-semibold text-primary whitespace-nowrap">{item.price}</span>
              </div>
              <Button variant="gold-outline" size="sm" onClick={() => handleOrder(item.label)} className="self-end">
                Order Now
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h3 className="font-heading text-base font-medium text-foreground mb-3">Custom Request</h3>
          <Textarea
            placeholder="Describe what you'd like (e.g., extra pillows, birthday cake, specific dietary needs)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Average delivery: 20-30 minutes
            </div>
            <Button variant="luxury" size="sm" onClick={() => { toast.success("Custom request submitted!"); setNotes(""); }} disabled={!notes.trim()}>
              Submit Request
            </Button>
          </div>
        </div>
      </motion.div>
    </MyStayLayout>
  );
}
