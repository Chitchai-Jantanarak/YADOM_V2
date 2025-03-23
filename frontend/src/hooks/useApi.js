import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for making API calls with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @param {boolean} immediate - Whether to call the API function immediately
 * @param {Array} initialParams - Initial parameters for the API function
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export function useApi(apiFunction, immediate = false, initialParams = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to execute the API call
  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...params);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  // Reset the hook state
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  // Call the API function immediately if requested
  useEffect(() => {
    if (immediate) {
      execute(...initialParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, execute]);

  return { data, loading, error, execute, reset };
}