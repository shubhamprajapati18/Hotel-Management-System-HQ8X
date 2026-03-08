import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const staff = [
  { name: "Maria Garcia", role: "Housekeeping Lead", department: "Housekeeping", status: "Active", shift: "Morning" },
  { name: "James Thompson", role: "Maintenance Tech", department: "Maintenance", status: "Active", shift: "Morning" },
  { name: "Sara Lee", role: "Housekeeper", department: "Housekeeping", status: "Active", shift: "Evening" },
  { name: "Robert Chen", role: "Front Desk Manager", department: "Front Desk", status: "Active", shift: "Morning" },
  { name: "Anna Kim", role: "Concierge", department: "Guest Services", status: "On Leave", shift: "—" },
  { name: "Mike Johnson", role: "Chef de Cuisine", department: "F&B", status: "Active", shift: "Evening" },
];

export default function AdminStaff() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Staff Management</h1>
            <p className="text-muted-foreground text-sm">Manage hotel staff and assignments</p>
          </div>
          <Button variant="gold"><UserPlus className="h-4 w-4 mr-2" />Add Staff</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Role</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Department</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Shift</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{s.name[0]}</div>
                    <span className="font-medium text-foreground">{s.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-foreground/80">{s.role}</td>
                <td className="py-3 px-4 text-muted-foreground">{s.department}</td>
                <td className="py-3 px-4 text-muted-foreground">{s.shift}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-medium ${s.status === "Active" ? "text-accent" : "text-primary"}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </AdminLayout>
  );
}
