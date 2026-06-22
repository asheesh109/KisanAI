import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HeroBanner from '@/components/HeroBanner'
import { LanguageProvider } from '@/contexts/LanguageContext'

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

const renderWithProvider = (ui) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  )
}

describe('HeroBanner Component', () => {
  it('renders hero heading', () => {
    renderWithProvider(<HeroBanner />)

    expect(screen.getByText('Empowering Farmers')).toBeInTheDocument()
  })

  it('renders hero tagline', () => {
    renderWithProvider(<HeroBanner />)

    expect(
      screen.getByText(
        'Access government schemes, market insights, and resources to grow your agricultural success'
      )
    ).toBeInTheDocument()
  })

  it('renders Explore Schemes button', () => {
    renderWithProvider(<HeroBanner />)

    expect(
      screen.getByRole('button', { name: /Explore Schemes/i })
    ).toBeInTheDocument()
  })

  it('renders Voice Assistant button', () => {
    renderWithProvider(<HeroBanner />)

    expect(
      screen.getByRole('button', { name: /Voice Assistant/i })
    ).toBeInTheDocument()
  })
})