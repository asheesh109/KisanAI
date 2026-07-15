import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CropAnalysis from '@/app/crop-analysis/page'

jest.mock('@/contexts/LanguageContext', () => {
  const translations = {
    cropAnalysis: 'Crop Analysis',
    analyzeCropHealth: 'Analyze Crop Health',
    uploadCropPhoto: 'Upload Crop Photo',
    dragDrop: 'Drag and drop your crop photo here or upload',
    supportedFormats: 'JPG, PNG or WebP format (max 4MB)',
    uploadFile: 'Upload File',
    photoQuality: 'Photo Quality',
    clearPhoto: 'Clear and clean photo',
    goodLighting: 'Good lighting',
    closeUp: 'Taken from close up',
    analysisFeatures: 'Analysis Features',
    diseaseDetection: 'Disease detection',
    pestInfectionCheck: 'Pest infection check',
    nutrientAnalysis: 'Nutrient analysis',
    betterResults: 'For Better Results',
    daytimePhoto: 'Take photo during daytime',
    focusOnProblem: 'Focus on problematic area',
    multipleAngles: 'Photos from multiple angles',
    photoAnalysis: 'Photo Analysis',
    newPhoto: 'New Photo',
    startAnalysis: 'Start Analysis',
    clickToStartAnalysis: 'Click to start analysis',
  }

  return {
    useLanguage: () => ({
      language: 'en',
      t: (key) => translations[key] || key,
    }),
  }
})

const mockReadAsDataURL = jest.fn()

global.FileReader = jest.fn(() => ({
  onload: null,
  onerror: null,
  result: 'data:image/jpeg;base64,mockbase64data',

  readAsDataURL(file) {
    mockReadAsDataURL(file)

    if (this.onload) {
      this.onload({
        target: {
          result: this.result,
        },
      })
    }
  },
}))

describe('Crop Analysis Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the crop analysis interface', () => {
    render(<CropAnalysis />)

    expect(
      screen.getByRole('heading', {
        name: 'Crop Analysis',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Analyze Crop Health'),
    ).toBeInTheDocument()
  })

  it('displays the file upload area', () => {
    render(<CropAnalysis />)

    expect(
      screen.getByRole('heading', {
        name: 'Upload Crop Photo',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Upload File'),
    ).toBeInTheDocument()
  })

  it('shows the information cards', () => {
    render(<CropAnalysis />)

    expect(screen.getByText('Photo Quality')).toBeInTheDocument()
    expect(screen.getByText('Analysis Features')).toBeInTheDocument()
    expect(screen.getByText('For Better Results')).toBeInTheDocument()
  })

  it('handles a valid image upload', async () => {
    render(<CropAnalysis />)

    const file = new File(
      ['mock image'],
      'crop.jpg',
      { type: 'image/jpeg' },
    )

    const input = document.querySelector('input[type="file"]')

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    })

    expect(mockReadAsDataURL).toHaveBeenCalledWith(file)

    expect(
      await screen.findByAltText('Selected crop'),
    ).toBeInTheDocument()
  })

  it('supports drag-and-drop image upload', async () => {
    render(<CropAnalysis />)

    const file = new File(
      ['mock image'],
      'crop.jpg',
      { type: 'image/jpeg' },
    )

    const dropZone = screen
      .getByText('Drag and drop your crop photo here or upload')
      .closest('div')

    expect(dropZone).toBeInTheDocument()

    fireEvent.dragEnter(dropZone)
    fireEvent.dragOver(dropZone)

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    })

    expect(mockReadAsDataURL).toHaveBeenCalledWith(file)

    expect(
      await screen.findByAltText('Selected crop'),
    ).toBeInTheDocument()
  })

  it('displays photo guidance', () => {
    render(<CropAnalysis />)

    expect(
      screen.getByText('Clear and clean photo'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Good lighting'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Taken from close up'),
    ).toBeInTheDocument()
  })

  it('shows the supported analysis features', () => {
    render(<CropAnalysis />)

    expect(
      screen.getByText('Disease detection'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Pest infection check'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Nutrient analysis'),
    ).toBeInTheDocument()
  })
})