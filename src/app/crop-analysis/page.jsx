'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera, Upload, FileImage as ImageIcon, CheckCircle, AlertTriangle, Leaf, Bug, Droplets, Sun, X, RotateCcw } from 'lucide-react'

export default function CropAnalysis() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  // Mock data fallback
  const getMockAnalysisResult = useCallback(() => {
    const mockResults = [
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

  // Analyze image with Gemini API
  const analyzeImage = useCallback(async (imageBase64) => {
    if (!imageBase64) return null
    
    setIsAnalyzing(true)
    setError(null)
    
    try {
      // Remove the data URL prefix to get just the base64 string
      const base64Image = imageBase64.split(',')[1]
      
      const prompt = `
        You are an agricultural AI assistant. Analyze this crop/plant image and provide a detailed assessment.
        
        Please analyze the image for:
        1. Overall plant health condition
        2. Any visible diseases or problems
        3. Pest damage if present
        4. Nutrient deficiency signs
        5. Recommendations for treatment
        
        Provide your response in this exact JSON format:
        {
          "condition": "healthy|disease|pest|nutrient-deficiency",
          "confidence": 85,
          "disease": "specific disease/pest/problem name in Hindi - ALWAYS provide this field even for healthy plants",
          "severity": "low|medium|high",
          "recommendations": ["recommendation 1 in Hindi", "recommendation 2 in Hindi", "recommendation 3 in Hindi"]
        }
        
        IMPORTANT REQUIREMENTS:
        - Use only the four condition types: healthy, disease, pest, nutrient-deficiency
        - Provide confidence as a number between 1-100
        - ALWAYS fill the "disease" field in Hindi:
          * If healthy: write "स्वस्थ पौधा" or specific crop name like "स्वस्थ टमाटर का पौधा"
          * If disease: write specific disease name like "पत्ती का धब्बा रोग", "झुलसा रोग", "सड़न रोग" etc.
          * If pest: write specific pest name like "एफिड कीट", "सफेद मक्खी", "कैटरपिलर" etc.
          * If nutrient deficiency: write "नाइट्रोजन की कमी", "आयरन की कमी", "पोटाश की कमी" etc.
        - Rate severity as low, medium, or high
        - Give 3 practical recommendations in Hindi
        - Never leave the "disease" field empty or null
      `

      // Use the correct Gemini endpoint and API key format
      const GEMINI_API_KEY = 'AIzaSyCvmzv8kQpkZACq3YdvUzCXw0XmhUkHcxc' // Your API key
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { 
                inline_data: { 
                  mime_type: "image/jpeg", 
                  data: base64Image 
                } 
              }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1000,
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `API Error: ${response.status}`)
      }

      const data = await response.json()
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      
      if (!textResponse) {
        throw new Error('No response text received from Gemini API')
      }

      // Extract JSON from response
      const jsonMatch = textResponse.match(/\{[\s\S]*?\}/)
      if (!jsonMatch) {
        console.log('Raw response:', textResponse)
        throw new Error('No valid JSON found in response')
      }

      const analysisData = JSON.parse(jsonMatch[0])
      
      // Validate the response structure
      if (!analysisData.condition || !analysisData.confidence || !analysisData.recommendations) {
        throw new Error('Invalid response structure')
      }

      return analysisData

    } catch (error) {
      console.error('Gemini API Error:', error)
      setError(`Analysis failed: ${error.message}. Using sample data instead.`)
      
      // Return mock data as fallback
      return getMockAnalysisResult()
    } finally {
      setIsAnalyzing(false)
    }
  }, [getMockAnalysisResult])

  const handleFileSelect = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      // Check file size (limit to 4MB for better API compatibility)
      if (file.size > 4 * 1024 * 1024) {
        setError('File size should be less than 4MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result)
        setAnalysisResult(null)
        setError(null)
      }
      reader.onerror = () => {
        setError('Failed to read file')
      }
      reader.readAsDataURL(file)
    } else {
      setError('Please select a valid image file')
    }
  }, [])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [handleFileSelect])

  const handleFileInputChange = (e) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleAnalyzeClick = useCallback(async () => {
    if (!selectedImage) return
    const result = await analyzeImage(selectedImage)
    if (result) {
      setAnalysisResult(result)
    }
  }, [selectedImage, analyzeImage])

  const resetAnalysis = () => {
    setSelectedImage(null)
    setAnalysisResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getConditionIcon = (condition) => {
    switch (condition) {
      case 'healthy': return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'disease': return <AlertTriangle className="h-6 w-6 text-red-600" />
      case 'pest': return <Bug className="h-6 w-6 text-orange-600" />
      case 'nutrient-deficiency': return <Droplets className="h-6 w-6 text-yellow-600" />
      default: return <Leaf className="h-6 w-6 text-gray-600" />
    }
  }

  const getConditionText = (condition) => {
    switch (condition) {
      case 'healthy': return 'स्वस्थ फसल'
      case 'disease': return 'रोग की पहचान'
      case 'pest': return 'कीट संक्रमण'
      case 'nutrient-deficiency': return 'पोषक तत्वों की कमी'
      default: return 'अज्ञात स्थिति'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'low': return 'कम'
      case 'medium': return 'मध्यम'
      case 'high': return 'अधिक'
      default: return 'अज्ञात'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">फसल विश्लेषण</h1>
          <p className="text-xl text-slate-600 font-medium">
            अपनी फसल की फोटो अपलोड करें और AI से स्वास्थ्य जांच कराएं
          </p>
        </div>

        {!selectedImage ? (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-slate-800">फसल की फोटो अपलोड करें</h2>
              </div>
              <div className="p-6 text-center space-y-6">
                <div 
                  className={`border-2 border-dashed rounded-lg p-12 transition-colors cursor-pointer ${
                    dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4 font-medium">
                    यहाँ अपनी फसल की फोटो खींचें या अपलोड करें
                  </p>
                  <p className="text-sm text-slate-500 mb-6">
                    JPG, PNG या WebP फॉर्मेट में फोटो अपलोड करें (अधिकतम 4MB)
                  </p>
                  <button 
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    फाइल अपलोड करें
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-row items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-slate-800">फोटो विश्लेषण</h2>
                <button 
                  onClick={resetAnalysis}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  नई फोटो
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={selectedImage} 
                        alt="Selected crop" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    {!analysisResult && !isAnalyzing && (
                      <button 
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        onClick={handleAnalyzeClick}
                      >
                        <Leaf className="mr-2 h-5 w-5" />
                        विश्लेषण शुरू करें
                      </button>
                    )}
                  </div>

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
                          गंभीरता: {getSeverityText(analysisResult.severity)}
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

                        <button 
                          onClick={resetAnalysis}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          नया विश्लेषण करें
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>विश्लेषण के लिए 'विश्लेषण शुरू करें' बटन दबाएं</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="flex items-center text-slate-800 font-semibold">
                <ImageIcon className="mr-2 h-5 w-5" />
                फोटो की गुणवत्ता
              </h3>
            </div>
            <div className="p-6">
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="flex items-center text-slate-800 font-semibold">
                <Leaf className="mr-2 h-5 w-5" />
                विश्लेषण सुविधाएं
              </h3>
            </div>
            <div className="p-6">
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="flex items-center text-slate-800 font-semibold">
                <Sun className="mr-2 h-5 w-5" />
                बेहतर परिणाम के लिए
              </h3>
            </div>
            <div className="p-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}