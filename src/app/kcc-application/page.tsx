import { CreditCard, User, FileText, Building, CheckCircle, Clock, Phone } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const applicationSteps = [
  {
    id: 1,
    title: 'व्यक्तिगत जानकारी',
    description: 'नाम, पता, आधार नंबर और मोबाइल नंबर',
    icon: User,
    status: 'pending',
  },
  {
    id: 2,
    title: 'भूमि विवरण',
    description: 'भूमि के दस्तावेज और खसरा नंबर',
    icon: FileText,
    status: 'pending',
  },
  {
    id: 3,
    title: 'बैंक विवरण',
    description: 'बैंक खाता और शाखा की जानकारी',
    icon: Building,
    status: 'pending',
  },
  {
    id: 4,
    title: 'दस्तावेज अपलोड',
    description: 'आवश्यक दस्तावेजों की स्कैन कॉपी',
    icon: FileText,
    status: 'pending',
  },
]

const requiredDocuments = [
  'आधार कार्ड',
  'भूमि के कागजात (खसरा/खतौनी)',
  'पासपोर्ट साइज फोटो',
  'बैंक पासबुक',
  'आय प्रमाण पत्र',
  'निवास प्रमाण पत्र',
  'जाति प्रमाण पत्र (यदि लागू हो)',
]

const eligibilityCriteria = [
  'भारतीय नागरिक होना आवश्यक',
  'कृषि भूमि का मालिक या काश्तकार',
  '18-75 वर्ष की आयु',
  'पहले से KCC न हो',
  'बैंक में खाता होना आवश्यक',
]

const loanBenefits = [
  {
    title: 'कम ब्याज दर',
    description: '7% तक वार्षिक ब्याज दर',
  },
  {
    title: 'सब्सिडी',
    description: '2% ब्याज सब्सिडी उपलब्ध',
  },
  {
    title: 'आसान भुगतान',
    description: 'फसल के अनुसार भुगतान की सुविधा',
  },
  {
    title: 'बीमा कवर',
    description: 'व्यक्तिगत दुर्घटना बीमा',
  },
]

export default function KCCApplication() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            किसान क्रेडिट कार्ड आवेदन
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            आसान तरीके से KCC के लिए ऑनलाइन आवेदन करें
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {loanBenefits.map((benefit, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-600 font-medium">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  नया आवेदन शुरू करें
                </CardTitle>
                <CardDescription>
                  नीचे दिए गए चरणों का पालन करके अपना KCC आवेदन पूरा करें
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationSteps.map((step) => {
                    const IconComponent = step.icon
                    return (
                      <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{step.title}</h4>
                          <p className="text-sm text-slate-600 font-medium">{step.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    )
                  })}
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-6">
                    आवेदन शुरू करें
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status Check */}
            <Card>
              <CardHeader>
                <CardTitle>आवेदन की स्थिति जांचें</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="आवेदन संख्या दर्ज करें"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Button variant="outline" className="w-full">
                    स्थिति देखें
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  पात्रता मापदंड
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {eligibilityCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      <span className="text-gray-700">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  आवश्यक दस्तावेज
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requiredDocuments.map((document, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      <span className="text-gray-700">{document}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5" />
                  सहायता केंद्र
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">किसान हेल्पलाइन</h4>
                    <p className="text-sm text-slate-600 font-medium">टोल फ्री: 1800-180-1551</p>
                    <p className="text-sm text-slate-600 font-medium">समय: सुबह 6 बजे से रात 10 बजे तक</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">ईमेल सहायता</h4>
                    <p className="text-sm text-slate-600 font-medium">kcc-support@kisanai.gov.in</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    FAQ देखें
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            KCC आवेदन की पूरी प्रक्रिया 7-14 दिन में पूरी होती है। 
            अधिक जानकारी के लिए अपने नजदीकी बैंक शाखा से संपर्क करें।
          </p>
        </div>
      </div>
    </div>
  )
}
