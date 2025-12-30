'use client';

import HeroBanner from "@/components/HeroBanner";
import FeatureCards from "@/components/FeatureCards";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { language } = useLanguage();

  const aboutContent = {
    en: {
      title: 'About KisanAI',
      description: 'KisanAI is a comprehensive digital platform for Indian farmers that uses AI and ML technology to provide farming improvements, weather information, market prices, and government scheme information.'
    },
    hi: {
      title: 'KisanAI के बारे में',
      description: 'KisanAI भारतीय किसानों के लिए एक व्यापक डिजिटल प्लेटफॉर्म है जो AI और ML तकनीक का उपयोग करके खेती में सुधार, मौसम की जानकारी, बाजार भाव, और सरकारी योजनाओं की जानकारी प्रदान करता है।'
    },
    mr: {
      title: 'किसानAI बद्दल',
      description: 'किसानAI हा भारतीय शेतकऱ्यांसाठी एक व्यापक डिजिटल प्लॅटफॉर्म आहे जो AI आणि ML तंत्रज्ञानाचा वापर करून शेती सुधारणा, हवामान माहिती, बाजारभाव आणि सरकारी योजनांची माहिती प्रदान करतो.'
    },
    gu: {
      title: 'કિસાનAI વિશે',
      description: 'કિસાનAI ભારતીય ખેડૂતો માટે એક વ્યાપક ડિજિટલ પ્લેટફોર્મ છે જે AI અને ML ટેકનોલોજીનો ઉપયોગ કરીને ખેતી સુધારણા, હવામાન માહિતી, બજાર ભાવ અને સરકારી યોજનાઓની માહિતી પૂરી પાડે છે.'
    },
    ml: {
      title: 'കിസാൻഎഐയെക്കുറിച്ച്',
      description: 'കിസാൻഎഐ ഇന്ത്യൻ കർഷകർക്കായുള്ള ഒരു സമഗ്ര ഡിജിറ്റൽ പ്ലാറ്റ്ഫോമാണ്, ഇത് AI, ML സാങ്കേതികവിദ്യ ഉപയോഗിച്ച് കൃഷി മെച്ചപ്പെടുത്തൽ, കാലാവസ്ഥാ വിവരങ്ങൾ, വിപണി വിലകൾ, സർക്കാർ പദ്ധതി വിവരങ്ങൾ എന്നിവ നൽകുന്നു.'
    }
  };

  const currentAbout = aboutContent[language] || aboutContent.en;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Feature Cards */}
      <FeatureCards />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Additional About Section (if needed) */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {currentAbout.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {currentAbout.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌾</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {language === 'hi' ? 'AI-आधारित सलाह' : 
                 language === 'mr' ? 'AI-आधारित सल्ला' :
                 language === 'gu' ? 'AI-આધારિત સલાહ' :
                 language === 'ml' ? 'AI-അധിഷ്ഠിത ഉപദേശം' : 
                 'AI-Based Advice'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'hi' ? 'आर्टिफिशियल इंटेलिजेंस की मदद से आपको सबसे अच्छी खेती की सलाह मिलती है' :
                 language === 'mr' ? 'कृत्रिम बुद्धिमत्तेचा वापर करून आपल्याला सर्वोत्तम शेती सल्ला मिळतो' :
                 language === 'gu' ? 'કૃત્રિમ બુદ્ધિનો ઉપયોગ કરીને તમને શ્રેષ્ઠ ખેતી સલાહ મળે છે' :
                 language === 'ml' ? 'കൃത്രിമബുദ്ധി ഉപയോഗിച്ച് നിങ്ങൾക്ക് മികച്ച കൃഷി ഉപദേശം ലഭിക്കുന്നു' :
                 'Get the best farming advice with the help of Artificial Intelligence'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌦️</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {language === 'hi' ? 'मौसम पूर्वानुमान' :
                 language === 'mr' ? 'हवामान अंदाज' :
                 language === 'gu' ? 'હવામાન પૂર્વાનુમાન' :
                 language === 'ml' ? 'കാലാവസ്ഥാ പ്രവചനം' :
                 'Weather Forecast'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'hi' ? '15 दिन तक का सटीक मौसम पूर्वानुमान और कृषि संबंधी चेतावनी' :
                 language === 'mr' ? '15 दिवसांचा अचूक हवामान अंदाज आणि कृषी संबंधित चेतावणी' :
                 language === 'gu' ? '15 દિવસનું ચોક્કસ હવામાન પૂર્વાનુમાન અને કૃષિ સંબંધિત ચેતવણી' :
                 language === 'ml' ? '15 ദിവസത്തെ കൃത്യമായ കാലാവസ്ഥാ പ്രവചനവും കാർഷിക അലേർട്ടുകളും' :
                 'Accurate 15-day weather forecast and agricultural alerts'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {language === 'hi' ? 'सरकारी योजनाएं' :
                 language === 'mr' ? 'सरकारी योजना' :
                 language === 'gu' ? 'સરકારી યોજનાઓ' :
                 language === 'ml' ? 'സർക്കാർ പദ്ധതികൾ' :
                 'Government Schemes'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'hi' ? 'सभी केंद्रीय और राज्य सरकार की योजनाओं की जानकारी और आवेदन' :
                 language === 'mr' ? 'सर्व केंद्रीय आणि राज्य सरकारच्या योजनांची माहिती आणि अर्ज' :
                 language === 'gu' ? 'બધી કેન્દ્રીય અને રાજ્ય સરકારની યોજનાઓની માહિતી અને અરજી' :
                 language === 'ml' ? 'എല്ലാ കേന്ദ്ര-സംസ്ഥാന സർക്കാർ പദ്ധതികളുടെ വിവരങ്ങളും അപേക്ഷയും' :
                 'Information and application for all central and state government schemes'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}