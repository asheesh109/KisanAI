import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import KCCApplication from '@/app/kcc-application/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/'
}))

describe('KCCApplication Component', () => {
  it('renders without crashing', () => {
    render(<KCCApplication />)
    expect(true).toBe(true)
  })
})
