import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '@/components/layout/Header'

describe('Header Component', () => {
  it('renders header with logo and navigation', () => {
    render(<Header />)
    
    // Check if main elements are present
    expect(screen.getByText('KisanAI')).toBeInTheDocument()
    expect(screen.getByText('आवाज सहायक')).toBeInTheDocument()
    expect(screen.getByText('फसल विश्लेषण')).toBeInTheDocument()
    expect(screen.getByText('मौसम')).toBeInTheDocument()
    expect(screen.getByText('मंडी भाव')).toBeInTheDocument()
    expect(screen.getByText('सरकारी योजनाएं')).toBeInTheDocument()
    expect(screen.getByText('KCC आवेदन')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<Header />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('displays logo with correct styling', () => {
    render(<Header />)
    
    const logo = screen.getByText('KisanAI')
    expect(logo).toHaveClass('text-green-800')
    expect(logo).toHaveClass('font-bold')
  })

  it('renders mobile menu toggle button', () => {
    render(<Header />)
    
    // Check for mobile menu button (responsive behavior)
    const menuButtons = screen.getAllByRole('button')
    expect(menuButtons.length).toBeGreaterThan(0)
  })
})
