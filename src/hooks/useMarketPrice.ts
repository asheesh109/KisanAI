'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Custom hook for client-side caching of market price requests using SWR.
 * @param apiEndpoint The API URL to fetch market prices.
 * @param ttl Time to live / deduplication interval in milliseconds (default: 5 minutes).
 */
export function useMarketPrice(apiEndpoint: string | null, ttl = 300000) {
  const { data, error, isLoading, mutate } = useSWR(apiEndpoint, fetcher, {
    dedupingInterval: ttl, // Prevents duplicate requests within this window
    revalidateOnFocus: false, // Avoids refetching when window regains focus
  });

  return {
    prices: data,
    isLoading,
    isError: error,
    mutate, // Can be used to manually revalidate/refresh data if needed
  };
}