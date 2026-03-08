import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AdminManualBooking } from "@/components/AdminManualBooking";

const statusColors: Record<string, string> = {
  confirmed: "bg-accent/70 text-accent-foreground",
  pending: "bg-primary/60 text-primary-foreground",
  "checked-in": "bg-blue-500/70 text-white",
  cancelled: "bg-destructive/40 text-destructive-foreground line-through",
};

export default function AdminBookingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-calendar-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*").order("check_in");
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("user_id, first_name, last_name");
      if (error) throw error;
      return data;
    },
  });

  const profileMap = new Map(profiles.map((p) => [p.user_id, `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Guest"]));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const bookingsOnDay = useMemo(() => {
    const map = new Map<string, typeof bookings>();
    calendarDays.forEach((day) => {
      const dayKey = format(day, "yyyy-MM-dd");
      const dayBookings = bookings.filter((b) => {
        const checkIn = parseISO(b.check_in);
        const checkOut = parseISO(b.check_out);
        return isWithinInterval(day, { start: checkIn, end: checkOut }) || isSameDay(day, checkIn) || isSameDay(day, checkOut);
      });
      if (dayBookings.length > 0) map.set(dayKey, dayBookings);
    });
    return map;
  }, [bookings, calendarDays]);

  const selectedDayBookings = selectedDay
    ? bookings.filter((b) => {
        const checkIn = parseISO(b.check_in);
        const checkOut = parseISO(b.check_out);
        return isWithinInterval(selectedDay, { start: checkIn, end: checkOut }) || isSameDay(selectedDay, checkIn) || isSameDay(selectedDay, checkOut);
      })
    : [];

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Booking Calendar</h1>
            <p className="text-muted-foreground text-sm">Visual overview of all reservations</p>
          </div>
          <div className="flex items-center gap-3">
            <AdminManualBooking />
            <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-heading text-lg font-semibold text-foreground min-w-[160px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          </div>
          </div>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.entries({ confirmed: "Confirmed", pending: "Pending", "checked-in": "Checked In", cancelled: "Cancelled" }).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded-sm ${statusColors[key]}`} />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className="h-[500px] w-full rounded-xl" />
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section p-4 overflow-x-auto">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayKey = format(day, "yyyy-MM-dd");
              const dayB = bookingsOnDay.get(dayKey) || [];
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={dayKey}
                  onClick={() => dayB.length > 0 && setSelectedDay(day)}
                  className={`min-h-[90px] rounded-lg border p-1.5 transition-colors cursor-pointer
                    ${isCurrentMonth ? "border-border bg-background" : "border-transparent bg-muted/30 opacity-50"}
                    ${isToday ? "ring-2 ring-primary/40" : ""}
                    ${dayB.length > 0 ? "hover:bg-secondary/50" : ""}
                  `}
                >
                  <div className={`text-xs font-medium mb-1 ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                    {format(day, "d")}
                  </div>
                  <div className="space-y-0.5">
                    {dayB.slice(0, 3).map((b) => (
                      <div key={b.id} className={`text-[10px] px-1 py-0.5 rounded truncate ${statusColors[b.status] || "bg-muted text-muted-foreground"}`}>
                        {b.room_name}
                      </div>
                    ))}
                    {dayB.length > 3 && (
                      <div className="text-[10px] text-muted-foreground text-center">+{dayB.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Day Detail Dialog */}
      <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDay && format(selectedDay, "EEEE, MMMM d, yyyy")}</DialogTitle>
            <DialogDescription>{selectedDayBookings.length} booking{selectedDayBookings.length !== 1 ? "s" : ""} on this day</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {selectedDayBookings.map((b) => (
              <div key={b.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground text-sm">{b.room_name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[b.status] || "bg-muted text-muted-foreground"}`}>{b.status}</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><span className="font-medium text-foreground">Guest:</span> {profileMap.get(b.user_id) || "Guest"}</p>
                  <p><span className="font-medium text-foreground">Dates:</span> {format(parseISO(b.check_in), "MMM d")} – {format(parseISO(b.check_out), "MMM d, yyyy")}</p>
                  <p><span className="font-medium text-foreground">Amount:</span> <span className="text-primary font-semibold">${Number(b.total_price).toLocaleString()}</span></p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
