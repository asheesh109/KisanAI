import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Schemes from '../../app/schemes/page'
import '@testing-library/jest-dom'

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }) => (
    <a href={href}>{children}</a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('Enhanced Schemes Page', () => {
  it('renders the main heading and description', () => {
    render(<Schemes />)
    
    expect(screen.getByText('सरकारी कृषि योजनाएँ')).toBeInTheDocument()
    expect(screen.getByText('केंद्रीय सरकारी योजनाओं पर पूर्ण जानकारी')).toBeInTheDocument()
  })

  it('displays statistics cards', () => {
    render(<Schemes />)
    
    expect(screen.getByText('कुल योजनाएँ')).toBeInTheDocument()
    expect(screen.getByText('सक्रिय योजनाएँ')).toBeInTheDocument()
    expect(screen.getByText('श्रेणियाँ')).toBeInTheDocument()
  })

  it('displays search and filter controls', () => {
    render(<Schemes />)
    
    const searchInput = screen.getByPlaceholderText('नाम, लाभ, श्रेणी द्वारा योजनाओं की खोज करें...')
    const categorySelect = screen.getByDisplayValue('सभी श्रेणियाँ')
    
    expect(searchInput).toBeInTheDocument()
    expect(categorySelect).toBeInTheDocument()
  })

  it('displays quick actions with eligibility checker link', () => {
    render(<Schemes />)
    
    expect(screen.getByText('पात्रता जांचें')).toBeInTheDocument()
    expect(screen.getByText('फ़िल्टर रीसेट करें')).toBeInTheDocument()
  })

  it('displays scheme categories with counts', () => {
    render(<Schemes />)
    
    expect(screen.getAllByText('आय समर्थन').length).toBeGreaterThan(0)
    expect(screen.getAllByText('फसल बीमा').length).toBeGreaterThan(0)
    expect(screen.getAllByText('ऋण योजनाएँ').length).toBeGreaterThan(0)
    expect(screen.getAllByText('सब्सिडी योजनाएँ').length).toBeGreaterThan(0)
  })

  it('filters schemes by search term', async () => {
    render(<Schemes />)
    
    const searchInput = screen.getByPlaceholderText('नाम, लाभ, श्रेणी द्वारा योजनाओं की खोज करें...')
    
    // Type in search input
    fireEvent.change(searchInput, { target: { value: 'किसान' } })
    
    await waitFor(() => {
      // Should show filtered results
      const resultsText = screen.getByText(/योजनाएँ दिखा रहे हैं/)
      expect(resultsText).toBeInTheDocument()
    })
  })

  it('filters schemes by category', async () => {
    render(<Schemes />)
    
    const categorySelect = screen.getByDisplayValue('सभी श्रेणियाँ')
    
    // Select income support category
    fireEvent.change(categorySelect, { target: { value: 'income-support' } })
    
    await waitFor(() => {
      // Should show category filter - check for header change
      const categoryHeaders = screen.getAllByText('आय समर्थन')
      expect(categoryHeaders.length).toBeGreaterThan(0)
    })
  })

  it('displays scheme cards with proper information', () => {
    render(<Schemes />)
    
    // Check for PM-KISAN scheme
    expect(screen.getByText(/प्रधानमंत्री किसान सम्मान निधि/)).toBeInTheDocument()
    
    // Check for scheme details - use getAllByText since there are multiple cards
    expect(screen.getAllByText('मुख्य लाभ:').length).toBeGreaterThan(0)
    expect(screen.getAllByText('पूर्ण विवरण').length).toBeGreaterThan(0)
  })

  it('shows clear filter button when filters are applied', async () => {
    render(<Schemes />)
    
    const searchInput = screen.getByPlaceholderText('नाम, लाभ, श्रेणी द्वारा योजनाओं की खोज करें...')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    await waitFor(() => {
      const clearButton = screen.getByText('फ़िल्टर रीसेट करें')
      expect(clearButton).toBeInTheDocument()
    })
  })

  it('clears filters when clear button is clicked', async () => {
    render(<Schemes />)
    
    const searchInput = screen.getByPlaceholderText('नाम, लाभ, श्रेणी द्वारा योजनाओं की खोज करें...')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    await waitFor(() => {
      const clearButton = screen.getByText('फ़िल्टर रीसेट करें')
      fireEvent.click(clearButton)
    })
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('')
    })
  })

  it('shows no results message when no schemes match filter', async () => {
    render(<Schemes />)
    
    const searchInput = screen.getByPlaceholderText('नाम, लाभ, श्रेणी द्वारा योजनाओं की खोज करें...')
    fireEvent.change(searchInput, { target: { value: 'nonexistentscheme123' } })
    
    await waitFor(() => {
      expect(screen.getByText('कोई योजना नहीं मिली')).toBeInTheDocument()
      expect(screen.getByText('प्रासंगिक योजनाएँ खोजने के लिए अपनी खोज या फ़िल्टर समायोजित करने का प्रयास करें।')).toBeInTheDocument()
    })
  })

  it('displays active status for schemes', () => {
    render(<Schemes />)
    
    const activeStatusElements = screen.getAllByText('सक्रिय')
    expect(activeStatusElements.length).toBeGreaterThan(0)
  })

  it('shows application start year information', () => {
    render(<Schemes />)
    
    const startYearElements = screen.getAllByText(/शुरुआत वर्ष/)
    expect(startYearElements.length).toBeGreaterThan(0)
  })
})
