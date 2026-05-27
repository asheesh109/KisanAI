import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Weather from '@/app/weather/page'

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn()
}

// Define geolocation property unconditionally
if (!global.navigator) {
  global.navigator = {}
}

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  configurable: true,
  writable: true
})

// Mock fetch for weather API calls
global.fetch = jest.fn()
window.fetch = global.fetch

describe('Weather Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch.mockClear()

    // Default mock implementation for geolocation so page loads successfully
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 28.6139,
          longitude: 77.2090,
          accuracy: 100
        }
      })
    })

    // Default mock implementation for fetch to return current and forecast data
    global.fetch.mockImplementation((url) => {
      if (url.includes('forecast')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            cod: '200',
            list: [
              {
                dt: 1600000000,
                main: { temp: 30, humidity: 60 },
                weather: [{ main: 'Clear' }],
                wind: { speed: 5 },
                pop: 0.1
              }
            ]
          })
        })
      }
      // Current weather
      return Promise.resolve({
        json: () => Promise.resolve({
          cod: 200,
          name: 'Delhi',
          sys: { country: 'IN', sunrise: 1600000000, sunset: 1600040000 },
          main: { temp: 30, humidity: 60, pressure: 1013, feels_like: 32 },
          wind: { speed: 5, deg: 180 },
          weather: [{ main: 'Clear' }],
          uvi: 5
        })
      })
    })
  })

  it('renders weather interface', async () => {
    render(<Weather />)
    
    await waitFor(() => {
      expect(screen.getByText('मौसम की जानकारी')).toBeInTheDocument()
      expect(screen.getByText(/विस्तृत मौसम पूर्वानुमान/)).toBeInTheDocument()
    })
  })

  it('displays location button', async () => {
    render(<Weather />)
    
    await waitFor(() => {
      expect(screen.getByText('वर्तमान स्थान')).toBeInTheDocument()
    })
  })

  it('handles location access', async () => {
    render(<Weather />)
    
    await waitFor(() => {
      const locationButton = screen.getByText('वर्तमान स्थान')
      fireEvent.click(locationButton)
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
    })
  })

  it('displays weather features', async () => {
    render(<Weather />)
    
    await waitFor(() => {
      expect(screen.getByText(/5-दिवसीय पूर्वानुमान/)).toBeInTheDocument()
      expect(screen.getByText(/बीज बोएं/)).toBeInTheDocument()
      expect(screen.getByText(/सिंचाई करें/)).toBeInTheDocument()
    })
  })

  it('shows farming advisory section', async () => {
    render(<Weather />)
    
    await waitFor(() => {
      expect(screen.getAllByText(/एआई कृषि सलाह/)[0]).toBeInTheDocument()
      expect(screen.getByText(/कृषि कार्यों के लिए अनुकूल/)).toBeInTheDocument()
    })
  })

  it('displays weather information cards', async () => {
    render(<Weather />)
    
    await waitFor(() => {
      expect(screen.getAllByText(/महसूस हो रहा/)[0]).toBeInTheDocument()
      expect(screen.getAllByText(/नमी/)[0]).toBeInTheDocument()
      expect(screen.getAllByText(/हवा/)[0]).toBeInTheDocument()
    })
  })

  it('handles location error gracefully', async () => {
    // Mock geolocation error
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
      error({
        code: 1,
        message: 'User denied geolocation'
      })
    })

    render(<Weather />)
    
    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
    })
  })

  it('displays manual location input option', async () => {
    render(<Weather />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('शहर का नाम सर्च करें...')).toBeInTheDocument()
    })
  })

  it('shows weather alerts section', async () => {
    render(<Weather />)
    
    await waitFor(() => {
      expect(screen.getByText('मौसम चेतावनी')).toBeInTheDocument()
      expect(screen.getByText('अनुकूल मौसम स्थितियां')).toBeInTheDocument()
    })
  })

  it('displays farming tips based on weather', async () => {
    render(<Weather />)
    
    await waitFor(() => {
      expect(screen.getByText('कृषि सुझाव')).toBeInTheDocument()
      expect(screen.getByText(/बीज बोएं/)).toBeInTheDocument()
      expect(screen.getByText(/सिंचाई करें/)).toBeInTheDocument()
    })
  })
})
