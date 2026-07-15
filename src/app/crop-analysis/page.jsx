'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Camera,
  Upload,
  FileImage as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Leaf,
  Bug,
  Droplets,
  Sun,
  X,
  RotateCcw,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import DiseaseDetails from '@/components/CropAnalysis/DiseaseDetails'
import {
  buildCropAnalysisPrompt,
  parseCropAnalysisResponse,
} from '@/lib/crop-analysis/analysis'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })


export default function CropAnalysis() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const { language, t } = useLanguage()

  // Convert file to base64
  const fileToGenerativePart = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve({
          inlineData: {
            data: reader.result.split(',')[1],
            mimeType: file.type
          }
        })
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [])

  // Analyze image with Gemini 3.5 Flash
  const analyzeImage = useCallback(async (imageFile) => {
    if (!imageFile) {
      return null
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured')
      }

      const imagePart = await fileToGenerativePart(imageFile)
      const prompt = buildCropAnalysisPrompt(language)

      const result = await model.generateContent([
        prompt,
        imagePart,
      ])

      const response = await result.response
      const textResponse = response.text()

      if (!textResponse?.trim()) {
        throw new Error('Gemini returned an empty response')
      }

      return parseCropAnalysisResponse(textResponse)
    } catch (analysisError) {
      console.error('Crop analysis failed:', analysisError)
      setError(t('cropAnalysisFailed'))
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }, [fileToGenerativePart, language, t])

  const handleFileSelect = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      // Check file size (limit to 4MB for better API compatibility)
      if (file.size > 4 * 1024 * 1024) {
        setError(t('fileSizeError'))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage({
          url: e.target?.result,
          file: file
        })
        setAnalysisResult(null)
        setError(null)
      }
      reader.onerror = () => {
        setError(t('fileReadError'))
      }
      reader.readAsDataURL(file)
    } else {
      setError(t('invalidFileError'))
    }
  }, [t])

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
    if (!selectedImage?.file) return
    const result = await analyzeImage(selectedImage.file)
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
      case 'healthy': return <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
      case 'disease': return <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0" />
      case 'pest': return <Bug className="h-6 w-6 text-accent flex-shrink-0" />
      case 'nutrient-deficiency': return <Droplets className="h-6 w-6 text-primary flex-shrink-0" />
      default: return <Leaf className="h-6 w-6 text-muted-foreground flex-shrink-0" />
    }
  }

  const getConditionText = (condition) => {
    const conditions = {
      en: {
        'healthy': 'Healthy Crop',
        'disease': 'Disease Detected',
        'pest': 'Pest Infection',
        'nutrient-deficiency': 'Nutrient Deficiency',
        'default': 'Unknown Condition'
      },
      hi: {
        'healthy': 'स्वस्थ फसल',
        'disease': 'रोग की पहचान',
        'pest': 'कीट संक्रमण',
        'nutrient-deficiency': 'पोषक तत्वों की कमी',
        'default': 'अज्ञात स्थिति'
      },
      mr: {
        'healthy': 'निरोगी पीक',
        'disease': 'रोग ओळखला',
        'pest': 'कीट संसर्ग',
        'nutrient-deficiency': 'पोषक तत्वांची कमतरता',
        'default': 'अज्ञात स्थिती'
      },
      gu: {
        'healthy': 'સ્વસ્થ પાક',
        'disease': 'રોગ શોધાયો',
        'pest': 'કીટ સંક્રમણ',
        'nutrient-deficiency': 'પોષક તત્વની અભાવ',
        'default': 'અજ્ઞાત સ્થિતિ'
      },
      ml: {
        'healthy': 'ആരോഗ്യകരമായ വിള',
        'disease': 'രോഗം കണ്ടെത്തി',
        'pest': 'കീട അണുബാധ',
        'nutrient-deficiency': 'പോഷകാഹാരക്കുറവ്',
        'default': 'അജ്ഞാത നില'
      }
    }
    
    const langConditions = conditions[language] || conditions.en
    return langConditions[condition] || langConditions.default
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'text-primary bg-primary/10 dark:bg-primary/20'
      case 'medium': return 'text-accent bg-accent/10 dark:bg-accent/20'
      case 'high': return 'text-destructive bg-destructive/10 dark:bg-destructive/20'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  const getSeverityText = (severity) => {
    const severities = {
      en: {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'default': 'Unknown'
      },
      hi: {
        'low': 'कम',
        'medium': 'मध्यम',
        'high': 'अधिक',
        'default': 'अज्ञात'
      },
      mr: {
        'low': 'कमी',
        'medium': 'मध्यम',
        'high': 'उच्च',
        'default': 'अज्ञात'
      },
      gu: {
        'low': 'ઓછું',
        'medium': 'મધ્યમ',
        'high': 'ઉચ્ચ',
        'default': 'અજ્ઞાત'
      },
      ml: {
        'low': 'കുറവ്',
        'medium': 'മീഡിയം',
        'high': 'ഉയർന്ന',
        'default': 'അജ്ഞാതം'
      }
    }
    
    const langSeverities = severities[language] || severities.en
    return langSeverities[severity] || langSeverities.default
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2 flex-shrink-0" />
              <p className="text-destructive">{error}</p>
            </div>
          </div>
        )}

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t('cropAnalysis')}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium">
            {t('analyzeCropHealth')}
          </p>
        </div>

        {!selectedImage ? (
          <div className="mb-6 sm:mb-8">
            <div className="bg-card rounded-lg shadow-sm border border-border">
              <div className="text-center p-4 sm:p-6 border-b border-border">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">{t('uploadCropPhoto')}</h2>
              </div>
              <div className="p-4 sm:p-6 text-center space-y-4 sm:space-y-6">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 sm:p-12 transition-colors cursor-pointer ${
                    dragActive 
                      ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                      : 'border-border bg-muted hover:bg-muted/80 dark:hover:bg-muted'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-12 sm:h-16 w-12 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                  <p className="text-foreground font-medium mb-2 sm:mb-4">
                    {t('dragDrop')}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
                    {t('supportedFormats')}
                  </p>
                  <button 
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-accent transition-colors"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {t('uploadFile')}
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
            <div className="bg-card rounded-lg shadow-sm border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-border">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">{t('photoAnalysis')}</h2>
                <button 
                  onClick={resetAnalysis}
                  className="inline-flex items-center px-3 py-2 border border-border rounded-md text-sm font-medium text-foreground bg-card hover:bg-muted transition-colors mt-2 sm:mt-0"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('newPhoto')}
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="border border-border rounded-lg overflow-hidden">
                      <img 
                        src={selectedImage.url} 
                        alt="Selected crop" 
                        className="w-full h-48 sm:h-64 object-cover"
                      />
                    </div>
                    {!analysisResult && !isAnalyzing && (
                      <button 
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-accent transition-colors"
                        onClick={handleAnalyzeClick}
                      >
                        {error ? (
                          <RotateCcw className="mr-2 h-5 w-5" />
                        ) : (
                          <Leaf className="mr-2 h-5 w-5" />
                        )}

                        {error ? t('retryAnalysis') : t('startAnalysis')}
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {isAnalyzing ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-foreground font-medium">{t('analysisInProgress')}</p>
                        <p className="text-sm text-muted-foreground">{t('pleaseWait')}</p>
                      </div>
                    ) : analysisResult ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          {getConditionIcon(analysisResult.condition)}
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {getConditionText(analysisResult.condition)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {t('confidence')}: {analysisResult.confidence}%
                            </p>
                          </div>
                        </div>

                        {analysisResult.disease && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                            <h4 className="font-medium text-destructive mb-2">{t('identifiedDisease')}:</h4>
                            <p className="text-destructive">{analysisResult.disease}</p>
                          </div>
                        )}

                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(analysisResult.severity)}`}>
                          {t('severity')}: {getSeverityText(analysisResult.severity)}
                        </div>

                        <button 
                          onClick={resetAnalysis}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-border rounded-md text-sm font-medium text-foreground bg-card hover:bg-muted transition-colors"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          {t('newAnalysis')}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <ImageIcon className="h-12 sm:h-16 w-12 sm:w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-foreground">
                          {t('clickToStartAnalysis')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {analysisResult && (
                  <div className="mt-6 border-t border-border pt-6">
                    <DiseaseDetails
                      overview={analysisResult.overview}
                      causes={analysisResult.causes}
                      symptoms={analysisResult.symptoms}
                      prevention={analysisResult.prevention}
                      treatmentRecommendations={
                        analysisResult.treatmentRecommendations
                      }
                      labels={{
                        about: t('diseaseAbout'),
                        causes: t('diseaseCauses'),
                        symptoms: t('diseaseSymptoms'),
                        prevention: t('diseasePrevention'),
                        treatment: t('treatmentRecommendations'),
                        unavailable: t('informationUnavailable'),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {/* Photo Quality Card */}
          <div className="bg-card rounded-lg shadow-sm border border-border">
            <div className="p-4 sm:p-6 border-b border-border">
              <h3 className="flex items-center text-foreground font-semibold">
                <ImageIcon className="mr-2 h-5 w-5" />
                {t('photoQuality')}
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  {t('clearPhoto')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  {t('goodLighting')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  {t('closeUp')}
                </li>
              </ul>
            </div>
          </div>

          {/* Analysis Features Card */}
          <div className="bg-card rounded-lg shadow-sm border border-border">
            <div className="p-4 sm:p-6 border-b border-border">
              <h3 className="flex items-center text-foreground font-semibold">
                <Leaf className="mr-2 h-5 w-5" />
                {t('analysisFeatures')}
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  {t('diseaseDetection')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  {t('pestInfectionCheck')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  {t('nutrientAnalysis')}
                </li>
              </ul>
            </div>
          </div>

          {/* Better Results Card */}
          <div className="bg-card rounded-lg shadow-sm border border-border">
            <div className="p-4 sm:p-6 border-b border-border">
              <h3 className="flex items-center text-foreground font-semibold">
                <Sun className="mr-2 h-5 w-5" />
                {t('betterResults')}
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  {t('daytimePhoto')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  {t('focusOnProblem')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  {t('multipleAngles')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}