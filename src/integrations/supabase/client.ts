
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://bjbltjpiydaadpghgmdz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmx0anBpeWRhYWRwZ2hnbWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2Nzk4MTUsImV4cCI6MjA1ODI1NTgxNX0.4Qyq9N2nsgz6x6hkCOIqfy1PZQYspqhajr0BlEX6IQ0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export type JoinRequestResponse = {
  id?: string;
  status?: string;
  error?: string;
};

export type ProcessRequestResponse = {
  message?: string;
  error?: string;
};

export type TeamJoinRequest = {
  id: string;
  team_id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
};

// Use string literal unions for table names to avoid TypeScript issues
export type TableName = keyof Database['public']['Tables'];
export type FunctionName = keyof Database['public']['Functions'];

// Simple record type for debugging
export type SimpleRecord = Record<string, any>;

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'Content-Type': 'application/json'
      }
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Debug functions with simplified types to avoid deep instantiation
export const testPermissions = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  console.log("Current session:", sessionData);
  
  try {
    const { data, error } = await supabase
      .from('profiles' as TableName)
      .select('*')
      .limit(1);
      
    console.log("Test query result:", { data, error });
    return { success: !error, error, data };
  } catch (err) {
    console.error("Test query error:", err);
    return { success: false, error: err };
  }
};

// Debug function with simplified types
export const inspectTableSchema = async (tableName: string) => {
  try {
    const { data: tableData, error: tableError } = await supabase
      .from(tableName as TableName)
      .select('*')
      .limit(1);
      
    if (tableError) {
      console.error(`Error accessing table ${tableName}:`, tableError);
      return { success: false, error: tableError, schema: null };
    }
    
    if (tableData && tableData.length > 0) {
      const sampleRecord = tableData[0];
      const inferredSchema = Object.keys(sampleRecord).map(column => ({
        column_name: column,
        data_type: typeof sampleRecord[column]
      }));
      
      console.log(`Inferred schema for ${tableName}:`, inferredSchema);
      return { success: true, error: null, schema: inferredSchema };
    }
    
    return { success: true, error: null, schema: [] };
  } catch (err) {
    console.error(`Error inspecting schema for ${tableName}:`, err);
    return { success: false, error: err, schema: null };
  }
};

// Debug function with simplified types
export const checkRlsPermissions = async (tableName: string) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("Current session:", sessionData);
    
    const { data: selectData, error: selectError } = await supabase
      .from(tableName as TableName)
      .select('*')
      .limit(5);
      
    console.log(`SELECT test for ${tableName}:`, selectError ? 'Failed' : 'Success');
    
    const userId = sessionData?.session?.user?.id;
    if (userId) {
      const { data: ownData, error: ownError } = await supabase
        .from(tableName as TableName)
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      console.log(`SELECT own data test for ${tableName}:`, ownError ? 'Failed' : 'Success');
    }
    
    const insertError = null;
    console.log(`INSERT test for ${tableName}:`, insertError ? 'Failed' : 'Success');
      
    return {
      auth: !!sessionData?.session,
      userId: sessionData?.session?.user?.id,
      canSelect: !selectError,
      canSelectOwn: userId ? true : null,
      canInsert: !insertError,
      error: selectError || insertError
    };
  } catch (err) {
    console.error(`RLS check error for ${tableName}:`, err);
    return { error: err, auth: false };
  }
};

// Define a simplified generic type for table rows
export type TableRow<T extends string> = Record<string, any>;
