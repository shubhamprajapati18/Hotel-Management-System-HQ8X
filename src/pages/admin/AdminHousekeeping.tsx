import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SprayCan, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const housekeepingData = [
  { room: "101 - Ocean View Suite", status: "Clean", assignee: "Maria G.", lastCleaned: "10 min ago" },
  { room: "102 - City Skyline Deluxe", status: "Dirty", assignee: "Unassigned", lastCleaned: "2 hours ago" },
  { room: "103 - Garden Retreat Suite", status: "In Progress", assignee: "James T.", lastCleaned: "—" },
  { room: "201 - Executive Deluxe", status: "Clean", assignee: "Maria G.", lastCleaned: "30 min ago" },
  { room: "202 - Royal Penthouse", status: "Maintenance", assignee: "—", lastCleaned: "1 day ago" },
  { room: "203 - Presidential Suite", status: "Dirty", assignee: "Unassigned", lastCleaned: "4 hours ago" },
  { room: "301 - Ocean View Suite", status: "Clean", assignee: "Sara L.", lastCleaned: "15 min ago" },
  { room: "302 - City Skyline Deluxe", status: "In Progress", assignee: "James T.", lastCleaned: "—" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle; className: string }> = {
  Clean: { icon: CheckCircle, className: "text-accent bg-accent/10" },
  Dirty: { icon: AlertTriangle, className: "text-destructive bg-destructive/10" },
  "In Progress": { icon: Clock, className: "text-primary bg-primary/10" },
  Maintenance: { icon: SprayCan, className: "text-muted-foreground bg-muted" },
};

export default function AdminHousekeeping() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Housekeeping</h1>
        <p className="text-muted-foreground text-sm mb-8">Track and manage room cleaning status</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Clean", count: 3, color: "text-accent" },
          { label: "Dirty", count: 2, color: "text-destructive" },
          { label: "In Progress", count: 2, color: "text-primary" },
          { label: "Maintenance", count: 1, color: "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="kpi-card text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Room</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Assigned To</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Last Cleaned</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {housekeepingData.map((h, i) => {
              const cfg = statusConfig[h.status];
              const Icon = cfg.icon;
              return (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{h.room}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.className}`}>
                      <Icon className="h-3 w-3" />{h.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{h.assignee}</td>
                  <td className="py-3 px-4 text-muted-foreground">{h.lastCleaned}</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="gold-outline" size="sm">
                      {h.status === "Dirty" ? "Assign" : h.status === "In Progress" ? "Mark Clean" : "View"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </AdminLayout>
  );
}
