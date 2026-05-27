import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import KCCApplication from '@/app/kcc-application/page'

describe('KCC Application Page', () => {
  it('renders KCC application interface', () => {
    render(<KCCApplication />)
    
    expect(screen.getByText('किसान क्रेडिट कार्ड')).toBeInTheDocument()
    expect(screen.getByText(/समय पर ऋण, समृद्ध किसान/)).toBeInTheDocument()
  })

  it('displays application steps', () => {
    render(<KCCApplication />)
    
    expect(screen.getByText('नया आवेदन शुरू करें')).toBeInTheDocument()
    expect(screen.getByText(/व्यक्तिगत जानकारी/)).toBeInTheDocument()
    expect(screen.getByText(/भूमि विवरण/)).toBeInTheDocument()
    expect(screen.getByText(/बैंक विवरण/)).toBeInTheDocument()
  })

  it('shows loan benefits', () => {
    render(<KCCApplication />)
    
    // Switch to Information tab
    const infoTab = screen.getByText('जानकारी')
    fireEvent.click(infoTab)
    
    expect(screen.getByText(/कम ब्याज दर/)).toBeInTheDocument()
    expect(screen.getByText(/2% ब्याज सब्सिडी उपलब्ध/)).toBeInTheDocument()
    expect(screen.getByText(/आसान भुगतान/)).toBeInTheDocument()
    expect(screen.getByText(/बीमा कवर/)).toBeInTheDocument()
  })

  it('displays required documents list', () => {
    render(<KCCApplication />)
    
    expect(screen.getByText('आवश्यक दस्तावेज')).toBeInTheDocument()
    expect(screen.getByText(/आधार कार्ड/)).toBeInTheDocument()
    expect(screen.getByText(/भूमि के कागजात/)).toBeInTheDocument()
    expect(screen.getByText(/बैंक पासबुक/)).toBeInTheDocument()
  })

  it('shows eligibility criteria', () => {
    render(<KCCApplication />)
    
    expect(screen.getByText('पात्रता मानदंड')).toBeInTheDocument()
    expect(screen.getByText(/भारतीय नागरिक होना आवश्यक/)).toBeInTheDocument()
    expect(screen.getByText(/कृषि भूमि का मालिक/)).toBeInTheDocument()
  })

  it('displays application status section', () => {
    render(<KCCApplication />)
    
    expect(screen.getByText('आवेदन स्थिति जांचें')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/आवेदन संख्या दर्ज करें/)).toBeInTheDocument()
  })

  it('handles application start button click', async () => {
    render(<KCCApplication />)
    
    const startLink = screen.getByRole('link', { name: /आवेदन शुरू करें/i })
    expect(startLink).toBeInTheDocument()
    
    fireEvent.click(startLink)
    
    // Should handle the click without errors
    await waitFor(() => {
      expect(startLink).toBeInTheDocument()
    })
  })
})
