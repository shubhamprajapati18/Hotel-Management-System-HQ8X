
CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  tag text NOT NULL DEFAULT 'Special',
  description text NOT NULL,
  discount text NOT NULL DEFAULT '',
  validity text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Gift',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active offers" ON public.offers
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert offers" ON public.offers
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update offers" ON public.offers
  FOR UPDATE USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete offers" ON public.offers
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial offers
INSERT INTO public.offers (title, tag, description, discount, validity, icon, sort_order) VALUES
  ('The Royal Escape', 'Exclusive', 'Book 3 nights in any Penthouse suite and receive the 4th night complimentary. Includes daily breakfast, spa credit, and airport transfers.', '25% Off', 'Valid until June 30, 2026', 'Crown', 0),
  ('Advance Purchase Savings', 'Early Bird', 'Plan ahead and save. Enjoy up to 20% off our best available rates when you book at least 30 days before your arrival.', '20% Off', 'Book 30+ days in advance', 'Calendar', 1),
  ('Honeymoon & Anniversary', 'Romance', 'Celebrate love with a curated package: champagne on arrival, couples spa treatment, candlelit dinner, and rose petal turndown service.', 'Package', 'Year-round', 'Gift', 2),
  ('Stay Longer, Save More', 'Extended Stay', 'Extended stays are rewarded. Book 5 nights or more and receive 15% off, plus complimentary laundry service and late checkout.', '15% Off', 'Minimum 5 nights', 'Percent', 3);
