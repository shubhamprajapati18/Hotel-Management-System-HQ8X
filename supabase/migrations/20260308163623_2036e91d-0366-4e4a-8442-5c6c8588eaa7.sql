
-- Staff table
CREATE TABLE public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  shift text NOT NULL DEFAULT 'Morning',
  status text NOT NULL DEFAULT 'Active',
  phone text DEFAULT '',
  email text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view staff" ON public.staff FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert staff" ON public.staff FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update staff" ON public.staff FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete staff" ON public.staff FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Allow admins to insert bookings (for manual booking)
CREATE POLICY "Admins can insert bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

-- Allow admins to delete bookings
CREATE POLICY "Admins can delete bookings" ON public.bookings FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
