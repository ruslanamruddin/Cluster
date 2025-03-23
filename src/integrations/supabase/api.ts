import { supabase } from './client';
import { toast } from '@/components/ui/use-toast';
import { Database } from './types';

// Use simplified types to avoid deep instantiation
type TableNames = string;
type FunctionNames = string;

/**
 * Generic API response type
 */
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Handles Supabase errors consistently across the application
 */
export const handleSupabaseError = (error: any, customMessage?: string): string => {
  console.error('Supabase error:', error);
  
  // Handle specific error codes
  if (error.code === 'PGRST116') {
    return 'Resource not found';
  }
  
  if (error.code === '23505') {
    return 'This record already exists';
  }
  
  if (error.code === '42501') {
    return 'You do not have permission to perform this action';
  }
  
  return customMessage || error.message || 'An unexpected error occurred';
};

/**
 * Simple cache to store known table column information
 */
const schemaCache: Record<string, string[]> = {};

/**
 * Sanitizes data to match table schema
 */
async function sanitizeDataForTable(
  table: string, 
  data: Record<string, any>
): Promise<Record<string, any>> {
  // If we don't have schema info for this table yet, try to get it
  if (!schemaCache[table]) {
    try {
      // First try to infer schema from a sample record
      const { data: sampleData, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (!error && sampleData && sampleData.length > 0) {
        schemaCache[table] = Object.keys(sampleData[0]);
        console.log(`Schema for ${table} cached:`, schemaCache[table]);
      }
    } catch (e) {
      console.error(`Failed to infer schema for ${table}:`, e);
    }
  }
  
  // If we have schema info, sanitize the data
  if (schemaCache[table] && schemaCache[table].length > 0) {
    const sanitized: Record<string, any> = {};
    
    // Only include fields that exist in the schema
    Object.keys(data).forEach(key => {
      if (schemaCache[table].includes(key)) {
        sanitized[key] = data[key];
      } else {
        console.warn(`Column '${key}' not found in '${table}' schema, removing it`);
      }
    });
    
    return sanitized;
  }
  
  // If we don't have schema info, return the original data
  return data;
}

/**
 * Wrapper for Supabase database operations with consistent error handling
 */
export const supabaseApi = {
  /**
   * Fetch a record by ID
   */
  async getById<T>(
    table: TableNames,
    id: string,
    column: string = 'id',
    select: string = '*'
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(select)
        .eq(column, id)
        .maybeSingle();
      
      if (error) throw error;
      
      return { data: data as T, error: null, status: 200 };
    } catch (error) {
      return { 
        data: null, 
        error: handleSupabaseError(error, `Failed to fetch ${table} record`),
        status: (error as any).code === 'PGRST116' ? 404 : 500
      };
    }
  },
  
  /**
   * Fetch multiple records with optional filters
   */
  async getMany<T>(
    table: TableNames,
    options: {
      select?: string;
      filters?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { select = '*', filters = {}, order, limit } = options;
      
      let query = supabase
        .from(table)
        .select(select);
      
      // Apply filters
      Object.entries(filters).forEach(([column, value]) => {
        query = query.eq(column, value);
      });
      
      // Apply ordering
      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? true });
      }
      
      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { data: data as T, error: null, status: 200 };
    } catch (error) {
      return { 
        data: null, 
        error: handleSupabaseError(error, `Failed to fetch ${table} records`),
        status: 500
      };
    }
  },
  
  /**
   * Insert a new record
   */
  async insert<T>(
    table: TableNames,
    data: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      // Sanitize data to match table schema
      const sanitizedData = await sanitizeDataForTable(table, data);
      
      console.log(`Sanitized insert data for ${table}:`, sanitizedData);
      
      // Type assertion to satisfy TypeScript
      const { data: record, error } = await supabase
        .from(table)
        .insert(sanitizedData as any)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      
      return { data: record as T, error: null, status: 201 };
    } catch (error) {
      return { 
        data: null, 
        error: handleSupabaseError(error, `Failed to create ${table} record`),
        status: 500
      };
    }
  },
  
  /**
   * Update an existing record
   */
  async update<T>(
    table: TableNames,
    id: string,
    data: Record<string, any>,
    column: string = 'id'
  ): Promise<ApiResponse<T>> {
    try {
      // Sanitize data to match table schema
      const sanitizedData = await sanitizeDataForTable(table, {
        ...data,
        updated_at: new Date().toISOString()
      });
      
      console.log(`Sanitized update data for ${table}:`, sanitizedData);
      
      // Type assertion to satisfy TypeScript
      const { data: record, error } = await supabase
        .from(table)
        .update(sanitizedData as any)
        .eq(column, id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
      
      return { data: record as T, error: null, status: 200 };
    } catch (error) {
      return { 
        data: null, 
        error: handleSupabaseError(error, `Failed to update ${table} record`),
        status: 500
      };
    }
  },
  
  /**
   * Upsert (insert or update) a record
   */
  async upsert<T>(
    table: TableNames,
    data: Record<string, any>,
    options: { onConflict?: string } = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Add debug logging
      console.log(`Upserting to ${table} with data:`, data);
      
      // Ensure data has all required fields
      if (!data.id && table === 'profiles') {
        console.error('Missing ID for profiles upsert');
        return {
          data: null,
          error: 'Missing required ID field for profile update',
          status: 400
        };
      }
      
      // Sanitize data to match table schema
      const sanitizedData = await sanitizeDataForTable(table, {
        ...data,
        updated_at: new Date().toISOString()
      });
      
      console.log(`Sanitized data for ${table}:`, sanitizedData);
      
      // Proceed with upsert using sanitized data and type casting
      const { data: record, error } = await supabase
        .from(table)
        .upsert(sanitizedData as any, { 
          onConflict: options.onConflict || 'id',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error(`Upsert error for ${table}:`, error);
        throw error;
      }
      
      // Since we're not returning data on upsert, we need to manually fetch the record
      const { data: updatedRecord, error: fetchError } = await supabase
        .from(table)
        .select('*')
        .eq('id', data.id)
        .maybeSingle();
        
      if (fetchError) {
        console.error(`Error fetching updated record:`, fetchError);
        throw fetchError;
      }
      
      return { data: updatedRecord as T, error: null, status: 200 };
    } catch (error) {
      console.error(`Full upsert error details for ${table}:`, error);
      return { 
        data: null, 
        error: handleSupabaseError(error, `Failed to upsert ${table} record`),
        status: 500
      };
    }
  },
  
  /**
   * Delete a record
   */
  async delete(
    table: TableNames,
    id: string,
    column: string = 'id'
  ): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq(column, id);
      
      if (error) throw error;
      
      return { data: null, error: null, status: 200 };
    } catch (error) {
      return { 
        data: null, 
        error: handleSupabaseError(error, `Failed to delete ${table} record`),
        status: 500
      };
    }
  },
  
  /**
   * Execute a stored procedure
   */
  async rpc<T>(
    functionName: FunctionNames,
    params: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Type assertion to match Supabase's expected type
      const { data, error } = await supabase.rpc(functionName, params as any);
      
      if (error) throw error;
      
      // Handle custom error response from RPC function
      if (data && typeof data === 'object' && 'error' in data) {
        return { 
          data: null, 
          error: data.error as string, 
          status: 400 
        };
      }
      
      return { data: data as T, error: null, status: 200 };
    } catch (error) {
      return { 
        data: null, 
        error: handleSupabaseError(error, `Failed to execute ${functionName}`),
        status: 500
      };
    }
  }
};

/**
 * A hook to display toast notifications for API responses
 */
export const showResponseToast = (
  response: ApiResponse<any>, 
  messages: { 
    success: string;
    error?: string;
  }
) => {
  if (response.error) {
    toast({
      title: messages.error || "Error",
      description: response.error,
      variant: "destructive"
    });
    return false;
  } else {
    toast({
      title: "Success",
      description: messages.success
    });
    return true;
  }
};
