import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import CropAnalysis from '@/app/crop-analysis/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/'
}))

describe('CropAnalysis Component', () => {
  it('renders without crashing', () => {
    render(<CropAnalysis />)
    expect(true).toBe(true)
  })
})
