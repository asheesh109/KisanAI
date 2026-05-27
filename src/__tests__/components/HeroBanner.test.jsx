import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HeroBanner from '@/components/HeroBanner'

describe('HeroBanner Component', () => {
  it('renders transforming agriculture badge', () => {
    render(<HeroBanner />)
    
    expect(screen.getByText('कृषि का परिवर्तन')).toBeInTheDocument()
  })

  it('renders main heading and tagline', () => {
    render(<HeroBanner />)
    
    expect(screen.getByText('किसानों को सशक्त बनाना')).toBeInTheDocument()
    expect(screen.getByText(/सरकारी योजनाओं, बाजार अंतर्दृष्टि और संसाधनों तक पहुंचें/)).toBeInTheDocument()
  })

  it('contains call-to-action buttons', () => {
    render(<HeroBanner />)
    
    expect(screen.getByText('योजनाओं का अन्वेषण करें')).toBeInTheDocument()
    expect(screen.getByText('वॉयस असिस्टेंट')).toBeInTheDocument()
  })

  it('displays active metrics stats', () => {
    render(<HeroBanner />)
    
    expect(screen.getByText('सरकारी योजनाएं')).toBeInTheDocument()
    expect(screen.getByText('समर्थन उपलब्ध')).toBeInTheDocument()
    expect(screen.getByText('किसानों की सहायता की गई')).toBeInTheDocument()
  })
})
