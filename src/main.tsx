import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabaseApi } from './integrations/supabase/api'
import { supabase, testPermissions } from './integrations/supabase/client'

// Expose debugging utilities in development mode
if (import.meta.env.DEV) {
  window.supabaseApi = supabaseApi;
  window.supabase = supabase;
  window.testPermissions = testPermissions;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
