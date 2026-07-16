import { renderHook, act, waitFor } from '@testing-library/react';
import { useOfflineStatus } from './useOfflineStatus';

describe('useOfflineStatus', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('detects initial online state', async () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => true,
    });

    const { result } = renderHook(() => useOfflineStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isOffline).toBe(false);
  });

  it('detects initial offline state', async () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });

    const { result } = renderHook(() => useOfflineStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isOffline).toBe(true);
  });

  it('handles online -> offline -> online transitions', async () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => true,
    });

    const { result } = renderHook(() => useOfflineStatus());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isOffline).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOffline).toBe(true);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOffline).toBe(false);
  });

  it('removes event listeners on unmount', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useOfflineStatus());

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      'online',
      expect.any(Function)
    );

    expect(removeSpy).toHaveBeenCalledWith(
      'offline',
      expect.any(Function)
    );
  });
});