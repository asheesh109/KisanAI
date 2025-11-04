import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Weather from '@/app/weather/page'

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn()
}

// Define geolocation property if it doesn't exist
if (!global.navigator) {
  global.navigator = {}
}

if (!global.navigator.geolocation) {
  Object.defineProperty(global.navigator, 'geolocation', {
    value: mockGeolocation,
    configurable: true,
    writable: true
  })
}

// Mock fetch for weather API calls
global.fetch = jest.fn()

describe('Weather Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset fetch mock
    global.fetch.mockClear()
  })

  it('renders weather interface', () => {
    render(<Weather />)
    
    expect(screen.getByText('मौसम पूर्वानुमान')).toBeInTheDocument()
    expect(screen.getByText(/सटीक मौसम जानकारी/)).toBeInTheDocument()
  })

  it('displays location button', () => {
    render(<Weather />)
    
    expect(screen.getByText('अपना स्थान प्राप्त करें')).toBeInTheDocument()
  })

  it('handles location access', async () => {
    const mockPosition = {
      coords: {
        latitude: 28.6139,
        longitude: 77.2090,
        accuracy: 100
      }
    }

    // Mock successful geolocation
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition)
    })

    render(<Weather />)
    
    const locationButton = screen.getByText('अपना स्थान प्राप्त करें')
    fireEvent.click(locationButton)

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
  })

  it('displays weather features', () => {
    render(<Weather />)
    
    expect(screen.getByText('मौसम सुविधाएं')).toBeInTheDocument()
    expect(screen.getByText(/7-दिन का पूर्वानुमान/)).toBeInTheDocument()
    expect(screen.getByText(/फसल सलाह/)).toBeInTheDocument()
    expect(screen.getByText(/सिंचाई की सलाह/)).toBeInTheDocument()
  })

  it('shows farming advisory section', () => {
    render(<Weather />)
    
    expect(screen.getByText('खेती सलाह')).toBeInTheDocument()
    expect(screen.getByText(/मौसम के अनुसार/)).toBeInTheDocument()
  })

  it('displays weather information cards', () => {
    render(<Weather />)
    
    expect(screen.getByText('तापमान')).toBeInTheDocument()
    expect(screen.getByText('आर्द्रता')).toBeInTheDocument()
    expect(screen.getByText('हवा की गति')).toBeInTheDocument()
    expect(screen.getByText('बारिश')).toBeInTheDocument()
  })

  it('handles location error gracefully', async () => {
    // Mock geolocation error
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 1,
        message: 'User denied geolocation'
      })
    })

    render(<Weather />)
    
    const locationButton = screen.getByText('अपना स्थान प्राप्त करें')
    fireEvent.click(locationButton)

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
  })

  it('displays manual location input option', () => {
    render(<Weather />)
    
    expect(screen.getByText(/शहर का नाम दर्ज करें/)).toBeInTheDocument()
  })

  it('shows weather alerts section', () => {
    render(<Weather />)
    
    expect(screen.getByText('मौसम चेतावनी')).toBeInTheDocument()
    expect(screen.getByText(/तत्काल अपडेट/)).toBeInTheDocument()
  })

  it('displays farming tips based on weather', () => {
    render(<Weather />)
    
    // Check for weather-based farming advice
    expect(screen.getByText(/तापमान के अनुसार/)).toBeInTheDocument()
    expect(screen.getByText(/बारिश की संभावना/)).toBeInTheDocument()
  })
})
