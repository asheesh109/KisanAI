import React from 'react';
import { render, screen, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProfessionalCalendar } from '@/components/ProfessionalCalendar';

let mockLanguage = 'en';

jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: mockLanguage,
    t: (key: string) => {
      const translations: Record<string, Record<string, string>> = {
        en: {
          farmingCalendar: 'Farming Calendar',
          addEvent: 'Add Event',
          today: 'Today',
        },
        hi: {
          farmingCalendar: 'कृषि कैलेंडर',
          addEvent: 'ईवेंट जोड़ें',
          today: 'आज',
        }
      };
      return translations[mockLanguage]?.[key] || key;
    }
  })
}));

// Mock fetch for calendar events API call
beforeAll(() => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('ProfessionalCalendar Localization', () => {
  it('renders calendar interface in English ("en")', async () => {
    mockLanguage = 'en';
    
    await act(async () => {
      render(<ProfessionalCalendar userId="test-user" />);
    });

    // Verify title is in English
    const title = screen.getByText('Farming Calendar');
    expect(title).toBeInTheDocument();

    // Verify weekday headers are in English
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
  });

  it('renders calendar interface in Hindi ("hi")', async () => {
    mockLanguage = 'hi';
    
    await act(async () => {
      render(<ProfessionalCalendar userId="test-user" />);
    });

    // Verify title is in Hindi
    const title = screen.getByText('कृषि कैलेंडर');
    expect(title).toBeInTheDocument();

    // Verify weekday headers are in Hindi
    expect(screen.getByText('सोमवार')).toBeInTheDocument();
    expect(screen.getByText('मंगलवार')).toBeInTheDocument();
    expect(screen.getByText('बुधवार')).toBeInTheDocument();
  });
});
