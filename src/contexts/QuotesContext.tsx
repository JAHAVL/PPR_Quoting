import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { quotesAPI } from '../lib/api';

// Define the shape of our context
interface QuotesContextType {
  quotes: any[];
  loading: boolean;
  error: string | null;
  fetchQuotes: () => Promise<void>;
  lastUpdated: number;
}

// Create the context with default values
const QuotesContext = createContext<QuotesContextType>({
  quotes: [],
  loading: false,
  error: null,
  fetchQuotes: async () => {},
  lastUpdated: 0,
});

// Provider component
export const QuotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // Function to fetch quotes
  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('QuotesContext: Fetching quotes...');
      const data = await quotesAPI.getAll();
      console.log('QuotesContext: Quotes fetched:', data);
      setQuotes(data || []);
      setLastUpdated(Date.now());
    } catch (err) {
      console.error('QuotesContext: Error fetching quotes:', err);
      setError('Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch quotes on mount
  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // Provide the context value
  const value = {
    quotes,
    loading,
    error,
    fetchQuotes,
    lastUpdated,
  };

  return <QuotesContext.Provider value={value}>{children}</QuotesContext.Provider>;
};

// Custom hook to use the quotes context
export const useQuotes = () => useContext(QuotesContext);

export default QuotesContext;
