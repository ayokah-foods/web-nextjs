"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { listItems } from "@/lib/api/items"; // Assuming this is your API function
import Item from "@/interfaces/items";

const DEBOUNCE_TIME = 300; // Use a constant for debounce time

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTouched, setIsTouched] = useState(false); // Track if user has searched

  // useMemo with an empty dependency array to create a stable debounced function
  const debouncedFetchItems = useMemo(() => {
    return debounce(async (query: string) => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const response = await listItems(10, 0, query); // Limit 10, offset 0
        setResults(response?.data || []);
      } catch (error) {
        // In production, you'd log this to a service like Sentry
        console.error("Error fetching items:", error);
        setResults([]); // Clear results on error
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_TIME);
  }, []); // Empty array ensures this function is created only once

  // Effect to cancel debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchItems.cancel();
    };
  }, [debouncedFetchItems]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      setLoading(true);
      setIsTouched(true); // User has started searching
      debouncedFetchItems(value);
    },
    [debouncedFetchItems]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setResults([]);
    setLoading(false);
    setIsTouched(false);
  }, []);

  return {
    searchTerm,
    results,
    loading,
    isTouched,
    handleSearchChange,
    clearSearch,
  };
}
