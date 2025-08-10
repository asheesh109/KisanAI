import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MarketPrices from '@/app/market-prices/page'

describe('Market Prices Page', () => {
  it('renders market prices interface', () => {
    render(<MarketPrices />)
    
    expect(screen.getByText('बाजार भाव')).toBeInTheDocument()
    expect(screen.getByText(/आज के ताजे मंडी भाव/)).toBeInTheDocument()
  })

  it('displays quick statistics', () => {
    render(<MarketPrices />)
    
    expect(screen.getByText('बढ़ती कीमतें')).toBeInTheDocument()
    expect(screen.getByText('गिरती कीमतें')).toBeInTheDocument()
    expect(screen.getByText('कुल मंडियां')).toBeInTheDocument()
    expect(screen.getByText('कुल फसलें')).toBeInTheDocument()
  })

  it('shows search and filter options', () => {
    render(<MarketPrices />)
    
    expect(screen.getByPlaceholderText('फसल का नाम खोजें...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('मंडी का नाम खोजें...')).toBeInTheDocument()
    expect(screen.getByText('फिल्टर')).toBeInTheDocument()
  })

  it('displays crop price cards', () => {
    render(<MarketPrices />)
    
    // Look for the section title that contains the number of crops
    expect(screen.getByText(/आज के मंडी भाव/)).toBeInTheDocument()
    expect(screen.getAllByText('गेहूं')[0]).toBeInTheDocument()
    expect(screen.getAllByText('चावल')[0]).toBeInTheDocument()
    expect(screen.getAllByText('सोयाबीन')[0]).toBeInTheDocument()
  })

  it('shows market trends with price changes', () => {
    render(<MarketPrices />)
    
    // Check for price change indicators
    expect(screen.getByText('+2.4%')).toBeInTheDocument()
    expect(screen.getByText('-2.4%')).toBeInTheDocument()
    expect(screen.getByText('+2.7%')).toBeInTheDocument()
  })

  it('displays market insights section', () => {
    render(<MarketPrices />)
    
    expect(screen.getByText('बाजार अंतर्दृष्टि')).toBeInTheDocument()
    expect(screen.getByText('प्याज की कीमतों में तेजी')).toBeInTheDocument()
  })

  it('shows nearby markets section', () => {
    render(<MarketPrices />)
    
    expect(screen.getByText('नजदीकी मंडियां')).toBeInTheDocument()
    expect(screen.getAllByText('दिल्ली मंडी')[0]).toBeInTheDocument()
  })

  it('displays price alerts section', () => {
    render(<MarketPrices />)
    
    expect(screen.getByText('मूल्य अलर्ट')).toBeInTheDocument()
    expect(screen.getByText('नया अलर्ट')).toBeInTheDocument()
  })

  it('handles search functionality', () => {
    render(<MarketPrices />)
    
    const searchInput = screen.getByPlaceholderText('फसल का नाम खोजें...')
    fireEvent.change(searchInput, { target: { value: 'गेहूं' } })
    expect(searchInput).toHaveValue('गेहूं')
  })

  it('handles view mode switching', () => {
    render(<MarketPrices />)
    
    const gridButton = screen.getByText('ग्रिड')
    const listButton = screen.getByText('लिस्ट')
    
    expect(gridButton).toBeInTheDocument()
    expect(listButton).toBeInTheDocument()
    
    fireEvent.click(listButton)
    // Should switch to list view mode
  })

  it('displays refresh functionality', () => {
    render(<MarketPrices />)
    
    const refreshButton = screen.getByText('रिफ्रेश करें')
    expect(refreshButton).toBeInTheDocument()
    
    fireEvent.click(refreshButton)
    // Should trigger data refresh
  })

  it('shows disclaimer information', () => {
    render(<MarketPrices />)
    
    expect(screen.getByText('महत्वपूर्ण जानकारी')).toBeInTheDocument()
    expect(screen.getByText(/APMC और अन्य स्रोतों से प्राप्त/)).toBeInTheDocument()
  })
})
