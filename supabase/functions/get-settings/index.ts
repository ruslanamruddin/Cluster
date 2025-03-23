import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.37.0";

// Set up CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { key, checkKeys } = await req.json();
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // If we're checking if multiple keys exist
    if (checkKeys && Array.isArray(checkKeys)) {
      const result: Record<string, boolean> = {};
      
      for (const keyName of checkKeys) {
        // We only check if the key exists, not its value
        const keyExists = Deno.env.get(keyName) !== undefined;
        result[keyName] = keyExists;
      }
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Otherwise get the value for a single key
    if (key) {
      const value = Deno.env.get(key);
      
      // For security reasons, don't return actual API key values
      const isApiKey = key.includes("API_KEY");
      
      return new Response(
        JSON.stringify({ 
          exists: value !== undefined,
          value: isApiKey ? null : value 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Invalid request parameters" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
