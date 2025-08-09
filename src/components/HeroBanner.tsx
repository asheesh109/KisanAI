'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { bannerImages } from '@/data/governmentSchemes'

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
  }

  return (
    <div className="relative h-96 overflow-hidden bg-gradient-to-r from-green-700 to-green-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/><circle cx=\"80\" cy=\"40\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/><circle cx=\"40\" cy=\"60\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/><circle cx=\"60\" cy=\"80\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')"
        }}
      ></div>

      {/* Slider Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center relative">
          {/* Semi-transparent background for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-25 rounded-xl backdrop-blur-sm"></div>
          
          <div className="relative z-10 py-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.9), 1px 1px 3px rgba(0,0,0,0.8), 0px 0px 10px rgba(0,0,0,0.7)'}}>
              {bannerImages[currentSlide].titleHindi}
            </h1>
            <p className="text-xl sm:text-2xl text-white mb-8 max-w-2xl mx-auto font-semibold drop-shadow-xl" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
              {bannerImages[currentSlide].descriptionHindi}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={bannerImages[currentSlide].link}>
                <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                  और जानकारी पाएं
                </Button>
              </Link>
              <Link href="/voice-assistant">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                  आवाज सहायक का उपयोग करें
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
