import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundaryFallback from '@/components/ErrorBoundaryFallback';

let mockLanguage = 'en';

jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: mockLanguage,
    languages: {
      en: { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
      hi: { code: 'hi', name: 'हिंदी', flag: '🇮🇳', dir: 'ltr' },
    },
    translations: {},
    t: (key) => key,
    changeLanguage: jest.fn(),
  }),
}));

describe('ErrorBoundaryFallback Component', () => {
  const mockError = new Error('Test boundary error message');
  const mockReset = jest.fn();

  beforeEach(() => {
    mockReset.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    console.error.mockRestore();
  });

  it('renders correctly with English fallback translations and details', () => {
    mockLanguage = 'en';
    render(<ErrorBoundaryFallback error={mockError} reset={mockReset} />);

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred while loading this section of the application.')).toBeInTheDocument();
    expect(screen.getByText('Error details:')).toBeInTheDocument();
    expect(screen.getByText('Test boundary error message')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
    expect(screen.getByText('Report this issue')).toBeInTheDocument();
  });

  it('renders correctly with Hindi fallback translations', () => {
    mockLanguage = 'hi';
    render(<ErrorBoundaryFallback error={mockError} reset={mockReset} />);

    expect(screen.getByText('कुछ गलत हो गया!')).toBeInTheDocument();
    expect(screen.getByText('एप्लिकेशन के इस भाग को लोड करते समय एक अप्रत्याशित त्रुटि हुई।')).toBeInTheDocument();
    expect(screen.getByText('त्रुटि विवरण:')).toBeInTheDocument();
    expect(screen.getByText('पुनः प्रयास करें')).toBeInTheDocument();
    expect(screen.getByText('इस समस्या की रिपोर्ट करें')).toBeInTheDocument();
  });

  it('triggers the reset function when Try Again is clicked', () => {
    mockLanguage = 'en';
    render(<ErrorBoundaryFallback error={mockError} reset={mockReset} />);

    const retryButton = screen.getByText('Try again');
    fireEvent.click(retryButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('simulates error reporting steps successfully when Report is clicked', async () => {
    mockLanguage = 'en';
    jest.useFakeTimers();
    render(<ErrorBoundaryFallback error={mockError} reset={mockReset} />);

    const reportButton = screen.getByText('Report this issue');
    
    // Click report button
    fireEvent.click(reportButton);
    expect(screen.getByText('Reporting...')).toBeInTheDocument();

    // Fast-forward report timer delay
    await act(async () => {
      jest.advanceTimersByTime(850);
    });

    expect(screen.getByText('Thank you for reporting! We will look into it.')).toBeInTheDocument();
    expect(reportButton).toBeDisabled();

    jest.useRealTimers();
  });
});
