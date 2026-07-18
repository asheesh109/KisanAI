import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import EligibilityChecker from '@/app/schemes/eligibility-checker/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/'
}))

describe('EligibilityChecker Component', () => {
  it('renders without crashing', () => {
    render(<EligibilityChecker />)
    expect(true).toBe(true)
  })
})
