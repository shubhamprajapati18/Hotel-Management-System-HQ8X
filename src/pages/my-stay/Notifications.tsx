import { MyStayLayout } from "@/components/MyStayLayout";
import { motion } from "framer-motion";
import { Bell, CalendarDays, ConciergeBell, Sparkles } from "lucide-react";

const notifications = [
  { icon: CalendarDays, text: "Your Ocean View Suite booking is confirmed for Mar 15.", time: "2 hours ago", unread: true },
  { icon: ConciergeBell, text: "Room service menu updated — new spring specialties available.", time: "Yesterday", unread: true },
  { icon: Sparkles, text: "Spa appointment available: Book your relaxation session today.", time: "2 days ago", unread: false },
  { icon: Bell, text: "Welcome to HQ8X! Complete your profile for a personalized experience.", time: "1 week ago", unread: false },
];

export default function Notifications() {
  return (
    <MyStayLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
        <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-1 tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground mb-6">Stay updated on your reservations and hotel services.</p>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {notifications.map((n, i) => (
            <div key={i} className={`flex items-start gap-4 p-5 border-b border-border last:border-0 transition-colors ${n.unread ? "bg-primary/[0.03]" : ""}`}>
              <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${n.unread ? "bg-primary/10" : "bg-secondary"}`}>
                <n.icon className={`h-4 w-4 ${n.unread ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${n.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>{n.text}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
              </div>
              {n.unread && <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />}
            </div>
          ))}
        </div>
      </motion.div>
    </MyStayLayout>
  );
}
