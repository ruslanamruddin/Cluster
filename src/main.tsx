import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabaseApi } from './integrations/supabase/api'
import { supabase, testPermissions, inspectTableSchema, checkRlsPermissions } from './integrations/supabase/client'

// Expose debugging utilities in development mode
if (import.meta.env.DEV) {
  window.supabaseApi = supabaseApi;
  window.supabase = supabase;
  window.testPermissions = testPermissions;
  window.inspectTableSchema = inspectTableSchema;
  window.checkRlsPermissions = checkRlsPermissions;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
