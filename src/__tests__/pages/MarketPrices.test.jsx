import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import MarketPrices from '@/app/market-prices/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/'
}))

describe('MarketPrices Component', () => {
  it('renders without crashing', () => {
    render(<MarketPrices />)
    expect(true).toBe(true)
  })
})
