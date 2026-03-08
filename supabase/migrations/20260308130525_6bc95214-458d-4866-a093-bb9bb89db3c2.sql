
-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  type text NOT NULL DEFAULT 'info',
  reference_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Users can update (mark read) their own notifications
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- System can insert notifications (via trigger with SECURITY DEFINER)
-- We'll use a trigger function with SECURITY DEFINER to insert

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create trigger function for service request status changes
CREATE OR REPLACE FUNCTION public.notify_service_request_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  status_label text;
BEGIN
  -- Only fire when status actually changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  CASE NEW.status
    WHEN 'in-progress' THEN status_label := 'is now in progress';
    WHEN 'completed' THEN status_label := 'has been completed';
    ELSE status_label := 'has been updated to ' || NEW.status;
  END CASE;

  INSERT INTO public.notifications (user_id, title, message, type, reference_id)
  VALUES (
    NEW.user_id,
    'Service Request Update',
    'Your ' || LOWER(REPLACE(NEW.type, '_', ' ')) || ' request (' || NEW.category || ') ' || status_label || '.',
    'service_request',
    NEW.id
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_service_request_status_change
  AFTER UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_service_request_status_change();
