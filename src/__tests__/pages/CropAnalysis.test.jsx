import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CropAnalysis from '@/app/crop-analysis/page'

// Mock FileReader
const mockFileReader = {
  readAsDataURL: jest.fn(),
  onload: null,
  result: 'data:image/jpeg;base64,mockbase64data'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.FileReader = jest.fn(() => mockFileReader) as any

describe('Crop Analysis Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders crop analysis interface', () => {
    render(<CropAnalysis />)
    
    expect(screen.getByText('फसल विश्लेषण')).toBeInTheDocument()
    expect(screen.getByText(/अपनी फसल की फोटो अपलोड करें/)).toBeInTheDocument()
  })

  it('displays file upload area', () => {
    render(<CropAnalysis />)
    
    expect(screen.getByText('फसल की फोटो अपलोड करें')).toBeInTheDocument()
    expect(screen.getByText('फाइल अपलोड करें')).toBeInTheDocument()
  })

  it('shows information cards', () => {
    render(<CropAnalysis />)
    
    expect(screen.getByText('फोटो की गुणवत्ता')).toBeInTheDocument()
    expect(screen.getByText('विश्लेषण सुविधाएं')).toBeInTheDocument()
    expect(screen.getByText('बेहतर परिणाम के लिए')).toBeInTheDocument()
  })

  it('handles file upload', async () => {
    render(<CropAnalysis />)
    
    const file = new File(['mock image'], 'crop.jpg', { type: 'image/jpeg' })
    
    // Simulate file upload
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (hiddenInput) {
      Object.defineProperty(hiddenInput, 'files', {
        value: [file],
        writable: false,
      })
      
      fireEvent.change(hiddenInput)
      
      // Should trigger file reader
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file)
    }
  })

  it('supports drag and drop functionality', () => {
    render(<CropAnalysis />)
    
    const dropZone = screen.getByText(/यहाँ अपनी फसल की फोटो खींचें/i).closest('div')
    expect(dropZone).toBeInTheDocument()
    
    // Test drag events
    if (dropZone) {
      fireEvent.dragEnter(dropZone)
      fireEvent.dragOver(dropZone)
      fireEvent.dragLeave(dropZone)
    }
  })

  it('displays analysis tips', () => {
    render(<CropAnalysis />)
    
    expect(screen.getByText(/स्पष्ट और साफ फोटो/)).toBeInTheDocument()
    expect(screen.getByText(/अच्छी रोशनी में/)).toBeInTheDocument()
    expect(screen.getByText(/पास से खींची गई/)).toBeInTheDocument()
  })

  it('shows supported features', () => {
    render(<CropAnalysis />)
    
    expect(screen.getByText(/रोग की पहचान/)).toBeInTheDocument()
    expect(screen.getByText(/कीट संक्रमण जांच/)).toBeInTheDocument()
    expect(screen.getByText(/पोषक तत्व विश्लेषण/)).toBeInTheDocument()
  })
})
