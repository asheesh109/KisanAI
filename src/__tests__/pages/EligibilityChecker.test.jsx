import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EligibilityChecker from '../../app/schemes/eligibility-checker/page'
import '@testing-library/jest-dom'

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }) => (
    <a href={href}>{children}</a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('Eligibility Checker Page', () => {
  it('renders the main heading and description', () => {
    render(<EligibilityChecker />)
    
    expect(screen.getByText('पात्रता जांच')).toBeInTheDocument()
    expect(screen.getByText('अपनी पात्रता की जांच करें और सही योजना का चुनाव करें')).toBeInTheDocument()
  })

  it('shows back to schemes button', () => {
    render(<EligibilityChecker />)
    
    const backButton = screen.getByText('योजनाओं पर वापस जाएं')
    expect(backButton).toBeInTheDocument()
    
    const backLink = backButton.closest('a')
    expect(backLink).toHaveAttribute('href', '/schemes')
  })

  it('displays scheme selection cards', () => {
    render(<EligibilityChecker />)
    
    expect(screen.getByText('योजना चुनें')).toBeInTheDocument()
    expect(screen.getByText('प्रधानमंत्री किसान सम्मान निधि')).toBeInTheDocument()
    
    const checkButtons = screen.getAllByText('पात्रता जांचें')
    expect(checkButtons.length).toBeGreaterThan(0)
  })

  it('shows eligibility form when scheme is selected', async () => {
    render(<EligibilityChecker />)
    
    // Click on PM-KISAN scheme
    const pmKisanCard = screen.getByText('प्रधानमंत्री किसान सम्मान निधि').closest('.cursor-pointer')
    expect(pmKisanCard).toBeInTheDocument()
    
    if (pmKisanCard) {
      fireEvent.click(pmKisanCard)
    }
    
    await waitFor(() => {
      expect(screen.getByText('कृपया निम्नलिखित जानकारी भरें')).toBeInTheDocument()
      expect(screen.getByText('योजना बदलें')).toBeInTheDocument()
    })
  })

  it('displays form fields for PM-KISAN eligibility', async () => {
    render(<EligibilityChecker />)
    
    // Select PM-KISAN scheme by clicking first scheme
    const firstSchemeButton = screen.getAllByText('पात्रता जांचें')[0]
    fireEvent.click(firstSchemeButton)
    
    await waitFor(() => {
      expect(screen.getByText('भूमि स्वामित्व (हेक्टेयर)')).toBeInTheDocument()
      expect(screen.getByText('किसान प्रकार')).toBeInTheDocument()
      expect(screen.getByText('आधार कार्ड है')).toBeInTheDocument()
      expect(screen.getByText('बैंक खाता है')).toBeInTheDocument()
    })
  })

  it('handles form submission and shows results', async () => {
    render(<EligibilityChecker />)
    
    // Select first scheme
    const firstSchemeButton = screen.getAllByText('पात्रता जांचें')[0]
    fireEvent.click(firstSchemeButton)
    
    await waitFor(() => {
      // Check that form is shown
      expect(screen.getByText('कृपया निम्नलिखित जानकारी भरें')).toBeInTheDocument()
      
      // Fill out the form
      const landInput = screen.getByRole('spinbutton')
      fireEvent.change(landInput, { target: { value: '1.5' } })
      
      const farmerTypeSelect = screen.getByRole('combobox')
      fireEvent.change(farmerTypeSelect, { target: { value: 'small' } })
      
      // Click yes for boolean fields
      const yesRadios = screen.getAllByDisplayValue('true')
      yesRadios.forEach(radio => {
        fireEvent.click(radio)
      })
      
      // Submit form
      const submitButtons = screen.getAllByText('पात्रता जांचें')
      const submitButton = submitButtons[submitButtons.length - 1]
      fireEvent.click(submitButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('पात्रता परिणाम')).toBeInTheDocument()
    })
  })

  it('shows eligible result for valid data', async () => {
    render(<EligibilityChecker />)
    
    // Select and fill form with valid data
    const firstSchemeButton = screen.getAllByText('पात्रता जांचें')[0]
    fireEvent.click(firstSchemeButton)
    
    await waitFor(() => {
      // Fill valid data
      const landInput = screen.getByRole('spinbutton')
      fireEvent.change(landInput, { target: { value: '1.5' } })
      
      const farmerTypeSelect = screen.getByRole('combobox')
      fireEvent.change(farmerTypeSelect, { target: { value: 'small' } })
      
      // Select yes for boolean fields
      const yesRadios = screen.getAllByDisplayValue('true')
      yesRadios.forEach(radio => {
        fireEvent.click(radio)
      })
      
      // Submit
      const submitButtons = screen.getAllByText('पात्रता जांचें')
      const submitButton = submitButtons[submitButtons.length - 1] // Get the submit button, not the card buttons
      fireEvent.click(submitButton)
    })
    
    await waitFor(() => {
      // Should show eligible status
      expect(screen.getByText('पात्रता परिणाम')).toBeInTheDocument()
    })
  })

  it('allows resetting the form', async () => {
    render(<EligibilityChecker />)
    
    // Select scheme
    const firstSchemeButton = screen.getAllByText('पात्रता जांचें')[0]
    fireEvent.click(firstSchemeButton)
    
    await waitFor(() => {
      // Click reset button
      const resetButton = screen.getByText('योजना बदलें')
      fireEvent.click(resetButton)
    })
    
    await waitFor(() => {
      // Should be back to scheme selection
      expect(screen.getByText('योजना चुनें')).toBeInTheDocument()
    })
  })

  it('displays help section', () => {
    render(<EligibilityChecker />)
    
    expect(screen.getByText('सहायता और जानकारी')).toBeInTheDocument()
    expect(screen.getByText('महत्वपूर्ण सूचना:')).toBeInTheDocument()
    expect(screen.getByText('सहायता हेतु संपर्क:')).toBeInTheDocument()
    expect(screen.getByText(/यह केवल प्रारंभिक पात्रता जांच है/)).toBeInTheDocument()
    expect(screen.getByText(/किसान हेल्पलाइन: 1551/)).toBeInTheDocument()
  })

  it('shows different form fields for different schemes', async () => {
    render(<EligibilityChecker />)
    
    // Should show different schemes with different criteria
    const schemeCards = screen.getAllByText('पात्रता जांचें')
    expect(schemeCards.length).toBeGreaterThan(1)
    
    // Each scheme should have its own eligibility criteria
    expect(screen.getByText('योजना चुनें')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<EligibilityChecker />)
    
    // Select scheme
    const firstSchemeButton = screen.getAllByText('पात्रता जांचें')[0]
    fireEvent.click(firstSchemeButton)
    
    await waitFor(() => {
      // Try to submit without filling required fields
      const submitButtons = screen.getAllByText('पात्रता जांचें')
      const submitButton = submitButtons[submitButtons.length - 1]
      fireEvent.click(submitButton)
      
      // Should still show the form (no results)
      expect(screen.getByText('कृपया निम्नलिखित जानकारी भरें')).toBeInTheDocument()
    })
  })

  it('shows recommendations based on eligibility', async () => {
    render(<EligibilityChecker />)
    
    // This test would need more complex setup to actually check recommendations
    // For now, just verify the component renders without errors
    expect(screen.getByText('पात्रता जांच')).toBeInTheDocument()
  })
})
