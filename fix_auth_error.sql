-- Disable the problematic trigger
DROP TRIGGER IF EXISTS set_first_user_as_admin ON auth.users;

-- Update the function to be more robust
CREATE OR REPLACE FUNCTION public.set_first_user_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the table exists and has no rows
  IF (SELECT COUNT(*) FROM public.user_roles) = 0 THEN
    BEGIN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.id, 'admin');
    EXCEPTION
      WHEN OTHERS THEN
        -- Log error but don't block user creation
        RAISE NOTICE 'Error setting first user as admin: %', SQLERRM;
    END;
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- If any error happens, just return NEW and don't block user creation
    RAISE NOTICE 'Error in trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER set_first_user_as_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_first_user_as_admin();

-- Modify the user_roles table to make the constraint deferred if it doesn't exist yet
DO $$
BEGIN
  -- Check if user_roles exists
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_roles'
  ) THEN
    -- Drop foreign key constraint if it exists
    IF EXISTS (
      SELECT FROM information_schema.table_constraints 
      WHERE constraint_name = 'user_roles_user_id_fkey'
    ) THEN
      ALTER TABLE public.user_roles DROP CONSTRAINT user_roles_user_id_fkey;
    END IF;
    
    -- Add the constraint back as deferrable
    ALTER TABLE public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id)
    DEFERRABLE INITIALLY DEFERRED;
  END IF;
END
$$; 