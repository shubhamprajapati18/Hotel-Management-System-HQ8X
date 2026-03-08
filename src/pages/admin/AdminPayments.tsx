import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

const transactions = [
  { id: "P-2001", guest: "Sarah Chen", description: "Ocean View Suite - 4 nights", amount: "$1,800", type: "Payment", date: "Mar 15, 2026" },
  { id: "P-2002", guest: "Michael Ross", description: "City Skyline Deluxe - 4 nights", amount: "$1,280", type: "Payment", date: "Mar 16, 2026" },
  { id: "P-2003", guest: "Emma Watson", description: "Royal Penthouse - Refund", amount: "-$600", type: "Refund", date: "Mar 14, 2026" },
  { id: "P-2004", guest: "David Kim", description: "Garden Retreat - 2 nights", amount: "$760", type: "Payment", date: "Mar 18, 2026" },
  { id: "P-2005", guest: "Lisa Park", description: "Room Service Charge", amount: "$145", type: "Payment", date: "Mar 17, 2026" },
];

export default function AdminPayments() {
  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-1">Payments</h1>
        <p className="text-muted-foreground text-sm mb-8">Transaction history and invoices</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today", value: "$4,385" },
          { label: "This Week", value: "$28,740" },
          { label: "This Month", value: "$124,580" },
          { label: "Pending", value: "$3,200" },
        ].map((k) => (
          <div key={k.label} className="kpi-card text-center">
            <DollarSign className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Guest</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Description</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{t.id}</td>
                <td className="py-3 px-4 font-medium text-foreground">{t.guest}</td>
                <td className="py-3 px-4 text-foreground/80">{t.description}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${t.type === "Refund" ? "text-destructive" : "text-accent"}`}>
                    {t.type === "Refund" ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}{t.type}
                  </span>
                </td>
                <td className={`py-3 px-4 text-right font-semibold ${t.type === "Refund" ? "text-destructive" : "text-primary"}`}>{t.amount}</td>
                <td className="py-3 px-4 text-right text-muted-foreground">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </AdminLayout>
  );
}
