'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutSection() {
  const { language, t } = useLanguage();

  const features = {
    en: [
      {
        icon: '🌾',
        title: 'AI-Based Advice',
        description: 'Best farming advice using artificial intelligence'
      },
      {
        icon: '🌦️',
        title: 'Weather Forecast',
        description: 'Accurate 15-day weather forecast and agricultural alerts'
      },
      {
        icon: '💰',
        title: 'Government Schemes',
        description: 'Information about all central and state government schemes'
      }
    ],
    hi: [
      {
        icon: '🌾',
        title: 'AI-आधारित सलाह',
        description: 'आर्टिफिशियल इंटेलिजेंस की मदद से सबसे अच्छी खेती की सलाह'
      },
      {
        icon: '🌦️',
        title: 'मौसम पूर्वानुमान',
        description: 'सटीक 15 दिन का मौसम पूर्वानुमान और कृषि संबंधी चेतावनी'
      },
      {
        icon: '💰',
        title: 'सरकारी योजनाएं',
        description: 'सभी केंद्रीय और राज्य सरकार की योजनाओं की जानकारी'
      }
    ],
    mr: [
      {
        icon: '🌾',
        title: 'AI-आधारित सल्ला',
        description: 'कृत्रिम बुद्धिमत्तेचा वापर करून सर्वोत्तम शेती सल्ला'
      },
      {
        icon: '🌦️',
        title: 'हवामान अंदाज',
        description: 'अचूक 15 दिवसांचा हवामान अंदाज आणि कृषी संबंधित चेतावणी'
      },
      {
        icon: '💰',
        title: 'सरकारी योजना',
        description: 'सर्व केंद्रीय आणि राज्य सरकारच्या योजनांची माहिती'
      }
    ],
    gu: [
      {
        icon: '🌾',
        title: 'AI-આધારિત સલાહ',
        description: 'કૃત્રિમ બુદ્ધિનો ઉપયોગ કરીને શ્રેષ્ઠ ખેતી સલાહ'
      },
      {
        icon: '🌦️',
        title: 'હવામાન પૂર્વાનુમાન',
        description: 'ચોક્કસ 15 દિવસનું હવામાન પૂર્વાનુમાન અને કૃષિ સંબંધિત ચેતવણી'
      },
      {
        icon: '💰',
        title: 'સરકારી યોજનાઓ',
        description: 'બધી કેન્દ્રીય અને રાજ્ય સરકારની યોજનાઓની માહિતી'
      }
    ],
    ml: [
      {
        icon: '🌾',
        title: 'AI-അധിഷ്ഠിത ഉപദേശം',
        description: 'കൃത്രിമബുദ്ധി ഉപയോഗിച്ച് മികച്ച കൃഷി ഉപദേശം'
      },
      {
        icon: '🌦️',
        title: 'കാലാവസ്ഥാ പ്രവചനം',
        description: 'കൃത്യമായ 15 ദിവസത്തെ കാലാവസ്ഥാ പ്രവചനവും കാർഷിക അലേർട്ടുകളും'
      },
      {
        icon: '💰',
        title: 'സർക്കാർ പദ്ധതികൾ',
        description: 'എല്ലാ കേന്ദ്ര-സംസ്ഥാന സർക്കാർ പദ്ധതികളെക്കുറിച്ചുള്ള വിവരങ്ങൾ'
      }
    ]
  };

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

  const currentFeatures = features[language] || features.en;
  const currentAbout = aboutContent[language] || aboutContent.en;

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            {currentAbout.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-fade-in-delayed">
            {currentAbout.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {currentFeatures.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 sm:p-8 rounded-2xl bg-card shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-border animate-card-appear"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:rotate-12 transition-all duration-500">
                <span className="text-3xl sm:text-5xl animate-icon-bounce">{feature.icon}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed animate-fade-in-delayed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        @keyframes fade-in-delayed {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-delayed {
          animation: fade-in-delayed 0.8s ease-out 0.3s both;
        }
        @keyframes card-appear {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-card-appear {
          animation: card-appear 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        @keyframes icon-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-icon-bounce {
          animation: icon-bounce 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}