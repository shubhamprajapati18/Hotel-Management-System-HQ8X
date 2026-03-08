import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronRight } from "lucide-react";

const reservations = [
  { id: "R-1001", guest: "Sarah Chen", room: "Ocean View Suite", checkIn: "Mar 15, 2026", checkOut: "Mar 19, 2026", status: "Confirmed", amount: "$1,800" },
  { id: "R-1002", guest: "Michael Ross", room: "City Skyline Deluxe", checkIn: "Mar 16, 2026", checkOut: "Mar 20, 2026", status: "Pending", amount: "$1,280" },
  { id: "R-1003", guest: "Emma Watson", room: "Royal Penthouse", checkIn: "Mar 17, 2026", checkOut: "Mar 21, 2026", status: "Confirmed", amount: "$4,800" },
  { id: "R-1004", guest: "David Kim", room: "Garden Retreat Suite", checkIn: "Mar 18, 2026", checkOut: "Mar 20, 2026", status: "Checked In", amount: "$760" },
  { id: "R-1005", guest: "Lisa Park", room: "Executive Deluxe", checkIn: "Mar 19, 2026", checkOut: "Mar 22, 2026", status: "Cancelled", amount: "$840" },
  { id: "R-1006", guest: "Tom Harris", room: "Presidential Suite", checkIn: "Mar 20, 2026", checkOut: "Mar 25, 2026", status: "Confirmed", amount: "$4,750" },
];

const statusStyles: Record<string, string> = {
  Confirmed: "bg-accent/20 text-accent",
  Pending: "bg-primary/20 text-primary",
  "Checked In": "bg-blue-500/20 text-blue-400",
  Cancelled: "bg-destructive/20 text-destructive",
};

export default function AdminReservations() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Reservations</h1>
            <p className="text-muted-foreground text-sm">Manage all guest bookings</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search bookings..." className="pl-9 bg-secondary border-border w-64" />
            </div>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Guest</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Room</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Check-in</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Check-out</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{r.id}</td>
                <td className="py-3 px-4 font-medium text-foreground">{r.guest}</td>
                <td className="py-3 px-4 text-foreground/80">{r.room}</td>
                <td className="py-3 px-4 text-muted-foreground">{r.checkIn}</td>
                <td className="py-3 px-4 text-muted-foreground">{r.checkOut}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[r.status] || ""}`}>{r.status}</span>
                </td>
                <td className="py-3 px-4 text-right font-semibold text-primary">{r.amount}</td>
                <td className="py-3 px-4"><Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </AdminLayout>
  );
}
