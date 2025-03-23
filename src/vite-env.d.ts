/// <reference types="vite/client" />

import type { supabaseApi } from './integrations/supabase/api';
import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    supabaseApi?: typeof supabaseApi;
    supabase?: SupabaseClient;
    testPermissions?: () => Promise<{ success: boolean; error?: any; data?: any }>;
  }
}
