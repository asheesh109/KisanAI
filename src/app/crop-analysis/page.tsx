'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera, Upload, Image as ImageIcon, CheckCircle, AlertTriangle, Leaf, Bug, Droplets, Sun, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface AnalysisResult {
  condition: 'healthy' | 'disease' | 'pest' | 'nutrient-deficiency'
  confidence: number
  disease?: string
  recommendations: string[]
  severity: 'low' | 'medium' | 'high'
}

export default function CropAnalysis() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock AI analysis function
  const analyzeImage = useCallback(async (): Promise<AnalysisResult> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock analysis results - in real implementation, this would call an AI service
    const mockResults: AnalysisResult[] = [
      {
        condition: 'healthy',
        confidence: 95,
        recommendations: [
          'फसल स्वस्थ दिख रही है',
          'नियमित पानी देते रहें',
          'मिट्टी की नमी बनाए रखें'
        ],
        severity: 'low'
      },
      {
        condition: 'disease',
        confidence: 88,
        disease: 'पत्ती का धब्बा रोग',
        recommendations: [
          'फंगीसाइड का छिड़काव करें',
          'पानी की मात्रा कम करें',
          'संक्रमित पत्तियों को हटाएं'
        ],
        severity: 'medium'
      },
      {
        condition: 'pest',
        confidence: 92,
        disease: 'कीट संक्रमण',
        recommendations: [
          'नीम तेल का छिड़काव करें',
          'जैविक कीटनाशक का उपयोग करें',
          'नियमित निगरानी रखें'
        ],
        severity: 'high'
      }
    ]
    
    return mockResults[Math.floor(Math.random() * mockResults.length)]
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setAnalysisResult(null)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [handleFileSelect])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleAnalyzeClick = async () => {
    if (!selectedImage) return
    
    setIsAnalyzing(true)
    try {
      const result = await analyzeImage()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setAnalysisResult(null)
    setIsAnalyzing(false)
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'healthy': return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'disease': return <AlertTriangle className="h-6 w-6 text-red-600" />
      case 'pest': return <Bug className="h-6 w-6 text-orange-600" />
      case 'nutrient-deficiency': return <Droplets className="h-6 w-6 text-yellow-600" />
      default: return <Leaf className="h-6 w-6 text-gray-600" />
    }
  }

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'healthy': return 'स्वस्थ फसल'
      case 'disease': return 'रोग की पहचान'
      case 'pest': return 'कीट संक्रमण'
      case 'nutrient-deficiency': return 'पोषक तत्वों की कमी'
      default: return 'अज्ञात स्थिति'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            फसल विश्लेषण
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            अपनी फसल की फोटो अपलोड करें और AI से स्वास्थ्य जांच कराएं
          </p>
        </div>

        {!selectedImage ? (
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">फसल की फोटो अपलोड करें</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-12 transition-colors ${
                  dragActive 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4 font-medium">
                  यहाँ अपनी फसल की फोटो खींचें या अपलोड करें
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  JPG, PNG या WebP फॉर्मेट में फोटो अपलोड करें (अधिकतम 10MB)
                </p>
                <div className="space-x-4">
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    फाइल अपलोड करें
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Image Preview and Analysis */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl text-slate-800">फोटो विश्लेषण</CardTitle>
                <Button variant="outline" size="sm" onClick={resetAnalysis}>
                  <X className="h-4 w-4 mr-2" />
                  नई फोटो
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image Preview */}
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={selectedImage} 
                        alt="Selected crop" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    {!analysisResult && !isAnalyzing && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleAnalyzeClick}
                      >
                        <Leaf className="mr-2 h-5 w-5" />
                        विश्लेषण शुरू करें
                      </Button>
                    )}
                  </div>

                  {/* Analysis Results */}
                  <div className="space-y-4">
                    {isAnalyzing ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">AI विश्लेषण जारी है...</p>
                        <p className="text-sm text-slate-500">कृपया प्रतीक्षा करें</p>
                      </div>
                    ) : analysisResult ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          {getConditionIcon(analysisResult.condition)}
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                              {getConditionText(analysisResult.condition)}
                            </h3>
                            <p className="text-sm text-slate-600">
                              विश्वसनीयता: {analysisResult.confidence}%
                            </p>
                          </div>
                        </div>

                        {analysisResult.disease && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-medium text-red-800 mb-2">पहचाना गया रोग:</h4>
                            <p className="text-red-700">{analysisResult.disease}</p>
                          </div>
                        )}

                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(analysisResult.severity)}`}>
                          गंभीरता: {analysisResult.severity === 'low' ? 'कम' : analysisResult.severity === 'medium' ? 'मध्यम' : 'अधिक'}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-800 mb-3">सुझाव:</h4>
                          <ul className="space-y-2">
                            {analysisResult.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start text-blue-700">
                                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={resetAnalysis}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          नया विश्लेषण करें
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>विश्लेषण के लिए &apos;विश्लेषण शुरू करें&apos; बटन दबाएं</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <ImageIcon className="mr-2 h-5 w-5" />
                फोटो की गुणवत्ता
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  स्पष्ट और साफ फोटो
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  अच्छी रोशनी में
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  पास से खींची गई
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Leaf className="mr-2 h-5 w-5" />
                विश्लेषण सुविधाएं
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  रोग की पहचान
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  कीट संक्रमण जांच
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  पोषक तत्व विश्लेषण
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Sun className="mr-2 h-5 w-5" />
                बेहतर परिणाम के लिए
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  दिन के समय फोटो लें
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  समस्या वाले हिस्से पर फोकस
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  कई कोणों से फोटो
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
