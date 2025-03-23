/// <reference types="vite/client" />

import type { supabaseApi } from './integrations/supabase/api';
import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    supabaseApi?: typeof supabaseApi;
    supabase?: SupabaseClient;
    testPermissions?: () => Promise<{ success: boolean; error?: any; data?: any }>;
    inspectTableSchema?: (tableName: string) => Promise<{ 
      success: boolean; 
      error?: any; 
      schema?: any;
      note?: string;
    }>;
    checkRlsPermissions?: (tableName: string) => Promise<{
      auth?: boolean;
      userId?: string;
      canSelect?: boolean;
      canSelectOwn?: boolean | null;
      canInsert?: boolean;
      error?: any;
    }>;
  }
}
