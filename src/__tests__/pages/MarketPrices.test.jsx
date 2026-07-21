import React from 'react';
import { render, screen, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarketPrices, { MARKET_CACHE_CONFIG, fetchCache } from '@/app/market-prices/page';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
  fetchCache.clear();
  
  // Mock standard response for available commodities
  mockFetch.mockImplementation((url) => {
    if (url.includes('limit=1000')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ records: [{ commodity: 'Wheat' }, { commodity: 'Onion' }] })
      });
    }
    // Mock response for individual crops
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ records: [] })
    });
  });
});

afterEach(() => {
  cleanup();
});

describe('Market Prices Page & Cache Verification', () => {
  it('renders market prices interface with translated headers', async () => {
    await act(async () => {
      render(<MarketPrices />);
    });
    
    // Check for correct translated headers (Hindi translations loaded via global mock)
    expect(screen.getByText('स्मार्ट मार्केट विश्लेषण')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('फसल, किस्म, या मंडी का नाम खोजें...')).toBeInTheDocument();
  });

  it('implements client-side caching to prevent repeated network calls within TTL', async () => {
    // Set TTL to 10 seconds
    MARKET_CACHE_CONFIG.ttl = 10000;

    // First render (cold cache)
    await act(async () => {
      render(<MarketPrices />);
    });

    const initialFetchCount = mockFetch.mock.calls.length;
    expect(initialFetchCount).toBeGreaterThan(0);

    // Unmount first render
    cleanup();

    // Reset mock call history
    mockFetch.mockClear();

    // Second render within TTL (warm cache)
    await act(async () => {
      render(<MarketPrices />);
    });

    // Fetch should NOT be called again because results are cached
    const secondFetchCount = mockFetch.mock.calls.length;
    expect(secondFetchCount).toBe(0);
  });

  it('refetches from network if TTL expires', async () => {
    // Set TTL to 0 (always expire)
    MARKET_CACHE_CONFIG.ttl = 0;

    // First render
    await act(async () => {
      render(<MarketPrices />);
    });

    const initialFetchCount = mockFetch.mock.calls.length;
    expect(initialFetchCount).toBeGreaterThan(0);

    mockFetch.mockClear();

    // Unmount and render again
    cleanup();
    await act(async () => {
      render(<MarketPrices />);
    });

    // Fetch SHOULD be called because cache is expired
    expect(mockFetch.mock.calls.length).toBeGreaterThan(0);
  });
});
