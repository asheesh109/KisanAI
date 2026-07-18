import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import HeroBanner from '@/components/HeroBanner'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/'
}))

describe('HeroBanner Component', () => {
  it('renders without crashing', () => {
    render(<HeroBanner />)
    expect(true).toBe(true)
  })
})
