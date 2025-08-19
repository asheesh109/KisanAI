import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Schemes from '../../app/schemes/page'
import '@testing-library/jest-dom'

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('Enhanced Schemes Page', () => {
  it('renders the main heading and description', () => {
    render(<Schemes />)
    
    expect(screen.getByText('सरकारी योजनाएं')).toBeInTheDocument()
    expect(screen.getByText('केंद्र और राज्य सरकार की सभी कृषि योजनाओं की विस्तृत जानकारी')).toBeInTheDocument()
  })

  it('displays statistics cards', () => {
    render(<Schemes />)
    
    expect(screen.getByText('कुल योजनाएं')).toBeInTheDocument()
    expect(screen.getByText('लाभार्थी')).toBeInTheDocument()
    expect(screen.getByText('कुल बजट')).toBeInTheDocument()
    expect(screen.getAllByText('नई योजनाएं')).toHaveLength(2) // One in stats, one in quick actions
  })

  it('displays search and filter controls', () => {
    render(<Schemes />)
    
    const searchInput = screen.getByPlaceholderText('योजना खोजें...')
    const categorySelect = screen.getByDisplayValue('सभी श्रेणियां')
    
    expect(searchInput).toBeInTheDocument()
    expect(categorySelect).toBeInTheDocument()
  })

  it('displays quick actions with eligibility checker link', () => {
    render(<Schemes />)
    
    expect(screen.getByText('त्वरित सेवाएं')).toBeInTheDocument()
    expect(screen.getByText('पात्रता जांच')).toBeInTheDocument()
    expect(screen.getByText('आवेदन ट्रैकर')).toBeInTheDocument()
    expect(screen.getAllByText('नई योजनाएं')).toHaveLength(2) // One in stats, one in quick actions
    expect(screen.getByText('फॉर्म डाउनलोड')).toBeInTheDocument()

    // Check if eligibility checker has proper link
    const eligibilityLink = screen.getByText('पात्रता जांच').closest('a')
    expect(eligibilityLink).toHaveAttribute('href', '/schemes/eligibility-checker')
  })

  it('displays scheme categories with counts', () => {
    render(<Schemes />)
    
    expect(screen.getByText('योजना श्रेणियां')).toBeInTheDocument()
    expect(screen.getAllByText('आय सहायता').length).toBeGreaterThan(0)
    expect(screen.getAllByText('फसल बीमा').length).toBeGreaterThan(0)
    expect(screen.getAllByText('ऋण योजनाएं').length).toBeGreaterThan(0)
    expect(screen.getAllByText('सब्सिडी योजनाएं').length).toBeGreaterThan(0)

    // Check for scheme counts
    const countElements = screen.getAllByText(/\d+ योजनाएं/)
    expect(countElements.length).toBeGreaterThan(0)
  })

  it('filters schemes by search term', async () => {
    render(<Schemes />)
    
    const searchInput = screen.getByPlaceholderText('योजना खोजें...')
    
    // Type in search input
    fireEvent.change(searchInput, { target: { value: 'किसान' } })
    
    await waitFor(() => {
      // Should show filtered results
      const resultsText = screen.getByText(/योजनाएं मिली/)
      expect(resultsText).toBeInTheDocument()
    })
  })

  it('filters schemes by category', async () => {
    render(<Schemes />)
    
    const categorySelect = screen.getByDisplayValue('सभी श्रेणियां')
    
    // Select income support category
    fireEvent.change(categorySelect, { target: { value: 'income-support' } })
    
    await waitFor(() => {
      // Should show category filter - check for header change
      const categoryHeaders = screen.getAllByText('आय सहायता')
      expect(categoryHeaders.length).toBeGreaterThan(0)
    })
  })

  it('displays scheme cards with proper information', () => {
    render(<Schemes />)
    
    // Check for PM-KISAN scheme (should be present in mock data)
    expect(screen.getByText('प्रधानमंत्री किसान सम्मान निधि')).toBeInTheDocument()
    
    // Check for scheme details - use getAllByText since there are multiple cards
    expect(screen.getAllByText('मुख्य लाभ:').length).toBeGreaterThan(0)
    expect(screen.getAllByText('विस्तार से देखें').length).toBeGreaterThan(0)
  })

  it('shows clear filter button when filters are applied', async () => {
    render(<Schemes />)
    
    const searchInput = screen.getByPlaceholderText('योजना खोजें...')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    await waitFor(() => {
      const clearButton = screen.getByText('फ़िल्टर साफ़ करें')
      expect(clearButton).toBeInTheDocument()
    })
  })

  it('clears filters when clear button is clicked', async () => {
    render(<Schemes />)
    
    const searchInput = screen.getByPlaceholderText('योजना खोजें...')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    await waitFor(() => {
      const clearButton = screen.getByText('फ़िल्टर साफ़ करें')
      fireEvent.click(clearButton)
    })
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('')
    })
  })

  it('displays important links section', () => {
    render(<Schemes />)
    
    expect(screen.getByText('महत्वपूर्ण लिंक')).toBeInTheDocument()
    expect(screen.getByText('PM-KISAN पोर्टल')).toBeInTheDocument()
    expect(screen.getByText('फसल बीमा पोर्टल')).toBeInTheDocument()
    expect(screen.getByText('मृदा स्वास्थ्य कार्ड')).toBeInTheDocument()
    expect(screen.getByText('KCC आवेदन')).toBeInTheDocument()
    expect(screen.getByText('कृषि मंत्रालय')).toBeInTheDocument()
    expect(screen.getByText('किसान हेल्पलाइन')).toBeInTheDocument()
  })

  it('shows no results message when no schemes match filter', async () => {
    render(<Schemes />)
    
    const searchInput = screen.getByPlaceholderText('योजना खोजें...')
    fireEvent.change(searchInput, { target: { value: 'nonexistentscheme123' } })
    
    await waitFor(() => {
      expect(screen.getByText('कोई योजना नहीं मिली')).toBeInTheDocument()
      expect(screen.getByText('कृपया अपनी खोज को संशोधित करें या अन्य श्रेणी का चयन करें।')).toBeInTheDocument()
    })
  })

  it('displays active status for schemes', () => {
    render(<Schemes />)
    
    const activeStatusElements = screen.getAllByText('सक्रिय')
    expect(activeStatusElements.length).toBeGreaterThan(0)
  })

  it('shows application deadline information', () => {
    render(<Schemes />)
    
    const deadlineElements = screen.getAllByText(/आवेदन की समय सीमा/)
    expect(deadlineElements.length).toBeGreaterThan(0)
  })
})
