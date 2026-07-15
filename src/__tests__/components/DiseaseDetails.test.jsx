import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import DiseaseDetails from '@/components/CropAnalysis/DiseaseDetails'

const labels = {
  about: 'About the Condition',
  causes: 'Causes',
  symptoms: 'Common Symptoms',
  prevention: 'Prevention',
  treatment: 'Treatment Recommendations',
  unavailable: 'Information unavailable',
}

const completeDetails = {
  overview: 'A fungal condition that affects plant leaves.',
  causes: [
    'Warm and humid weather',
    'Infected plant material',
  ],
  symptoms: [
    'Brown leaf spots',
    'Yellowing leaves',
  ],
  prevention: [
    'Rotate crops',
    'Keep tools clean',
  ],
  treatmentRecommendations: [
    'Remove affected leaves',
    'Follow approved product-label directions',
  ],
}

describe('DiseaseDetails', () => {
  it('renders every detailed disease-information section', () => {
    render(
      <DiseaseDetails
        {...completeDetails}
        labels={labels}
      />,
    )

    expect(
      screen.getByTestId('disease-details'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: labels.about,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: labels.causes,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: labels.symptoms,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: labels.prevention,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: labels.treatment,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(completeDetails.overview),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Warm and humid weather'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Brown leaf spots'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Rotate crops'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Remove affected leaves'),
    ).toBeInTheDocument()
  })

  it('shows a localized unavailable state for missing sections', () => {
    render(
      <DiseaseDetails
        overview="   "
        causes={[]}
        symptoms={[]}
        prevention={[]}
        treatmentRecommendations={[]}
        labels={labels}
      />,
    )

    expect(
      screen.getAllByRole('status'),
    ).toHaveLength(5)

    expect(
      screen.getAllByText(labels.unavailable),
    ).toHaveLength(5)
  })

  it('trims list entries and ignores blank items', () => {
    render(
      <DiseaseDetails
        overview=""
        causes={[
          '  Fungal spores  ',
          '',
          '   ',
          'High humidity',
        ]}
        symptoms={[]}
        prevention={[]}
        treatmentRecommendations={[]}
        labels={labels}
      />,
    )

    expect(
      screen.getByText('Fungal spores'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('High humidity'),
    ).toBeInTheDocument()

    expect(
      screen.getAllByRole('listitem'),
    ).toHaveLength(2)
  })

  it('provides accessible names for every section', () => {
    render(
      <DiseaseDetails
        {...completeDetails}
        labels={labels}
      />,
    )

    expect(
      screen.getByRole('region', {
        name: labels.about,
      }),
    ).toHaveClass('md:col-span-2')

    expect(
      screen.getByRole('region', {
        name: labels.causes,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('region', {
        name: labels.symptoms,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('region', {
        name: labels.prevention,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('region', {
        name: labels.treatment,
      }),
    ).toBeInTheDocument()
  })
})
