"use client";

import { useCallback, useEffect, useState } from "react";

interface UseServerManagedDataTableSearchParams {
  debounceDelay?: number;
  onSearch: (searchTerm: string) => void;
}

interface UseServerManagedDataTableSearchResult {
  searchTerm: string;
  handleSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
}

export function useServerManagedDataTableSearch({
  debounceDelay = 500,
  onSearch,
}: UseServerManagedDataTableSearchParams): UseServerManagedDataTableSearchResult {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [onSearch, searchTerm, debounceDelay]);

  const handleSearchInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [],
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return { searchTerm, handleSearchInputChange, clearSearch };
}