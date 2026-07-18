import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import VoiceAssistant from '@/app/voice-assistant/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/'
}))

describe('VoiceAssistant Component', () => {
  it('renders without crashing', () => {
    render(<VoiceAssistant />)
    expect(true).toBe(true)
  })
})
