import Link from 'next/link'
import { 
  Mic, 
  Camera, 
  Brain, 
  Cloud, 
  TrendingUp, 
  FileText, 
  CreditCard 
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const features = [
  {
    title: 'आवाज सहायक',
    description: 'हिंदी में खेती संबंधी सवाल पूछें और तुरंत जवाब पाएं',
    icon: Mic,
    href: '/voice-assistant',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'फसल विश्लेषण',
    description: 'फोटो खींचकर अपनी फसल की स्वास्थ्य जांच करें',
    icon: Camera,
    href: '/crop-analysis',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
  },
  {
    title: 'व्यक्तिगत सलाह',
    description: 'आपके क्षेत्र और मिट्टी के अनुसार खेती की सलाह',
    icon: Brain,
    href: '/advisory',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'मौसम की जानकारी',
    description: '15 दिन तक का मौसम पूर्वानुमान और चेतावनी',
    icon: Cloud,
    href: '/weather',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
  },
  {
    title: 'बाजार भाव',
    description: 'मंडी के ताजे भाव और मूल्य रुझान की जानकारी',
    icon: TrendingUp,
    href: '/market-prices',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'सरकारी योजनाएं',
    description: 'सभी सरकारी योजनाओं की जानकारी और आवेदन',
    icon: FileText,
    href: '/schemes',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
  },
  {
    title: 'KCC आवेदन',
    description: 'किसान क्रेडिट कार्ड के लिए आसान आवेदन',
    icon: CreditCard,
    href: '/kcc-application',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
  },
]

export default function FeatureCards() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            मुख्य सुविधाएं
          </h2>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto font-medium">
            किसानों के लिए विशेष रूप से डिजाइन की गई AI-आधारित सुविधाएं
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-slate-200">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl text-slate-900 font-bold">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href={feature.href}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200 hover:shadow-md">
                      उपयोग करें
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
