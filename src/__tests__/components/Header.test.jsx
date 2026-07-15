import { fireEvent, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '@/components/layout/Header'

const mockSetTheme = jest.fn()
const mockChangeLanguage = jest.fn()
let mockPathname = '/crop-analysis'

const mockLanguages = {
  en: {
    code: 'en',
    name: 'English',
    flag: 'GB',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    flag: 'IN',
  },
}

const mockTranslations = {
  home: 'Home',
  calendar: 'Calendar',
  voiceAssistant: 'Voice Assistant',
  cropAnalysis: 'Crop Analysis',
  weather: 'Weather',
  marketPrices: 'Market Prices',
  governmentSchemes: 'Government Schemes',
  kccApplication: 'KCC Application',
}

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

jest.mock('@/components/theme-provider', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: mockSetTheme,
  }),
}))

jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'en',
    languages: mockLanguages,
    t: (key) => mockTranslations[key] || key,
    changeLanguage: mockChangeLanguage,
  }),
}))

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPathname = '/crop-analysis'
  })

  it('renders the logo and all primary navigation links', async () => {
    render(<Header />)

    expect(
      await screen.findByRole('link', { name: 'KisanAI home' })
    ).toBeInTheDocument()

    const navigation = screen.getByRole('navigation', {
      name: 'Primary navigation',
    })

    Object.values(mockTranslations).forEach((label) => {
      expect(
        within(navigation).getByRole('link', { name: label })
      ).toBeInTheDocument()
    })
  })

  it('uses semantic theme classes on the header', async () => {
    render(<Header />)

    const header = await screen.findByRole('banner')

    expect(header).toHaveClass('bg-background')
    expect(header).toHaveClass('text-foreground')
    expect(header).toHaveClass('border-border')
    expect(header).toHaveClass('transition-colors')
    expect(header).toHaveClass('motion-reduce:transition-none')
  })

  it('identifies the active route accessibly', async () => {
    render(<Header />)

    const navigation = await screen.findByRole('navigation', {
      name: 'Primary navigation',
    })

    const activeLink = within(navigation).getByRole('link', {
      name: 'Crop Analysis',
    })

    const inactiveLink = within(navigation).getByRole('link', {
      name: 'Home',
    })

    expect(activeLink).toHaveAttribute('aria-current', 'page')
    expect(activeLink).toHaveClass('bg-secondary')
    expect(activeLink).toHaveClass('text-secondary-foreground')
    expect(activeLink).toHaveClass('underline')

    expect(inactiveLink).not.toHaveAttribute('aria-current')
    expect(inactiveLink).toHaveClass('text-foreground')
  })

  it('keeps the parent navigation item active on nested routes', async () => {
  mockPathname = '/schemes/eligibility-checker'

  render(<Header />)

  const navigation = await screen.findByRole('navigation', {
    name: 'Primary navigation',
  })

  const schemesLink = within(navigation).getByRole('link', {
    name: 'Government Schemes',
  })

  const homeLink = within(navigation).getByRole('link', {
    name: 'Home',
  })

  expect(schemesLink).toHaveAttribute('aria-current', 'page')
  expect(schemesLink).toHaveClass('bg-secondary')
  expect(schemesLink).toHaveClass('text-secondary-foreground')
  expect(homeLink).not.toHaveAttribute('aria-current')
})

  it('provides visible keyboard focus styles for navigation links', async () => {
    render(<Header />)

    const navigation = await screen.findByRole('navigation', {
      name: 'Primary navigation',
    })

    const link = within(navigation).getByRole('link', {
      name: 'Home',
    })

    expect(link).toHaveClass('focus-visible:ring-2')
    expect(link).toHaveClass('focus-visible:ring-[hsl(var(--ring))]')
    expect(link).toHaveClass('motion-reduce:transition-none')
  })

  it('switches from dark theme to light theme', async () => {
    render(<Header />)

    const themeButton = await screen.findByRole('button', {
      name: 'Switch to light theme',
    })

    fireEvent.click(themeButton)

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('opens the accessible language menu and changes language', async () => {
    render(<Header />)

    const languageButton = await screen.findByRole('button', {
      name: 'Change language',
    })

    expect(languageButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(languageButton)

    expect(languageButton).toHaveAttribute('aria-expanded', 'true')

    const languageOptions = screen.getByRole('group', {
      name: 'Language options',
    })

    const englishOption = within(languageOptions).getByRole('button', {
      name: /English/,
    })

    const hindiOption = within(languageOptions).getByRole('button', {
      name: /Hindi/,
    })

    expect(englishOption).toHaveAttribute('aria-pressed', 'true')
    expect(hindiOption).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(hindiOption)

    expect(mockChangeLanguage).toHaveBeenCalledWith('hi')
    expect(
      screen.queryByRole('group', { name: 'Language options' })
    ).not.toBeInTheDocument()
  })

  it('closes the language options when Escape is pressed', async () => {
    render(<Header />)

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Change language',
      })
    )

    expect(
      screen.getByRole('group', { name: 'Language options' })
    ).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(
      screen.queryByRole('group', { name: 'Language options' })
    ).not.toBeInTheDocument()
  })

  it('opens and closes the accessible mobile navigation', async () => {
    render(<Header />)

    const menuButton = await screen.findByRole('button', {
      name: 'Open navigation menu',
    })

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(menuButton)

    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(menuButton).toHaveAccessibleName('Close navigation menu')

    const mobileNavigation = screen.getByRole('navigation', {
      name: 'Mobile navigation',
    })

    const activeMobileLink = within(mobileNavigation).getByRole('link', {
      name: 'Crop Analysis',
    })

    expect(activeMobileLink).toHaveAttribute('aria-current', 'page')

    fireEvent.click(
      within(mobileNavigation).getByRole('link', {
        name: 'Weather',
      })
    )

    expect(
      screen.queryByRole('navigation', {
        name: 'Mobile navigation',
      })
    ).not.toBeInTheDocument()
  })
})
