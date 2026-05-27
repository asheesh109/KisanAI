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
  it('renders loading state initially', () => {
    render(<EligibilityChecker />)
    expect(screen.getByText(/सरकारी योजनाओं की जानकारी लाई जा रही है/i)).toBeInTheDocument()
  })

  it('renders the main heading and schemes portal after loading', async () => {
    render(<EligibilityChecker />)
    
    // Wait for the loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/सरकारी योजनाओं की जानकारी लाई जा रही है/i)).not.toBeInTheDocument()
    })

    // Expect the main heading (using the mock translation or key)
    expect(screen.getByText('सरकारी योजनाएं पोर्टल')).toBeInTheDocument()
    expect(screen.getByText(/केंद्र और राज्य सरकारों की कृषि योजनाएं/)).toBeInTheDocument()
  })

  it('displays statistics and categories', async () => {
    render(<EligibilityChecker />)
    
    await waitFor(() => {
      expect(screen.queryByText(/सरकारी योजनाओं की जानकारी लाई जा रही है/i)).not.toBeInTheDocument()
    })

    // Expect categories to be rendered (using localized strings or fallback keys)
    expect(screen.getAllByText('आय सहायता').length).toBeGreaterThan(0)
    expect(screen.getAllByText('फसल बीमा').length).toBeGreaterThan(0)
  })

  it('opens the eligibility check modal when check eligibility button is clicked', async () => {
    render(<EligibilityChecker />)
    
    await waitFor(() => {
      expect(screen.queryByText(/सरकारी योजनाओं की जानकारी लाई जा रही है/i)).not.toBeInTheDocument()
    })

    // Find and click the eligibility check button in the status bar
    const checkButtons = screen.getAllByRole('button')
    const checkButton = checkButtons.find(btn => btn.textContent.includes('पात्रता जांचें'))
    expect(checkButton).toBeInTheDocument()

    fireEvent.click(checkButton)

    // Modal should be visible now
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'पात्रता जांच', level: 2 })).toBeInTheDocument()
      expect(screen.getByText('वार्षिक आय (₹ में)')).toBeInTheDocument()
      expect(screen.getByText('भूमि स्वामित्व (हेक्टेयर में)')).toBeInTheDocument()
    })
  })

  it('handles form inputs and closes modal on cancel', async () => {
    render(<EligibilityChecker />)
    
    await waitFor(() => {
      expect(screen.queryByText(/सरकारी योजनाओं की जानकारी लाई जा रही है/i)).not.toBeInTheDocument()
    })

    // Open the modal
    const checkButtons = screen.getAllByRole('button')
    const checkButton = checkButtons.find(btn => btn.textContent.includes('पात्रता जांचें'))
    fireEvent.click(checkButton)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'पात्रता जांच', level: 2 })).toBeInTheDocument()
    })

    // Fill inputs
    const incomeInput = screen.getByPlaceholderText('150000')
    const landInput = screen.getByPlaceholderText('2.5')

    fireEvent.change(incomeInput, { target: { value: '120000' } })
    fireEvent.change(landInput, { target: { value: '1.5' } })

    expect(incomeInput).toHaveValue(120000)
    expect(landInput).toHaveValue(1.5)

    // Click Cancel
    const cancelButton = screen.getByRole('button', { name: /रद्द करें/i })
    fireEvent.click(cancelButton)

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'पात्रता जांच', level: 2 })).not.toBeInTheDocument()
    })
  })

  it('filters schemes based on eligibility inputs after form submission', async () => {
    render(<EligibilityChecker />)
    
    await waitFor(() => {
      expect(screen.queryByText(/सरकारी योजनाओं की जानकारी लाई जा रही है/i)).not.toBeInTheDocument()
    })

    // Open the modal
    const checkButtons = screen.getAllByRole('button')
    const checkButton = checkButtons.find(btn => btn.textContent.includes('पात्रता जांचें'))
    fireEvent.click(checkButton)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'पात्रता जांच', level: 2 })).toBeInTheDocument()
    })

    // Fill and submit
    const incomeInput = screen.getByPlaceholderText('150000')
    const landInput = screen.getByPlaceholderText('2.5')

    fireEvent.change(incomeInput, { target: { value: '80000' } })
    fireEvent.change(landInput, { target: { value: '1.0' } })

    const modalSubmitButtons = screen.getAllByRole('button')
    const submitButton = modalSubmitButtons.find(
      btn => btn.textContent === 'पात्रता जांचें' && btn.className.includes('flex-1')
    )
    expect(submitButton).not.toBeDisabled()
    fireEvent.click(submitButton)

    // Modal should close, and status bar should show eligibility filter active
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'पात्रता जांच', level: 2 })).not.toBeInTheDocument()
      expect(screen.getByText(/पात्रता फ़िल्टर सक्रिय:/i)).toBeInTheDocument()
    })

    // Can remove the eligibility filter
    const removeButton = screen.getByRole('button', { name: /पात्रता फ़िल्टर हटाएं/i })
    expect(removeButton).toBeInTheDocument()
    fireEvent.click(removeButton)

    // Active text should be gone
    await waitFor(() => {
      expect(screen.queryByText(/पात्रता फ़िल्टर सक्रिय:/i)).not.toBeInTheDocument()
    })
  })
})

