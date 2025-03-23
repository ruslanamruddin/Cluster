import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabaseApi } from './integrations/supabase/api'

// Expose supabaseApi for testing in browser console
if (import.meta.env.DEV) {
  window.supabaseApi = supabaseApi
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
