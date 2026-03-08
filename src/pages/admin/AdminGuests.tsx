import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const guests = [
  { name: "Sarah Chen", email: "sarah@example.com", stays: 5, totalSpent: "$8,400", lastVisit: "Mar 15, 2026", status: "Current" },
  { name: "Michael Ross", email: "michael@example.com", stays: 3, totalSpent: "$4,200", lastVisit: "Mar 10, 2026", status: "Past" },
  { name: "Emma Watson", email: "emma@example.com", stays: 8, totalSpent: "$18,600", lastVisit: "Mar 17, 2026", status: "Current" },
  { name: "David Kim", email: "david@example.com", stays: 2, totalSpent: "$1,520", lastVisit: "Mar 18, 2026", status: "Current" },
  { name: "Lisa Park", email: "lisa@example.com", stays: 1, totalSpent: "$840", lastVisit: "Feb 20, 2026", status: "Past" },
  { name: "Tom Harris", email: "tom@example.com", stays: 12, totalSpent: "$32,400", lastVisit: "Mar 20, 2026", status: "VIP" },
];

export default function AdminGuests() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Guests</h1>
            <p className="text-muted-foreground text-sm">Guest profiles and stay history</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search guests..." className="pl-9 bg-secondary border-border w-64" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Guest</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Stays</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Total Spent</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Last Visit</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{g.name[0]}</div>
                    <span className="font-medium text-foreground">{g.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{g.email}</td>
                <td className="py-3 px-4 text-foreground">{g.stays}</td>
                <td className="py-3 px-4 text-primary font-semibold">{g.totalSpent}</td>
                <td className="py-3 px-4 text-muted-foreground">{g.lastVisit}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-medium ${g.status === "VIP" ? "text-primary" : g.status === "Current" ? "text-accent" : "text-muted-foreground"}`}>{g.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </AdminLayout>
  );
}
