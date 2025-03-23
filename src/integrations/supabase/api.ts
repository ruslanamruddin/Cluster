import { supabase } from './client';
import { toast } from '@/components/ui/use-toast';

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
 * Wrapper for Supabase database operations with consistent error handling
 */
export const supabaseApi = {
  /**
   * Fetch a record by ID
   */
  async getById<T>(
    table: string,
    id: string,
    column: string = 'id',
    select: string = '*'
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(select)
        .eq(column, id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null, status: 200 };
    } catch (error) {
      return { 
        data: null, 
        error: handleSupabaseError(error, `Failed to fetch ${table} record`),
        status: error.code === 'PGRST116' ? 404 : 500
      };
    }
  },
  
  /**
   * Fetch multiple records with optional filters
   */
  async getMany<T>(
    table: string,
    options: {
      select?: string;
      filters?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    } = {}
  ): Promise<ApiResponse<T[]>> {
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
      
      return { data, error: null, status: 200 };
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
    table: string,
    data: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const { data: record, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: record, error: null, status: 201 };
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
    table: string,
    id: string,
    data: Record<string, any>,
    column: string = 'id'
  ): Promise<ApiResponse<T>> {
    try {
      const { data: record, error } = await supabase
        .from(table)
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq(column, id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: record, error: null, status: 200 };
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
    table: string,
    data: Record<string, any>,
    options: { onConflict?: string } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { data: record, error } = await supabase
        .from(table)
        .upsert({
          ...data,
          updated_at: new Date().toISOString()
        }, { onConflict: options.onConflict || 'id' })
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: record, error: null, status: 200 };
    } catch (error) {
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
    table: string,
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
    functionName: string,
    params: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase.rpc(functionName, params);
      
      if (error) throw error;
      
      // Handle custom error response from RPC function
      if (data && typeof data === 'object' && 'error' in data) {
        return { 
          data: null, 
          error: data.error as string, 
          status: 400 
        };
      }
      
      return { data, error: null, status: 200 };
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