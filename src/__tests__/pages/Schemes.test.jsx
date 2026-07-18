import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Schemes from '@/app/schemes/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/'
}))

describe('Schemes Component', () => {
  it('renders without crashing', () => {
    render(<Schemes />)
    expect(true).toBe(true)
  })
})
