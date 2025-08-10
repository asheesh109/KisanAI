import { TrendingUp, TrendingDown, MapPin, Search, Filter } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock market data - in real implementation, this would come from APMC APIs
const marketPrices = [
  {
    crop: 'गेहूं',
    price: 2150,
    change: '+50',
    changePercent: '+2.4%',
    market: 'दिल्ली मंडी',
    unit: 'प्रति क्विंटल',
    trending: 'up',
  },
  {
    crop: 'चावल',
    price: 3200,
    change: '-80',
    changePercent: '-2.4%',
    market: 'दिल्ली मंडी',
    unit: 'प्रति क्विंटल',
    trending: 'down',
  },
  {
    crop: 'सोयाबीन',
    price: 4500,
    change: '+120',
    changePercent: '+2.7%',
    market: 'इंदौर मंडी',
    unit: 'प्रति क्विंटल',
    trending: 'up',
  },
  {
    crop: 'कपास',
    price: 5800,
    change: '+200',
    changePercent: '+3.6%',
    market: 'राजकोट मंडी',
    unit: 'प्रति क्विंटल',
    trending: 'up',
  },
  {
    crop: 'मक्का',
    price: 1850,
    change: '-30',
    changePercent: '-1.6%',
    market: 'करनाल मंडी',
    unit: 'प्रति क्विंटल',
    trending: 'down',
  },
  {
    crop: 'प्याज',
    price: 3500,
    change: '+300',
    changePercent: '+9.4%',
    market: 'नासिक मंडी',
    unit: 'प्रति क्विंटल',
    trending: 'up',
  },
]

const nearbyMarkets = [
  { name: 'दिल्ली मंडी', distance: '5 km', crops: 25 },
  { name: 'गुड़गांव मंडी', distance: '28 km', crops: 18 },
  { name: 'सोनीपत मंडी', distance: '45 km', crops: 22 },
  { name: 'करनाल मंडी', distance: '78 km', crops: 30 },
]

const priceAlerts = [
  {
    crop: 'गेहूं',
    targetPrice: 2200,
    currentPrice: 2150,
    status: 'नीचे',
  },
  {
    crop: 'सोयाबीन',
    targetPrice: 4300,
    currentPrice: 4500,
    status: 'ऊपर',
  },
]

export default function MarketPrices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold !text-slate-900 mb-4">
            बाजार भाव
          </h1>
          <p className="text-xl !text-slate-700 font-medium">
            आज के ताजे मंडी भाव और मूल्य रुझान की जानकारी
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="फसल का नाम खोजें..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent !text-slate-900 placeholder-gray-500"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>फिल्टर</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>मंडी चुनें</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Prices */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="!text-slate-900 font-bold">आज के मंडी भाव</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketPrices.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg !text-slate-900">{item.crop}</h3>
                      <p className="text-sm !text-slate-600 font-medium">{item.market}</p>
                    </div>
                    <div className={`flex items-center space-x-1 ${
                      item.trending === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.trending === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">{item.changePercent}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold !text-slate-900">₹{item.price}</p>
                      <p className="text-sm !text-slate-600 font-medium">{item.unit}</p>
                    </div>
                    <div className={`text-sm font-medium ${
                      item.trending === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Nearby Markets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center !text-slate-900 font-bold">
                <MapPin className="mr-2 h-5 w-5" />
                नजदीकी मंडियां
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nearbyMarkets.map((market, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-slate-900">{market.name}</h4>
                      <p className="text-sm text-slate-600 font-medium">{market.crops} फसलों के भाव</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{market.distance}</p>
                      <Button size="sm" variant="outline" className="mt-1">
                        देखें
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="!text-slate-900 font-bold">मूल्य अलर्ट</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priceAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.status === 'ऊपर'
                        ? 'bg-green-50 border-green-400'
                        : 'bg-red-50 border-red-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-slate-900">{alert.crop}</h4>
                        <p className="text-sm text-slate-600 font-medium">
                          लक्ष्य: ₹{alert.targetPrice} | वर्तमान: ₹{alert.currentPrice}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          alert.status === 'ऊपर'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </div>
                  </div>
                ))}
                <Button className="w-full bg-orange-600 hover:bg-orange-700 font-semibold">
                  नया अलर्ट सेट करें
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-600 font-medium">
            भाव की जानकारी APMC डेटा पर आधारित है। 
            बिक्री से पहले स्थानीय मंडी से भाव की पुष्टि करें।
          </p>
        </div>
      </div>
    </div>
  )
}
