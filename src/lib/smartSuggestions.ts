'use client';

import { Task } from '@/hooks/useTasks';

export interface WeatherData {
  temperature: number;
  rainProbability: number;
  humidity?: number;
  condition?: string;
}

export interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

/**
 * Generate smart suggestions based on weather, time, and existing tasks
 */
export function generateSmartSuggestions(
  weather: WeatherData | null,
  existingTasks: Task[],
  language: string = 'en'
): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = existingTasks.filter(t => t.date === today);
  const taskTypes = todaysTasks.map(t => t.type);

  // Weather-based suggestions
  if (weather) {
    // High temperature suggestion
    if (weather.temperature > 35) {
      if (!taskTypes.includes('irrigation')) {
        suggestions.push({
          id: 'sugg_high_temp_irrigation',
          title: 'Schedule Irrigation',
          description: 'Temperature is above 35°C. Early morning or evening irrigation is recommended.',
          type: 'irrigation',
          priority: 'high',
          reason: 'high_temperature',
        });
      }
    }

    // Rain probability suggestion
    if (weather.rainProbability > 60) {
      if (!taskTypes.includes('irrigation')) {
        suggestions.push({
          id: 'sugg_rain_skip_irrigation',
          title: 'Skip Irrigation',
          description: 'Rain probability is above 60%. Consider skipping irrigation today.',
          type: 'irrigation',
          priority: 'high',
          reason: 'high_rainfall',
        });
      }
    } else if (weather.rainProbability < 30 && weather.temperature >= 25 && weather.temperature <= 35) {
      if (!taskTypes.includes('irrigation') && (!weather.humidity || weather.humidity < 50)) {
        suggestions.push({
          id: 'sugg_optimal_irrigation',
          title: 'Optimal Conditions for Irrigation',
          description: 'Weather conditions are favorable for irrigation. Regular watering recommended.',
          type: 'irrigation',
          priority: 'medium',
          reason: 'optimal_conditions',
        });
      }
    }

    // Spray suggestion (avoid during rain)
    if (weather.rainProbability < 20 && weather.temperature >= 20 && weather.temperature <= 30) {
      if (!taskTypes.includes('spray')) {
        suggestions.push({
          id: 'sugg_optimal_spray',
          title: 'Good Conditions for Spraying',
          description: 'Low rainfall and moderate temperature. Ideal for pesticide/fertilizer spraying.',
          type: 'spray',
          priority: 'medium',
          reason: 'optimal_spray_conditions',
        });
      }
    }

    // Avoid spray during rain
    if (weather.rainProbability > 50 && taskTypes.includes('spray')) {
      suggestions.push({
        id: 'sugg_avoid_spray_rain',
        title: 'Avoid Spraying',
        description: 'High rainfall probability. Reschedule spraying tasks.',
        type: 'spray',
        priority: 'high',
        reason: 'rain_warning',
      });
    }
  }

  // Time-based suggestions can be added in the future
  // For example, when tracking sowing dates or other key farming events

  // Sort by priority
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Get localized suggestion text
 */
export function getSuggestionText(suggestion: SmartSuggestion, language: string = 'en'): {
  title: string;
  description: string;
} {
  const translations: Record<string, Record<string, { title: string; description: string }>> = {
    en: {
      sugg_high_temp_irrigation: {
        title: 'Schedule Irrigation',
        description: 'Temperature is above 35°C. Early morning or evening irrigation is recommended.',
      },
      sugg_rain_skip_irrigation: {
        title: 'Skip Irrigation',
        description: 'Rain probability is above 60%. Consider skipping irrigation today.',
      },
      sugg_optimal_irrigation: {
        title: 'Optimal Conditions for Irrigation',
        description: 'Weather conditions are favorable for irrigation. Regular watering recommended.',
      },
      sugg_optimal_spray: {
        title: 'Good Conditions for Spraying',
        description: 'Low rainfall and moderate temperature. Ideal for pesticide/fertilizer spraying.',
      },
      sugg_avoid_spray_rain: {
        title: 'Avoid Spraying',
        description: 'High rainfall probability. Reschedule spraying tasks.',
      },
    },
    hi: {
      sugg_high_temp_irrigation: {
        title: 'सिंचाई शेड्यूल करें',
        description: 'तापमान 35°C से अधिक है। सुबह या शाम की सिंचाई की अनुशंसा की जाती है।',
      },
      sugg_rain_skip_irrigation: {
        title: 'सिंचाई छोड़ दें',
        description: 'वर्षा की संभावना 60% से अधिक है। आज सिंचाई छोड़ने पर विचार करें।',
      },
      sugg_optimal_irrigation: {
        title: 'सिंचाई के लिए अनुकूल परिस्थितियां',
        description: 'मौसम की स्थितियां सिंचाई के लिए अनुकूल हैं। नियमित सिंचाई की अनुशंसा की जाती है।',
      },
      sugg_optimal_spray: {
        title: 'छिड़काव के लिए अच्छी परिस्थितियां',
        description: 'कम वर्षा और मध्यम तापमान। कीटनाशक/खाद छिड़कने के लिए आदर्श।',
      },
      sugg_avoid_spray_rain: {
        title: 'छिड़काव से बचें',
        description: 'उच्च वर्षा संभावना। छिड़काव कार्यों को पुनः शेड्यूल करें।',
      },
    },
    mr: {
      sugg_high_temp_irrigation: {
        title: 'सिंचन नियोजन करा',
        description: 'तापमान 35°C पेक्षा जास्त आहे. सकाळ किंवा संध्याकाळी सिंचन सुचविले जाते.',
      },
      sugg_rain_skip_irrigation: {
        title: 'सिंचन टाळा',
        description: 'पाऊस येण्याची शक्यता 60% पेक्षा जास्त आहे. आज सिंचन टाळण्याचा विचार करा.',
      },
      sugg_optimal_irrigation: {
        title: 'सिंचनासाठी अनुकूल परिस्थिती',
        description: 'हवामान परिस्थिती सिंचनासाठी अनुकूल आहे. नियमित सिंचन सुचविले जाते.',
      },
      sugg_optimal_spray: {
        title: 'फवारणीसाठी चांगल्या परिस्थिती',
        description: 'कमी पाऊस आणि मध्यम तापमान. कीटकनाशक/खत फवारण्यासाठी आदर्श.',
      },
      sugg_avoid_spray_rain: {
        title: 'फवारणी टाळा',
        description: 'उच्च पाऊस येण्याची शक्यता. फवारणी कार्यांची पुनर्रचना करा.',
      },
    },
    gu: {
      sugg_high_temp_irrigation: {
        title: 'સિંચણ સુથાર કરો',
        description: 'તાપમાન 35°C કરતા વધુ છે. સવારે અથવા સાંજે સિંચણ ભલામણ કરવામાં આવે છે.',
      },
      sugg_rain_skip_irrigation: {
        title: 'સિંચણ છોડી દો',
        description: 'વરસાદની સંભાવના 60% કરતા વધુ છે. આજે સિંચણ છોડવાનો વિચાર કરો.',
      },
      sugg_optimal_irrigation: {
        title: 'સિંચણ માટે શ્રેષ્ઠ શરતો',
        description: 'આબોહવાની શરતો સિંચણ માટે અનુકૂળ છે. નિયમિત સિંચણ ભલામણ કરવામાં આવે છે.',
      },
      sugg_optimal_spray: {
        title: 'છંટવાણી માટે સારી શરતો',
        description: 'ઓછો વરસાદ અને મધ્યમ તાપમાન. જીવનાશક/ખાતર છંટવાણી માટે આદર્શ.',
      },
      sugg_avoid_spray_rain: {
        title: 'છંટવાણી ટાળો',
        description: 'વરસાદની ઉચ્ચ સંભાવના. છંટવાણી કાર્યો ફરીથી નિર્ધારણ કરો.',
      },
    },
    ml: {
      sugg_high_temp_irrigation: {
        title: 'ജലസേചനം ഷെഡ്യൂൾ ചെയ്യുക',
        description: 'താപനില 35°C ൽ കൂടുതലാണ്. പ്രത്യുഷയിലെ അല്ലെങ്കിൽ സന്ധ്യാ കാല ജലസേചനം ശുപാർശ ചെയ്യപ്പെടുന്നു.',
      },
      sugg_rain_skip_irrigation: {
        title: 'ജലസേചനം ഒഴിവാക്കുക',
        description: 'മഴയുടെ സാധ്യത 60% ൽ കൂടുതലാണ്. ഇന്ന് ജലസേചനം ഒഴിവാക്കാൻ പരിഗണിക്കുക.',
      },
      sugg_optimal_irrigation: {
        title: 'ജലസേചനത്തിനുള്ള അനുകൂല സാഹചര്യങ്ങൾ',
        description: 'കാലാവസ്ഥ വ്യവസ്ഥകൾ ജലസേചനത്തിന് അനുകൂലമാണ്. സാധാരണ കാലുകൾ ശുപാർശ ചെയ്യപ്പെടുന്നു.',
      },
      sugg_optimal_spray: {
        title: 'സ്പ്രേയിംഗിനുള്ള നല്ല സാഹചര്യങ്ങൾ',
        description: 'കുറഞ്ഞ മഴയും മിതമായ താപനിലയും. കീടനാശിനി/സാരവാഹകൻ സ്പ്രേയിംഗിനുള്ള അനുയോജ്യം.',
      },
      sugg_avoid_spray_rain: {
        title: 'സ്പ്രേയിംഗ് ഒഴിവാക്കുക',
        description: 'ഉയർന്ന മഴയുടെ സാധ്യത. സ്പ്രേയിംഗ് ജോലികൾ പുനരാഞ്ജനം ചെയ്യുക.',
      },
    },
  };

  return (
    translations[language]?.[suggestion.id] || translations['en'][suggestion.id] || {
      title: suggestion.title,
      description: suggestion.description,
    }
  );
}
