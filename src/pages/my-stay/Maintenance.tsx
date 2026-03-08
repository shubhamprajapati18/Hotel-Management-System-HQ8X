import { MyStayLayout } from "@/components/MyStayLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Zap, Droplets, ThermometerSun, Wifi } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const categories = [
  { icon: Zap, label: "Electrical", desc: "Lights, outlets, or appliances not working" },
  { icon: Droplets, label: "Plumbing", desc: "Leaks, drainage, or water pressure issues" },
  { icon: ThermometerSun, label: "HVAC", desc: "Air conditioning or heating problems" },
  { icon: Wifi, label: "Connectivity", desc: "Wi-Fi, TV, or phone issues" },
  { icon: Wrench, label: "Other", desc: "Furniture, locks, or other room issues" },
];

export default function MaintenancePage() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("");

  const handleSubmit = () => {
    toast.success("Maintenance request submitted! Our team will be there shortly.");
    setCategory("");
    setDescription("");
    setUrgency("");
  };

  return (
    <MyStayLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
        <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-1 tracking-tight">Report Maintenance</h2>
        <p className="text-sm text-muted-foreground mb-6">Let us know about any issues in your room and we'll fix them promptly.</p>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-7 space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Issue Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setCategory(cat.label)}
                  className={`rounded-xl border p-3 text-center transition-all duration-300 ${
                    category === cat.label
                      ? "border-primary/40 bg-primary/8 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <cat.icon className="h-5 w-5 mx-auto mb-1.5" />
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Urgency</label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger><SelectValue placeholder="Select urgency level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low — Not urgent</SelectItem>
                <SelectItem value="medium">Medium — Inconvenient</SelectItem>
                <SelectItem value="high">High — Affecting my stay</SelectItem>
                <SelectItem value="emergency">Emergency — Immediate attention</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
            <Textarea
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <Button variant="luxury" onClick={handleSubmit} disabled={!category || !description.trim() || !urgency} className="w-full sm:w-auto">
            Submit Request
          </Button>
        </div>
      </motion.div>
    </MyStayLayout>
  );
}
