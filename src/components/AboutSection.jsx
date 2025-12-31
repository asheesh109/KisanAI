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
        description: 'AI की मदद से सबसे अच्छी खेती की सलाह'
      },
      {
        icon: '🌦️',
        title: 'मौसम पूर्वानुमान',
        description: 'सटीक 15 दिन का मौसम पूर्वानुमान और कृषि चेतावनी'
      },
      {
        icon: '💰',
        title: 'सरकारी योजनाएं',
        description: 'केंद्र और राज्य सरकार की योजनाओं की जानकारी'
      }
    ],
    mr: [
      {
        icon: '🌾',
        title: 'AI-आधारित सल्ला',
        description: 'AI वापरून सर्वोत्तम शेती सल्ला'
      },
      {
        icon: '🌦️',
        title: 'हवामान अंदाज',
        description: 'अचूक 15 दिवसांचा हवामान अंदाज आणि कृषी चेतावणी'
      },
      {
        icon: '💰',
        title: 'सरकारी योजना',
        description: 'केंद्रीय आणि राज्य योजनांची माहिती'
      }
    ],
    gu: [
      {
        icon: '🌾',
        title: 'AI-આધારિત સલાહ',
        description: 'AI નો ઉપયોગ કરીને શ્રેષ્ઠ ખેતી સલાહ'
      },
      {
        icon: '🌦️',
        title: 'હવામાન પૂર્વાનુમાન',
        description: 'ચોક્કસ 15 દિવસનું હવામાન પૂર્વાનુમાન અને કૃષિ ચેતવણી'
      },
      {
        icon: '💰',
        title: 'સરકારી યોજનાઓ',
        description: 'કેન્દ્ર અને રાજ્ય સરકારની યોજનાઓની માહિતી'
      }
    ],
    ml: [
      {
        icon: '🌾',
        title: 'AI ഉപദേശം',
        description: 'AI ഉപയോഗിച്ച് മികച്ച കൃഷി ഉപദേശം'
      },
      {
        icon: '🌦️',
        title: 'കാലാവസ്ഥാ പ്രവചനം',
        description: 'കൃത്യമായ 15 ദിവസത്തെ കാലാവസ്ഥാ പ്രവചനവും അലേർട്ടുകളും'
      },
      {
        icon: '💰',
        title: 'സർക്കാർ പദ്ധതികൾ',
        description: 'കേന്ദ്ര-സംസ്ഥാന സർക്കാർ പദ്ധതികളുടെ വിവരങ്ങൾ'
      }
    ]
  };

  const aboutContent = {
    en: {
      title: 'About KisanAI',
      description: 'KisanAI uses AI and ML to provide farming improvements, weather info, market prices, and government scheme information for Indian farmers.'
    },
    hi: {
      title: 'KisanAI के बारे में',
      description: 'KisanAI भारतीय किसानों के लिए AI और ML से खेती सुधार, मौसम जानकारी, बाजार भाव और सरकारी योजनाओं की जानकारी देता है।'
    },
    mr: {
      title: 'किसानAI बद्दल',
      description: 'किसानAI AI आणि ML वापरून भारतीय शेतकऱ्यांसाठी शेती सुधारणा, हवामान माहिती, बाजारभाव आणि सरकारी योजना माहिती देतो.'
    },
    gu: {
      title: 'કિસાનAI વિશે',
      description: 'કિસાનAI AI અને ML નો ઉપયોગ કરીને ભારતીય ખેડૂતો માટે ખેતી સુધારણા, હવામાન માહિતી, બજાર ભાવ અને સરકારી યોજનાઓની માહિતી આપે છે.'
    },
    ml: {
      title: 'കിസാൻഎഐയെക്കുറിച്ച്',
      description: 'കിസാൻഎഐ AI, ML ഉപയോഗിച്ച് ഇന്ത്യൻ കർഷകർക്ക് കൃഷി മെച്ചപ്പെടുത്തൽ, കാലാവസ്ഥാ വിവരങ്ങൾ, വിപണി വിലകൾ, സർക്കാർ പദ്ധതി വിവരങ്ങൾ നൽകുന്നു.'
    }
  };

  const currentFeatures = features[language] || features.en;
  const currentAbout = aboutContent[language] || aboutContent.en;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 px-2 text-foreground dark:bg-gradient-to-r dark:from-primary dark:via-accent dark:to-primary dark:bg-clip-text dark:text-transparent animate-fade-in break-words">
            {currentAbout.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-fade-in-delayed px-2 break-words">
            {currentAbout.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 md:gap-8">
          {currentFeatures.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-5 sm:p-7 md:p-8 rounded-xl sm:rounded-2xl bg-card shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-border animate-card-appear min-h-[280px] sm:min-h-[320px] flex flex-col items-center justify-center"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-lg group-hover:rotate-12 transition-all duration-500 flex-shrink-0">
                <span className="text-2xl sm:text-4xl md:text-5xl animate-icon-bounce">{feature.icon}</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors break-words px-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed animate-fade-in-delayed break-words px-2 flex-grow">
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