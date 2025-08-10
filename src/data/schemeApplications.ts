// Types for scheme applications and eligibility
export interface ApplicationStatus {
  id: string;
  schemeId: string;
  applicantName: string;
  applicationNumber: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'documents-required';
  submittedDate: string;
  lastUpdated: string;
  nextAction?: string;
  remarks?: string;
}

export interface EligibilityCheck {
  schemeId: string;
  criteria: {
    field: string;
    label: string;
    labelHindi: string;
    type: 'number' | 'select' | 'boolean' | 'text';
    required: boolean;
    options?: { value: string; label: string; labelHindi: string }[];
    min?: number;
    max?: number;
    unit?: string;
  }[];
}

export interface EligibilityResult {
  eligible: boolean;
  score: number;
  maxScore: number;
  missingCriteria: string[];
  recommendations: string[];
  recommendationsHindi: string[];
}

// Mock application statuses
export const mockApplications: ApplicationStatus[] = [
  {
    id: 'app-001',
    schemeId: 'pm-kisan',
    applicantName: 'राज कुमार',
    applicationNumber: 'PMK2024001234',
    status: 'approved',
    submittedDate: '2024-01-15',
    lastUpdated: '2024-02-01',
    nextAction: 'राशि आपके खाते में स्थानांतरित कर दी गई है',
    remarks: 'सभी दस्तावेज सत्यापित'
  },
  {
    id: 'app-002',
    schemeId: 'crop-insurance',
    applicantName: 'सुनीता देवी',
    applicationNumber: 'CI2024005678',
    status: 'under-review',
    submittedDate: '2024-02-20',
    lastUpdated: '2024-02-25',
    nextAction: 'खेत निरीक्षण की प्रतीक्षा',
    remarks: 'दस्तावेज सत्यापन पूर्ण'
  },
  {
    id: 'app-003',
    schemeId: 'soil-health-card',
    applicantName: 'मनोहर सिंह',
    applicationNumber: 'SHC2024009876',
    status: 'documents-required',
    submittedDate: '2024-02-28',
    lastUpdated: '2024-03-05',
    nextAction: 'भूमि रिकॉर्ड की प्रति जमा करें',
    remarks: 'अतिरिक्त दस्तावेज आवश्यक'
  }
]

// Eligibility criteria for different schemes
export const eligibilityCriteria: EligibilityCheck[] = [
  {
    schemeId: 'pm-kisan',
    criteria: [
      {
        field: 'landHolding',
        label: 'Land Holding',
        labelHindi: 'भूमि स्वामित्व (हेक्टेयर)',
        type: 'number',
        required: true,
        max: 2,
        unit: 'हेक्टेयर'
      },
      {
        field: 'farmerType',
        label: 'Farmer Type',
        labelHindi: 'किसान प्रकार',
        type: 'select',
        required: true,
        options: [
          { value: 'small', label: 'Small Farmer', labelHindi: 'छोटा किसान' },
          { value: 'marginal', label: 'Marginal Farmer', labelHindi: 'सीमांत किसान' }
        ]
      },
      {
        field: 'hasAadhaar',
        label: 'Has Aadhaar Card',
        labelHindi: 'आधार कार्ड है',
        type: 'boolean',
        required: true
      },
      {
        field: 'hasBankAccount',
        label: 'Has Bank Account',
        labelHindi: 'बैंक खाता है',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    schemeId: 'crop-insurance',
    criteria: [
      {
        field: 'cropType',
        label: 'Crop Type',
        labelHindi: 'फसल प्रकार',
        type: 'select',
        required: true,
        options: [
          { value: 'rice', label: 'Rice', labelHindi: 'धान' },
          { value: 'wheat', label: 'Wheat', labelHindi: 'गेहूं' },
          { value: 'cotton', label: 'Cotton', labelHindi: 'कपास' },
          { value: 'sugarcane', label: 'Sugarcane', labelHindi: 'गन्ना' }
        ]
      },
      {
        field: 'landHolding',
        label: 'Land Holding',
        labelHindi: 'भूमि स्वामित्व (हेक्टेयर)',
        type: 'number',
        required: true,
        min: 0.1,
        unit: 'हेक्टेयर'
      },
      {
        field: 'hasLandRecords',
        label: 'Has Land Records',
        labelHindi: 'भूमि रिकॉर्ड है',
        type: 'boolean',
        required: true
      },
      {
        field: 'seasonType',
        label: 'Season',
        labelHindi: 'मौसम',
        type: 'select',
        required: true,
        options: [
          { value: 'kharif', label: 'Kharif', labelHindi: 'खरीफ' },
          { value: 'rabi', label: 'Rabi', labelHindi: 'रबी' }
        ]
      }
    ]
  },
  {
    schemeId: 'soil-health-card',
    criteria: [
      {
        field: 'landHolding',
        label: 'Land Holding',
        labelHindi: 'भूमि स्वामित्व (हेक्टेयर)',
        type: 'number',
        required: true,
        min: 0.1,
        unit: 'हेक्टेयर'
      },
      {
        field: 'farmerCategory',
        label: 'Farmer Category',
        labelHindi: 'किसान श्रेणी',
        type: 'select',
        required: true,
        options: [
          { value: 'individual', label: 'Individual Farmer', labelHindi: 'व्यक्तिगत किसान' },
          { value: 'group', label: 'Farmer Group', labelHindi: 'किसान समूह' }
        ]
      },
      {
        field: 'hasLandRecords',
        label: 'Has Land Records',
        labelHindi: 'भूमि रिकॉर्ड है',
        type: 'boolean',
        required: true
      }
    ]
  }
]

// Utility functions
export const checkEligibility = (schemeId: string, formData: Record<string, string | number | boolean>): EligibilityResult => {
  const criteria = eligibilityCriteria.find(c => c.schemeId === schemeId)
  if (!criteria) {
    return {
      eligible: false,
      score: 0,
      maxScore: 0,
      missingCriteria: ['योजना की जानकारी उपलब्ध नहीं'],
      recommendations: ['Please check the scheme details'],
      recommendationsHindi: ['कृपया योजना का विवरण जांचें']
    }
  }

  let score = 0
  const maxScore = criteria.criteria.length
  const missingCriteria: string[] = []
  const recommendations: string[] = []
  const recommendationsHindi: string[] = []

  criteria.criteria.forEach(criterion => {
    const value = formData[criterion.field]
    
    if (criterion.required && (!value || value === '')) {
      missingCriteria.push(criterion.labelHindi)
      return
    }

    switch (criterion.type) {
      case 'number':
        const numValue = typeof value === 'string' ? parseFloat(value) : typeof value === 'number' ? value : 0
        if (criterion.min && numValue < criterion.min) {
          missingCriteria.push(`${criterion.labelHindi} कम से कम ${criterion.min} ${criterion.unit || ''} होना चाहिए`)
          return
        }
        if (criterion.max && numValue > criterion.max) {
          missingCriteria.push(`${criterion.labelHindi} अधिकतम ${criterion.max} ${criterion.unit || ''} होना चाहिए`)
          return
        }
        break
      
      case 'boolean':
        const boolValue = typeof value === 'boolean' ? value : value === 'true'
        if (!boolValue) {
          missingCriteria.push(criterion.labelHindi)
          return
        }
        break
    }
    
    score++
  })

  const eligible = score === maxScore && missingCriteria.length === 0

  if (!eligible) {
    recommendations.push(
      'Please ensure you meet all the eligibility criteria',
      'Contact the nearest agriculture office for assistance'
    )
    recommendationsHindi.push(
      'कृपया सुनिश्चित करें कि आप सभी पात्रता मानदंडों को पूरा करते हैं',
      'सहायता के लिए निकटतम कृषि कार्यालय से संपर्क करें'
    )
  } else {
    recommendations.push(
      'You are eligible for this scheme',
      'Proceed with the application process'
    )
    recommendationsHindi.push(
      'आप इस योजना के लिए पात्र हैं',
      'आवेदन प्रक्रिया के साथ आगे बढ़ें'
    )
  }

  return {
    eligible,
    score,
    maxScore,
    missingCriteria,
    recommendations,
    recommendationsHindi
  }
}

export const getApplicationById = (applicationNumber: string): ApplicationStatus | undefined => {
  return mockApplications.find(app => app.applicationNumber === applicationNumber)
}

export const getApplicationsByScheme = (schemeId: string): ApplicationStatus[] => {
  return mockApplications.filter(app => app.schemeId === schemeId)
}

export const getStatusColor = (status: ApplicationStatus['status']): string => {
  switch (status) {
    case 'approved':
      return 'text-green-600 bg-green-50'
    case 'rejected':
      return 'text-red-600 bg-red-50'
    case 'under-review':
      return 'text-yellow-600 bg-yellow-50'
    case 'documents-required':
      return 'text-orange-600 bg-orange-50'
    case 'submitted':
      return 'text-blue-600 bg-blue-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export const getStatusText = (status: ApplicationStatus['status']): string => {
  switch (status) {
    case 'approved':
      return 'स्वीकृत'
    case 'rejected':
      return 'अस्वीकृत'
    case 'under-review':
      return 'समीक्षाधीन'
    case 'documents-required':
      return 'दस्तावेज आवश्यक'
    case 'submitted':
      return 'जमा किया गया'
    default:
      return 'अज्ञात'
  }
}
