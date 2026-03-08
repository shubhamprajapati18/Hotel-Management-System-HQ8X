import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserPlus, Loader2, Pencil, Trash2, Download, DollarSign, CheckCircle2, XCircle, History, ChevronLeft, ChevronRight } from "lucide-react";
import { formatINR } from "@/lib/formatCurrency";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToCSV } from "@/lib/exportCSV";
import { format, parseISO } from "date-fns";

const departments = ["Housekeeping", "Maintenance", "Front Desk", "Guest Services", "F&B", "Security", "Management"];
const shifts = ["Morning", "Evening", "Night", "Rotating"];
const statuses = ["Active", "On Leave", "Inactive"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const emptyForm = { name: "", role: "", department: "Housekeeping", shift: "Morning", status: "Active", phone: "", email: "", notes: "", salary: "0", join_date: new Date().toISOString().split("T")[0], pay_day: "1" };

export default function AdminStaff() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [historyStaff, setHistoryStaff] = useState<any>(null);
  const [historyYear, setHistoryYear] = useState(new Date().getFullYear());
  const [payMonth, setPayMonth] = useState("");
  const [payNotes, setPayNotes] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["admin-staff"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: allPayments = [] } = useQuery({
    queryKey: ["admin-staff-payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff_payments").select("*").order("paid_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Group payments by staff_id
  const paymentsByStaff: Record<string, any[]> = {};
  allPayments.forEach((p: any) => {
    if (!paymentsByStaff[p.staff_id]) paymentsByStaff[p.staff_id] = [];
    paymentsByStaff[p.staff_id].push(p);
  });

  // Get paid months set for a staff member in a given year
  const getPaidMonths = (staffId: string, year: number): Set<string> => {
    const set = new Set<string>();
    (paymentsByStaff[staffId] || []).forEach((p: any) => {
      if (p.month.startsWith(String(year))) set.add(p.month);
    });
    return set;
  };

  const saveMutation = useMutation({
    mutationFn: async (values: any) => {
      const payload = { ...values, salary: Number(values.salary), pay_day: Number(values.pay_day) };
      if (values.id) {
        const { error } = await supabase.from("staff").update(payload).eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("staff").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      toast.success(editing ? "Staff updated" : "Staff added");
      closeDialog();
    },
    onError: () => toast.error("Failed to save staff member"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      queryClient.invalidateQueries({ queryKey: ["admin-staff-payments"] });
      toast.success("Staff member removed");
    },
    onError: () => toast.error("Failed to delete staff"),
  });

  const markPaidMutation = useMutation({
    mutationFn: async ({ staffId, amount, month, notes }: { staffId: string; amount: number; month: string; notes: string }) => {
      const { error } = await supabase.from("staff_payments").insert({ staff_id: staffId, amount, month, notes });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff-payments"] });
      toast.success("Salary payment recorded");
      setPayOpen(false);
      setPayNotes("");
    },
    onError: () => toast.error("Failed to record payment"),
  });

  const deletePaymentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff_payments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff-payments"] });
      toast.success("Payment record removed");
    },
    onError: () => toast.error("Failed to delete payment"),
  });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (s: any) => {
    setEditing(s);
    setForm({ name: s.name, role: s.role, department: s.department, shift: s.shift, status: s.status, phone: s.phone || "", email: s.email || "", notes: s.notes || "", salary: String(s.salary || 0), join_date: s.join_date || new Date().toISOString().split("T")[0], pay_day: String(s.pay_day || 1) });
    setOpen(true);
  };
  const closeDialog = () => { setOpen(false); setEditing(null); setForm(emptyForm); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) { toast.error("Name and role are required"); return; }
    saveMutation.mutate(editing ? { ...form, id: editing.id } : form);
  };

  const openHistory = (s: any) => {
    setHistoryStaff(s);
    setHistoryYear(new Date().getFullYear());
  };

  const openPayForMonth = (s: any, month: string) => {
    setPayMonth(month);
    setPayNotes("");
    setPayOpen(true);
  };

  const staffMap: Record<string, any> = {};
  staff.forEach((s: any) => { staffMap[s.id] = s; });

  const handleExportStaff = () => {
    exportToCSV(staff.map((s: any) => ({
      Name: s.name, Role: s.role, Department: s.department, Shift: s.shift, Status: s.status,
      Email: s.email || "", Phone: s.phone || "", "Monthly Salary": Number(s.salary),
      "Join Date": s.join_date, "Pay Day": s.pay_day, Notes: s.notes || "",
    })), `staff-${format(new Date(), "yyyy-MM-dd")}`);
  };

  const handleExportPayments = () => {
    exportToCSV(allPayments.map((p: any) => ({
      Staff: staffMap[p.staff_id]?.name || "Unknown", Amount: Number(p.amount),
      Month: p.month, "Paid At": format(parseISO(p.paid_at), "MMM d, yyyy HH:mm"),
      Notes: p.notes || "",
    })), `salary-payments-${format(new Date(), "yyyy-MM-dd")}`);
  };

  const totalMonthly = staff.filter((s: any) => s.status === "Active").reduce((sum: number, s: any) => sum + Number(s.salary), 0);
  const currentMonth = format(new Date(), "yyyy-MM");
  const paidThisMonth = staff.filter((s: any) => getPaidMonths(s.id, new Date().getFullYear()).has(currentMonth)).length;
  const unpaidThisMonth = staff.filter((s: any) => s.status === "Active" && !getPaidMonths(s.id, new Date().getFullYear()).has(currentMonth)).length;

  // History staff payments for the selected year
  const historyPayments = historyStaff ? (paymentsByStaff[historyStaff.id] || []) : [];
  const historyPaidMonths = historyStaff ? getPaidMonths(historyStaff.id, historyYear) : new Set<string>();

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Staff Management</h1>
            <p className="text-muted-foreground text-sm">Manage staff, salaries & payment history ({staff.length} members)</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportStaff} disabled={!staff.length}>
              <Download className="h-4 w-4 mr-2" />Staff CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPayments} disabled={!allPayments.length}>
              <Download className="h-4 w-4 mr-2" />Payments CSV
            </Button>
            <Button variant="gold" onClick={openAdd}><UserPlus className="h-4 w-4 mr-2" />Add Staff</Button>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: DollarSign, value: formatINR(totalMonthly), label: "Monthly Payroll", color: "text-primary" },
          { icon: CheckCircle2, value: paidThisMonth, label: `Paid (${format(new Date(), "MMM")})`, color: "text-accent" },
          { icon: XCircle, value: unpaidThisMonth, label: `Unpaid (${format(new Date(), "MMM")})`, color: "text-destructive" },
          { icon: UserPlus, value: staff.length, label: "Total Staff", color: "text-primary" },
        ].map((k) => (
          <div key={k.label} className="kpi-card text-center">
            <k.icon className={`h-5 w-5 ${k.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff Directory</TabsTrigger>
          <TabsTrigger value="payments">All Payment History</TabsTrigger>
        </TabsList>

        {/* STAFF TAB */}
        <TabsContent value="staff">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : staff.length === 0 ? (
            <div className="admin-section text-center py-10"><p className="text-muted-foreground text-sm">No staff members yet.</p></div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="admin-section overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Role / Dept</th>
                    <th className="text-right py-3 px-3 text-muted-foreground font-medium">Salary</th>
                    <th className="text-center py-3 px-3 text-muted-foreground font-medium">{format(new Date(), "MMM")} Paid?</th>
                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Joined</th>
                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Pay Day</th>
                    <th className="text-left py-3 px-3 text-muted-foreground font-medium">Status</th>
                    <th className="py-3 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s: any) => {
                    const isPaidThisMonth = getPaidMonths(s.id, new Date().getFullYear()).has(currentMonth);
                    return (
                      <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{s.name[0]}</div>
                            <div>
                              <span className="font-medium text-foreground">{s.name}</span>
                              {s.email && <div className="text-[10px] text-muted-foreground">{s.email}</div>}
                              {s.phone && <div className="text-[10px] text-muted-foreground">{s.phone}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-foreground/80">{s.role}</span>
                          <div className="text-[10px] text-muted-foreground">{s.department} · {s.shift}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-primary">{formatINR(s.salary)}</td>
                        <td className="py-3 px-3 text-center">
                          {isPaidThisMonth ? (
                            <span className="inline-flex items-center gap-1 text-accent text-xs font-medium"><CheckCircle2 className="h-4 w-4" /> Paid</span>
                          ) : (
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setHistoryStaff(s); openPayForMonth(s, currentMonth); }}>
                              Mark Paid
                            </Button>
                          )}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground text-xs">{s.join_date}</td>
                        <td className="py-3 px-3 text-muted-foreground text-xs">{s.pay_day}{getOrdinal(s.pay_day)}</td>
                        <td className="py-3 px-3">
                          <span className={`text-xs font-medium ${s.status === "Active" ? "text-accent" : s.status === "On Leave" ? "text-primary" : "text-muted-foreground"}`}>{s.status}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Payment History" onClick={() => openHistory(s)}><History className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove {s.name}?</AlertDialogTitle>
                                  <AlertDialogDescription>This will permanently remove this staff member and all payment records.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteMutation.mutate(s.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          )}
        </TabsContent>

        {/* ALL PAYMENTS TAB */}
        <TabsContent value="payments">
          {allPayments.length === 0 ? (
            <div className="admin-section text-center py-10"><p className="text-muted-foreground text-sm">No salary payments recorded yet.</p></div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-section overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Staff</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Month</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Paid On</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Notes</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.map((p: any) => {
                    const member = staffMap[p.staff_id];
                    return (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{member?.name || "Deleted Staff"}</td>
                        <td className="py-3 px-4 text-foreground/80">{p.month}</td>
                        <td className="py-3 px-4 text-right font-semibold text-primary">₹{Number(p.amount).toLocaleString()}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{format(parseISO(p.paid_at), "MMM d, yyyy")}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{p.notes || "—"}</td>
                        <td className="py-3 px-4">
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this payment record?</AlertDialogTitle>
                                <AlertDialogDescription>This will remove the payment for {member?.name || "staff"} ({p.month}).</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deletePaymentMutation.mutate(p.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      {/* ===== STAFF PAYMENT HISTORY DIALOG ===== */}
      <Dialog open={!!historyStaff && !payOpen} onOpenChange={(o) => !o && setHistoryStaff(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{historyStaff?.name} — Payment History</DialogTitle>
            <DialogDescription>
              Salary: ₹{Number(historyStaff?.salary || 0).toLocaleString()}/mo · Joined: {historyStaff?.join_date} · Pay day: {historyStaff?.pay_day}{getOrdinal(historyStaff?.pay_day || 1)}
            </DialogDescription>
          </DialogHeader>

          {/* Year month calendar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={() => setHistoryYear(historyYear - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="font-bold text-foreground text-lg">{historyYear}</span>
              <Button variant="ghost" size="icon" onClick={() => setHistoryYear(historyYear + 1)} disabled={historyYear >= new Date().getFullYear()}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {MONTHS.map((m, i) => {
                const monthKey = `${historyYear}-${String(i + 1).padStart(2, "0")}`;
                const isPaid = historyPaidMonths.has(monthKey);
                const isFuture = new Date(historyYear, i + 1, 0) > new Date();
                return (
                  <button
                    key={monthKey}
                    disabled={isFuture}
                    className={`rounded-lg p-3 text-center text-sm font-medium border transition-all ${
                      isPaid
                        ? "bg-accent/15 border-accent/40 text-accent"
                        : isFuture
                        ? "bg-muted/30 border-border/30 text-muted-foreground/40 cursor-not-allowed"
                        : "bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!isPaid && !isFuture && historyStaff) {
                        openPayForMonth(historyStaff, monthKey);
                      }
                    }}
                  >
                    <div>{m}</div>
                    <div className="mt-1">
                      {isPaid ? <CheckCircle2 className="h-4 w-4 mx-auto" /> : isFuture ? <span className="text-[10px]">—</span> : <XCircle className="h-4 w-4 mx-auto" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment log for this staff */}
          {historyPayments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-foreground mb-2">Payment Log</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {historyPayments.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2 text-sm">
                    <div>
                      <span className="font-medium text-foreground">{p.month}</span>
                      <span className="text-muted-foreground ml-2">— ₹{Number(p.amount).toLocaleString()}</span>
                      {p.notes && <span className="text-muted-foreground text-xs ml-2">({p.notes})</span>}
                    </div>
                    <span className="text-muted-foreground text-xs">{format(parseISO(p.paid_at), "MMM d, yyyy")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== PAY SALARY DIALOG ===== */}
      <Dialog open={payOpen} onOpenChange={(o) => !o && setPayOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Salary Payment</DialogTitle>
            <DialogDescription>Pay {historyStaff?.name} for {payMonth}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label>Month</Label><Input value={payMonth} disabled className="bg-muted" /></div>
            <div><Label>Amount</Label><Input type="number" value={historyStaff?.salary || 0} disabled className="bg-muted" /></div>
            <div><Label>Notes (optional)</Label><Textarea value={payNotes} onChange={(e) => setPayNotes(e.target.value)} placeholder="Payment notes..." rows={2} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPayOpen(false)}>Cancel</Button>
              <Button
                disabled={markPaidMutation.isPending}
                onClick={() => markPaidMutation.mutate({ staffId: historyStaff.id, amount: Number(historyStaff.salary), month: payMonth, notes: payNotes })}
              >
                {markPaidMutation.isPending ? "Processing..." : "Confirm Payment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== ADD/EDIT STAFF DIALOG ===== */}
      <Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Staff" : "Add Staff Member"}</DialogTitle>
            <DialogDescription>{editing ? "Update staff details" : "Enter staff member information"}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Full Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" /></div>
              <div><Label>Role *</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Housekeeper" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Department</Label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Shift</Label>
                <Select value={form.shift} onValueChange={(v) => setForm({ ...form, shift: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{shifts.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Monthly Salary (₹)</Label><Input type="number" min="0" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></div>
              <div><Label>Join Date</Label><Input type="date" value={form.join_date} onChange={(e) => setForm({ ...form, join_date: e.target.value })} /></div>
              <div><Label>Pay Day (1-31)</Label><Input type="number" min="1" max="31" value={form.pay_day} onChange={(e) => setForm({ ...form, pay_day: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@hotel.com" /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 890" /></div>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes..." rows={2} /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? "Saving..." : editing ? "Update" : "Add Staff"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
