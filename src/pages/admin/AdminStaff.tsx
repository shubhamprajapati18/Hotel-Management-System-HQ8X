import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserPlus, Loader2, Pencil, Trash2, Download, DollarSign, CheckCircle2, XCircle } from "lucide-react";
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

const emptyForm = { name: "", role: "", department: "Housekeeping", shift: "Morning", status: "Active", phone: "", email: "", notes: "", salary: "0", join_date: new Date().toISOString().split("T")[0], pay_day: "1" };

export default function AdminStaff() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [payOpen, setPayOpen] = useState(false);
  const [payStaff, setPayStaff] = useState<any>(null);
  const [payMonth, setPayMonth] = useState(format(new Date(), "yyyy-MM"));
  const [payNotes, setPayNotes] = useState("");
  const queryClient = useQueryClient();

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["admin-staff"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["admin-staff-payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff_payments").select("*").order("paid_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

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
      const { error: err2 } = await supabase.from("staff").update({ salary_paid: true }).eq("id", staffId);
      if (err2) throw err2;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      queryClient.invalidateQueries({ queryKey: ["admin-staff-payments"] });
      toast.success("Salary payment recorded");
      setPayOpen(false);
      setPayStaff(null);
      setPayNotes("");
    },
    onError: () => toast.error("Failed to record payment"),
  });

  const resetPaidMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff").update({ salary_paid: false }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      toast.success("Marked as unpaid");
    },
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

  const openPayDialog = (s: any) => {
    setPayStaff(s);
    setPayMonth(format(new Date(), "yyyy-MM"));
    setPayNotes("");
    setPayOpen(true);
  };

  const staffMap: Record<string, any> = {};
  staff.forEach((s: any) => { staffMap[s.id] = s; });

  const handleExportStaff = () => {
    exportToCSV(staff.map((s: any) => ({
      Name: s.name, Role: s.role, Department: s.department, Shift: s.shift, Status: s.status,
      Email: s.email || "", Phone: s.phone || "", Salary: Number(s.salary),
      "Paid This Month": s.salary_paid ? "Yes" : "No",
      "Join Date": s.join_date, "Pay Day": s.pay_day, Notes: s.notes || "",
    })), `staff-${format(new Date(), "yyyy-MM-dd")}`);
  };

  const handleExportPayments = () => {
    exportToCSV(payments.map((p: any) => ({
      Staff: staffMap[p.staff_id]?.name || "Unknown", Amount: Number(p.amount),
      Month: p.month, "Paid At": format(parseISO(p.paid_at), "MMM d, yyyy HH:mm"),
      Notes: p.notes || "",
    })), `salary-payments-${format(new Date(), "yyyy-MM-dd")}`);
  };

  const totalMonthly = staff.filter((s: any) => s.status === "Active").reduce((sum: number, s: any) => sum + Number(s.salary), 0);
  const paidCount = staff.filter((s: any) => s.salary_paid).length;
  const unpaidCount = staff.filter((s: any) => s.status === "Active" && !s.salary_paid).length;

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Staff Management</h1>
            <p className="text-muted-foreground text-sm">Manage staff, salaries & payments ({staff.length} members)</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportStaff} disabled={!staff.length}>
              <Download className="h-4 w-4 mr-2" />Export Staff
            </Button>
            <Button variant="gold" onClick={openAdd}><UserPlus className="h-4 w-4 mr-2" />Add Staff</Button>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="kpi-card text-center">
          <DollarSign className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">${totalMonthly.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Monthly Payroll</p>
        </div>
        <div className="kpi-card text-center">
          <CheckCircle2 className="h-5 w-5 text-accent mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{paidCount}</p>
          <p className="text-xs text-muted-foreground">Paid</p>
        </div>
        <div className="kpi-card text-center">
          <XCircle className="h-5 w-5 text-destructive mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{unpaidCount}</p>
          <p className="text-xs text-muted-foreground">Unpaid</p>
        </div>
        <div className="kpi-card text-center">
          <UserPlus className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{staff.length}</p>
          <p className="text-xs text-muted-foreground">Total Staff</p>
        </div>
      </div>

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff Directory</TabsTrigger>
          <TabsTrigger value="payments">Salary Payments</TabsTrigger>
        </TabsList>

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
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Dept</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Shift</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Salary</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Paid</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Joined</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Pay Day</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s: any) => (
                    <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{s.name[0]}</div>
                          <div>
                            <span className="font-medium text-foreground">{s.name}</span>
                            {s.email && <div className="text-[10px] text-muted-foreground">{s.email}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground/80">{s.role}</td>
                      <td className="py-3 px-4 text-muted-foreground">{s.department}</td>
                      <td className="py-3 px-4 text-muted-foreground">{s.shift}</td>
                      <td className="py-3 px-4 text-right font-semibold text-primary">${Number(s.salary).toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        {s.salary_paid ? (
                          <button onClick={() => resetPaidMutation.mutate(s.id)} title="Click to mark unpaid">
                            <CheckCircle2 className="h-5 w-5 text-accent mx-auto" />
                          </button>
                        ) : (
                          <button onClick={() => openPayDialog(s)} title="Click to pay">
                            <XCircle className="h-5 w-5 text-destructive/60 mx-auto" />
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{s.join_date}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{s.pay_day}{getOrdinal(s.pay_day)}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium ${s.status === "Active" ? "text-accent" : s.status === "On Leave" ? "text-primary" : "text-muted-foreground"}`}>{s.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove {s.name}?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently remove this staff member and all their payment records.</AlertDialogDescription>
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
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="payments">
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={handleExportPayments} disabled={!payments.length}>
              <Download className="h-4 w-4 mr-2" />Export Payments CSV
            </Button>
          </div>
          {paymentsLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : payments.length === 0 ? (
            <div className="admin-section text-center py-10"><p className="text-muted-foreground text-sm">No salary payments recorded yet.</p></div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-section overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Staff</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Month</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Paid At</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p: any) => {
                    const member = staffMap[p.staff_id];
                    return (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{member?.name || "Deleted Staff"}</td>
                        <td className="py-3 px-4 text-foreground/80">{p.month}</td>
                        <td className="py-3 px-4 text-right font-semibold text-primary">${Number(p.amount).toLocaleString()}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{format(parseISO(p.paid_at), "MMM d, yyyy HH:mm")}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{p.notes || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Staff Dialog */}
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
              <div><Label>Monthly Salary ($)</Label><Input type="number" min="0" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></div>
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

      {/* Pay Salary Dialog */}
      <Dialog open={payOpen} onOpenChange={(o) => !o && setPayOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Salary Payment</DialogTitle>
            <DialogDescription>Pay {payStaff?.name} — ${Number(payStaff?.salary || 0).toLocaleString()}/month</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label>Month</Label><Input type="month" value={payMonth} onChange={(e) => setPayMonth(e.target.value)} /></div>
            <div><Label>Amount</Label><Input type="number" value={payStaff?.salary || 0} disabled className="bg-muted" /></div>
            <div><Label>Notes</Label><Textarea value={payNotes} onChange={(e) => setPayNotes(e.target.value)} placeholder="Optional payment notes" rows={2} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPayOpen(false)}>Cancel</Button>
              <Button
                disabled={markPaidMutation.isPending}
                onClick={() => markPaidMutation.mutate({ staffId: payStaff.id, amount: Number(payStaff.salary), month: payMonth, notes: payNotes })}
              >
                {markPaidMutation.isPending ? "Processing..." : "Confirm Payment"}
              </Button>
            </div>
          </div>
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
