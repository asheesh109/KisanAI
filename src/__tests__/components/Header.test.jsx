import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '@/components/layout/Header'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/'
}))

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(<Header />)
    expect(true).toBe(true)
  })
})
