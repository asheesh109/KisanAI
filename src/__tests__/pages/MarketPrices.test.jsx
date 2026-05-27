import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MarketPrices from '@/app/market-prices/page'

// Mock global fetch for API calls
global.fetch = jest.fn()

describe('Market Prices Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch.mockClear()

    // Setup global fetch mock implementations
    global.fetch.mockImplementation((url) => {
      if (url.includes('limit=1000')) {
        // Mock fetchAvailableCommodities
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            records: [
              { commodity: 'Wheat' },
              { commodity: 'Rice' },
              { commodity: 'Soyabean' }
            ]
          })
        })
      }
      // Mock category or commodity fetch
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          records: [
            {
              modal_price: '4000',
              min_price: '3900',
              max_price: '4100',
              market: 'दिल्ली मंडी',
              state: 'Delhi',
              district: 'Delhi',
              arrivals_in_qtl: '150',
              variety: 'सामान्य',
              grade: 'मध्यम',
              arrival_date: '2024-04-01',
              commodity: url.includes('Soyabean') ? 'Soyabean' : url.includes('Rice') ? 'Rice' : 'Wheat'
            }
          ]
        })
      })
    })
  })

  it('renders market prices interface', async () => {
    render(<MarketPrices />)
    
    expect(screen.getByText('स्मार्ट मार्केट विश्लेषण')).toBeInTheDocument()
    expect(screen.getByText(/एआई द्वारा संचालित व्यापक बाजार मूल्य विश्लेषण/)).toBeInTheDocument()
  })

  it('displays quick statistics', async () => {
    render(<MarketPrices />)
    
    expect(screen.getByText('डेटा सारांश')).toBeInTheDocument()
    expect(screen.getByText('कुल:')).toBeInTheDocument()
  })

  it('shows search and filter options', async () => {
    render(<MarketPrices />)
    
    expect(screen.getByPlaceholderText('फसल, किस्म, या मंडी का नाम खोजें...')).toBeInTheDocument()
    expect(screen.getByText('सभी श्रेणियां')).toBeInTheDocument()
    expect(screen.getByText('सभी राज्य')).toBeInTheDocument()
  })

  it('displays crop price cards', async () => {
    render(<MarketPrices />)
    
    // Expand a category to show the price cards
    const categoryHeader = screen.getByText('अनाज')
    fireEvent.click(categoryHeader)
    
    await waitFor(() => {
      expect(screen.getAllByText('गेहूं')[0]).toBeInTheDocument()
    })
  })

  it('shows market trends with price changes', async () => {
    render(<MarketPrices />)
    
    const categoryHeader = screen.getByText('अनाज')
    fireEvent.click(categoryHeader)
    
    await waitFor(() => {
      expect(screen.getAllByText('+2.6%')[0]).toBeInTheDocument()
    })
  })

  it('displays market insights section', async () => {
    render(<MarketPrices />)
    
    const analysisToggle = screen.getByText('बाज़ार विश्लेषण और सिफारिशें देखें')
    fireEvent.click(analysisToggle)
    
    expect(screen.getByText('बाज़ार विश्लेषण')).toBeInTheDocument()
    expect(screen.getByText('सबसे महंगी फसलें')).toBeInTheDocument()
  })

  it('shows nearby markets section', async () => {
    render(<MarketPrices />)
    
    const categoryHeader = screen.getByText('अनाज')
    fireEvent.click(categoryHeader)
    
    await waitFor(() => {
      expect(screen.getAllByText(/दिल्ली मंडी/)[0]).toBeInTheDocument()
    })
  })

  it('displays price alerts section', async () => {
    render(<MarketPrices />)
    
    // Disclaimer/price alerts details at the bottom of the page
    expect(screen.getByText(/भाव की जानकारी सरकारी APMC डेटा/)).toBeInTheDocument()
  })

  it('handles search functionality', async () => {
    render(<MarketPrices />)
    
    const searchInput = screen.getByPlaceholderText('फसल, किस्म, या मंडी का नाम खोजें...')
    fireEvent.change(searchInput, { target: { value: 'गेहूं' } })
    expect(searchInput).toHaveValue('गेहूं')
  })

  it('handles category expansion', async () => {
    render(<MarketPrices />)
    
    const categoryHeader = screen.getByText('अनाज')
    expect(categoryHeader).toBeInTheDocument()
    
    fireEvent.click(categoryHeader)
    // Category should expand without error
  })

  it('displays refresh functionality', async () => {
    render(<MarketPrices />)
    
    const refreshButton = screen.getByText('रिफ्रेश')
    expect(refreshButton).toBeInTheDocument()
  })

  it('shows disclaimer information', async () => {
    render(<MarketPrices />)
    
    expect(screen.getByText(/भाव की जानकारी सरकारी APMC डेटा/)).toBeInTheDocument()
    expect(screen.getByText(/बिक्री से पहले स्थानीय मंडी से वर्तमान भाव/)).toBeInTheDocument()
  })
})
