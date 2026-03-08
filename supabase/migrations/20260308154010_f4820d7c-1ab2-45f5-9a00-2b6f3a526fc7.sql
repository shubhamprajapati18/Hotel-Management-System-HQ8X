
-- Create rooms table
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Deluxe',
  description text,
  price numeric NOT NULL DEFAULT 0,
  size text,
  capacity integer NOT NULL DEFAULT 2,
  amenities text[] DEFAULT '{}',
  image_url text,
  status text NOT NULL DEFAULT 'available',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Everyone can view rooms (public listing)
CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT USING (true);

-- Admins can insert/update/delete rooms
CREATE POLICY "Admins can insert rooms" ON public.rooms FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update rooms" ON public.rooms FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete rooms" ON public.rooms FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Updated at trigger
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for room images
INSERT INTO storage.buckets (id, name, public) VALUES ('room-images', 'room-images', true);

-- Storage policies for room images
CREATE POLICY "Anyone can view room images" ON storage.objects FOR SELECT USING (bucket_id = 'room-images');
CREATE POLICY "Admins can upload room images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'room-images' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update room images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'room-images' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete room images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'room-images' AND has_role(auth.uid(), 'admin'::app_role));
