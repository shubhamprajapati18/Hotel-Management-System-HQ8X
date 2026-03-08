import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wrench, AlertCircle, CheckCircle, Clock } from "lucide-react";

const requests = [
  { id: "M-001", room: "202 - Royal Penthouse", issue: "AC not cooling properly", priority: "High", status: "Open", reported: "2 hours ago" },
  { id: "M-002", room: "103 - Garden Retreat", issue: "Leaking faucet in bathroom", priority: "Medium", status: "In Progress", reported: "1 day ago" },
  { id: "M-003", room: "301 - Ocean View Suite", issue: "TV remote not working", priority: "Low", status: "Open", reported: "3 hours ago" },
  { id: "M-004", room: "102 - City Deluxe", issue: "Door lock malfunction", priority: "High", status: "Resolved", reported: "2 days ago" },
  { id: "M-005", room: "Lobby", issue: "Elevator B maintenance", priority: "High", status: "In Progress", reported: "5 hours ago" },
];

const priorityStyles: Record<string, string> = {
  High: "text-destructive bg-destructive/10",
  Medium: "text-primary bg-primary/10",
  Low: "text-muted-foreground bg-muted",
};
const statusStyles: Record<string, string> = {
  Open: "text-destructive",
  "In Progress": "text-primary",
  Resolved: "text-accent",
};

export default function AdminMaintenance() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Maintenance</h1>
            <p className="text-muted-foreground text-sm">Track and manage repair requests</p>
          </div>
          <Button variant="gold"><Wrench className="h-4 w-4 mr-2" />New Request</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Location</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Issue</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Priority</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Reported</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{r.id}</td>
                <td className="py-3 px-4 font-medium text-foreground">{r.room}</td>
                <td className="py-3 px-4 text-foreground/80">{r.issue}</td>
                <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyles[r.priority]}`}>{r.priority}</span></td>
                <td className="py-3 px-4"><span className={`text-xs font-medium ${statusStyles[r.status]}`}>{r.status}</span></td>
                <td className="py-3 px-4 text-muted-foreground">{r.reported}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </AdminLayout>
  );
}
