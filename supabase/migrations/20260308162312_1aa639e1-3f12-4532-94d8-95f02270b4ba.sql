
-- Waitlist table
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  room_preference TEXT DEFAULT '',
  check_in_desired DATE NOT NULL,
  check_out_desired DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view waitlist" ON public.waitlist FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert waitlist" ON public.waitlist FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update waitlist" ON public.waitlist FOR UPDATE USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete waitlist" ON public.waitlist FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_waitlist_updated_at BEFORE UPDATE ON public.waitlist FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Group reservations table
CREATE TABLE public.group_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_name TEXT NOT NULL,
  organizer_name TEXT NOT NULL,
  organizer_email TEXT NOT NULL,
  organizer_phone TEXT DEFAULT '',
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_rooms INTEGER NOT NULL DEFAULT 1,
  total_guests INTEGER NOT NULL DEFAULT 1,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.group_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view group reservations" ON public.group_reservations FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert group reservations" ON public.group_reservations FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update group reservations" ON public.group_reservations FOR UPDATE USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete group reservations" ON public.group_reservations FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_group_reservations_updated_at BEFORE UPDATE ON public.group_reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
