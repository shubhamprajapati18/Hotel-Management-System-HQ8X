
-- Add salary fields to staff table
ALTER TABLE public.staff 
  ADD COLUMN IF NOT EXISTS salary numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS salary_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS join_date date NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS pay_day integer NOT NULL DEFAULT 1;

-- Create staff_payments table to track salary payment history
CREATE TABLE IF NOT EXISTS public.staff_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id uuid NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  month text NOT NULL,
  paid_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view staff payments" ON public.staff_payments FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert staff payments" ON public.staff_payments FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update staff payments" ON public.staff_payments FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete staff payments" ON public.staff_payments FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
