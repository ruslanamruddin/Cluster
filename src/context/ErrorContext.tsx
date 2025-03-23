import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface ErrorContextType {
  handleError: (error: unknown, customMessage?: string) => void;
  clearErrors: () => void;
  errors: Error[];
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<Error[]>([]);
  const { toast } = useToast();

  const handleError = useCallback((error: unknown, customMessage?: string) => {
    console.error('Error caught by ErrorContext:', error);
    
    // Format the error object
    const errorObj = error instanceof Error 
      ? error 
      : new Error(typeof error === 'string' ? error : 'An unknown error occurred');
    
    // Add to errors list
    setErrors(prev => [...prev, errorObj]);
    
    // Show toast notification
    toast({
      title: customMessage || 'Something went wrong',
      description: errorObj.message,
      variant: 'destructive',
    });
    
    // You could also log to an error tracking service here
    // e.g., Sentry.captureException(error);
    
    return errorObj;
  }, [toast]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <ErrorContext.Provider value={{ handleError, clearErrors, errors }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}; 