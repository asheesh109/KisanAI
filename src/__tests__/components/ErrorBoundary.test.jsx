import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ErrorBoundary from '@/components/ErrorBoundary'

describe('ErrorBoundary', () => {
  it('shows a safe fallback UI with retry and report issue actions', () => {
    const ThrowingChild = () => {
      throw new Error('Sensitive details that should not reach the fallback UI')
    }

    jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary scopeName="Schemes page">
        <ThrowingChild />
      </ErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/Your data is safe/i)).toBeInTheDocument()
    expect(screen.queryByText(/Sensitive details/)).not.toBeInTheDocument()

    const reportLink = screen.getByRole('link', { name: /report issue/i })
    expect(reportLink).toHaveAttribute('href', 'https://github.com/asheesh109/KisanAI/issues/new')
  })

  it('logs caught errors without exposing them to the user', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const ThrowingChild = () => {
      throw new Error('Route crashed')
    }

    render(
      <ErrorBoundary scopeName="Weather page">
        <ThrowingChild />
      </ErrorBoundary>
    )

    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })

  it('recovers when retry is clicked after the child stops throwing', () => {
    let shouldThrow = true

    const FlakyChild = () => {
      if (shouldThrow) {
        throw new Error('Transient render failure')
      }

      return <div>Recovered page content</div>
    }

    jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary scopeName="Home page">
        <FlakyChild />
      </ErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()

    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))

    expect(screen.getByText('Recovered page content')).toBeInTheDocument()
  })

  it('isolates a failing subtree from a healthy sibling subtree', () => {
    const ThrowingChild = () => {
      throw new Error('Only one subtree should fail')
    }

    const HealthyChild = () => <div>Healthy sibling subtree</div>

    jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <div>
        <ErrorBoundary scopeName="Schemes page">
          <ThrowingChild />
        </ErrorBoundary>
        <ErrorBoundary scopeName="Weather page">
          <HealthyChild />
        </ErrorBoundary>
      </div>
    )

    expect(screen.getByText('Healthy sibling subtree')).toBeInTheDocument()
    expect(screen.getAllByRole('alert')).toHaveLength(1)
  })
})