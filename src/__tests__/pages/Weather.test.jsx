import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Weather from '@/app/weather/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/'
}))

describe('Weather Component', () => {
  it('renders without crashing', () => {
    render(<Weather />)
    expect(true).toBe(true)
  })
})
