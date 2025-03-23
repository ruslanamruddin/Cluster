/// <reference types="vite/client" />

import type { supabaseApi } from './integrations/supabase/api';

declare global {
  interface Window {
    supabaseApi?: typeof supabaseApi;
  }
}
