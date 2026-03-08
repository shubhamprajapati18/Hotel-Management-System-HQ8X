import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm mb-8">Hotel configuration and preferences</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section space-y-5">
          <h3 className="font-heading text-lg font-semibold text-foreground">Hotel Information</h3>
          <div>
            <Label className="text-foreground/80 text-sm">Hotel Name</Label>
            <Input defaultValue="HQ8X Luxury Resort" className="mt-1 bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-foreground/80 text-sm">Email</Label>
            <Input defaultValue="contact@hq8x.com" className="mt-1 bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-foreground/80 text-sm">Phone</Label>
            <Input defaultValue="+1 (555) 123-4567" className="mt-1 bg-secondary border-border" />
          </div>
          <Button variant="gold" onClick={() => toast.success("Settings saved!")}>Save Changes</Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="admin-section space-y-5">
          <h3 className="font-heading text-lg font-semibold text-foreground">Booking Settings</h3>
          <div>
            <Label className="text-foreground/80 text-sm">Check-in Time</Label>
            <Input defaultValue="15:00" className="mt-1 bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-foreground/80 text-sm">Check-out Time</Label>
            <Input defaultValue="11:00" className="mt-1 bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-foreground/80 text-sm">Tax Rate (%)</Label>
            <Input defaultValue="10" className="mt-1 bg-secondary border-border" />
          </div>
          <Button variant="gold" onClick={() => toast.success("Settings saved!")}>Save Changes</Button>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
