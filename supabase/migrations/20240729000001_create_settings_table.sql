
-- Create a table for settings
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users
);

-- Add RLS policies
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view settings
CREATE POLICY "Admins can view settings" ON public.settings
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Only admins can insert settings
CREATE POLICY "Admins can insert settings" ON public.settings
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Only admins can update settings
CREATE POLICY "Admins can update settings" ON public.settings
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Create a table for user roles if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies to user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Everyone can view user roles
CREATE POLICY "Anyone can view user roles" ON public.user_roles
  FOR SELECT USING (true);

-- Only admins can insert user roles
CREATE POLICY "Admins can insert user roles" ON public.user_roles
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Only admins can update user roles
CREATE POLICY "Admins can update user roles" ON public.user_roles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Function to set the first user as admin
CREATE OR REPLACE FUNCTION public.set_first_user_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to make the first user an admin
DROP TRIGGER IF EXISTS set_first_user_as_admin ON auth.users;
CREATE TRIGGER set_first_user_as_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_first_user_as_admin();
