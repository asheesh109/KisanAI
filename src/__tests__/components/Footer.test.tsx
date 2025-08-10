import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Footer from '@/components/layout/Footer'

describe('Footer Component', () => {
  it('renders footer with contact information', () => {
    render(<Footer />)
    
    // Check main footer content
    expect(screen.getByText('KisanAI')).toBeInTheDocument()
    expect(screen.getByText(/कृषि सहायक/)).toBeInTheDocument()
  })

  it('contains links to important pages', () => {
    render(<Footer />)
    
    // Check for footer links
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('displays copyright information', () => {
    render(<Footer />)
    
    // Check for copyright or year information
    const currentYear = new Date().getFullYear()
    const copyrightText = screen.getByText(new RegExp(currentYear.toString()))
    expect(copyrightText).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<Footer />)
    
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })
})
