import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HeroBanner from '@/components/HeroBanner'

// Mock the government schemes data
jest.mock('../../data/governmentSchemes', () => ({
  bannerImages: [
    {
      id: 1,
      title: 'PM-KISAN Scheme',
      titleHindi: 'प्रधानमंत्री किसान योजना',
      description: 'Direct income support for farmers',
      descriptionHindi: 'किसानों के लिए प्रत्यक्ष आय सहायता',
      image: '/test-banner-1.jpg',
      ctaText: 'Apply Now',
      ctaTextHindi: 'अभी आवेदन करें',
      ctaLink: '/schemes/pm-kisan'
    }
  ]
}))

describe('HeroBanner Component', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders banner with initial slide', () => {
    render(<HeroBanner />)
    
    expect(screen.getByText('प्रधानमंत्री किसान सम्मान निधि')).toBeInTheDocument()
    expect(screen.getByText('प्रत्यक्ष आय सहायता')).toBeInTheDocument()
  })

  it('displays navigation arrows', () => {
    render(<HeroBanner />)
    
    const prevButton = screen.getByRole('button', { name: /previous/i })
    const nextButton = screen.getByRole('button', { name: /next/i })
    
    expect(prevButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it('shows dot indicators for slides', () => {
    render(<HeroBanner />)
    
    const dots = screen.getAllByRole('button')
    // Should have navigation arrows + dot indicators
    expect(dots.length).toBeGreaterThan(2)
  })

  it('has proper contrast for text visibility', () => {
    render(<HeroBanner />)
    
    const heading = screen.getByText('प्रधानमंत्री किसान सम्मान निधि')
    expect(heading).toHaveStyle({ color: '#ffffff' })
  })

  it('contains call-to-action buttons', () => {
    render(<HeroBanner />)
    
    expect(screen.getByText('और जानकारी पाएं')).toBeInTheDocument()
    expect(screen.getByText('आवाज सहायक का उपयोग करें')).toBeInTheDocument()
  })
})
