-- Quick fix: Disable the problematic trigger
DROP TRIGGER IF EXISTS set_first_user_as_admin ON auth.users;

-- Alternative: Completely remove the trigger function as well
DROP FUNCTION IF EXISTS public.set_first_user_as_admin();

-- We can manually set the admin role later after signup
-- Manual setup instructions:
-- 1. Sign up a user through the application
-- 2. After signup, run this command in the SQL editor:
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin' FROM auth.users LIMIT 1
-- ON CONFLICT (user_id) DO NOTHING; 