/**
 * Government Scheme Object Structure
 * @typedef {Object} GovernmentScheme
 * @property {string} id - Unique identifier
 * @property {string} name - Scheme name in English
 * @property {string} nameHindi - Scheme name in Hindi
 * @property {string} description - Description in English
 * @property {string} descriptionHindi - Description in Hindi
 * @property {string[]} benefits - Benefits in English
 * @property {string[]} benefitsHindi - Benefits in Hindi
 * @property {string[]} eligibility - Eligibility criteria in English
 * @property {string[]} eligibilityHindi - Eligibility criteria in Hindi
 * @property {string[]} documents - Required documents in English
 * @property {string[]} documentsHindi - Required documents in Hindi
 * @property {string[]} applicationProcess - Application process in English
 * @property {string[]} applicationProcessHindi - Application process in Hindi
 * @property {string} helplineNumber - Contact number
 * @property {string} website - Official website URL
 * @property {string} ministry - Ministry name in English
 * @property {string} ministryHindi - Ministry name in Hindi
 * @property {'income-support'|'insurance'|'credit'|'subsidy'|'technology'} category - Scheme category
 * @property {string} image - Image path
 */

/**
 * @type {GovernmentScheme[]}
 */
const governmentSchemes = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Samman Nidhi',
    nameHindi: 'प्रधानमंत्री किसान सम्मान निधि',
    description: 'Direct income support for small and marginal farmers',
    descriptionHindi: 'छोटे और सीमांत किसानों के लिए प्रत्यक्ष आय सहायता',
    benefits: [
      'Rs. 6000 per year in three installments',
      'Direct transfer to bank account',
      'No need to visit government offices'
    ],
    benefitsHindi: [
      'प्रति वर्ष 6000 रुपये तीन किस्तों में',
      'बैंक खाते में सीधे स्थानांतरण',
      'सरकारी कार्यालयों में जाने की आवश्यकता नहीं'
    ],
    eligibility: [
      'Small and marginal farmers',
      'Landholding up to 2 hectares',
      'Valid Aadhaar card required'
    ],
    eligibilityHindi: [
      'छोटे और सीमांत किसान',
      '2 हेक्टेयर तक की भूमि',
      'वैध आधार कार्ड आवश्यक'
    ],
    documents: [
      'Aadhaar Card',
      'Bank Account Details',
      'Land Records',
      'Mobile Number'
    ],
    documentsHindi: [
      'आधार कार्ड',
      'बैंक खाता विवरण',
      'भूमि रिकॉर्ड',
      'मोबाइल नंबर'
    ],
    applicationProcess: [
      'Visit pmkisan.gov.in',
      'Click on "New Farmer Registration"',
      'Fill all required details',
      'Submit with documents'
    ],
    applicationProcessHindi: [
      'pmkisan.gov.in पर जाएं',
      '"नया किसान पंजीकरण" पर क्लिक करें',
      'सभी आवश्यक विवरण भरें',
      'दस्तावेजों के साथ जमा करें'
    ],
    helplineNumber: '155261',
    website: 'https://pmkisan.gov.in',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    ministryHindi: 'कृषि और किसान कल्याण मंत्रालय',
    category: 'income-support',
    image: '/images/pm-kisan-banner.jpg'
  },
  {
    id: 'soil-health-card',
    name: 'Soil Health Card Scheme',
    nameHindi: 'मृदा स्वास्थ्य कार्ड योजना',
    description: 'Get detailed soil analysis and recommendations for your farm',
    descriptionHindi: 'अपने खेत के लिए विस्तृत मिट्टी विश्लेषण और सुझाव प्राप्त करें',
    benefits: [
      'Free soil testing',
      'Customized fertilizer recommendations',
      'Increase crop productivity',
      'Reduce input costs'
    ],
    benefitsHindi: [
      'मुफ्त मिट्टी परीक्षण',
      'अनुकूलित उर्वरक सिफारिशें',
      'फसल उत्पादकता में वृद्धि',
      'इनपुट लागत में कमी'
    ],
    eligibility: [
      'All farmers',
      'No land size restriction',
      'Valid identity proof required'
    ],
    eligibilityHindi: [
      'सभी किसान',
      'कोई भूमि आकार प्रतिबंध नहीं',
      'वैध पहचान प्रमाण आवश्यक'
    ],
    documents: [
      'Aadhaar Card',
      'Land Ownership Documents',
      'Contact Details'
    ],
    documentsHindi: [
      'आधार कार्ड',
      'भूमि स्वामित्व दस्तावेज',
      'संपर्क विवरण'
    ],
    applicationProcess: [
      'Contact local agriculture extension officer',
      'Fill soil health card application',
      'Provide soil samples',
      'Receive card within 30 days'
    ],
    applicationProcessHindi: [
      'स्थानीय कृषि विस्तार अधिकारी से संपर्क करें',
      'मृदा स्वास्थ्य कार्ड आवेदन भरें',
      'मिट्टी के नमूने प्रदान करें',
      '30 दिनों के भीतर कार्ड प्राप्त करें'
    ],
    helplineNumber: '18001801551',
    website: 'https://soilhealth.dac.gov.in',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    ministryHindi: 'कृषि और किसान कल्याण मंत्रालय',
    category: 'subsidy',
    image: '/images/soil-health-banner.jpg'
  },
  {
    id: 'fasal-bima',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
    description: 'Crop insurance scheme to protect farmers from crop loss',
    descriptionHindi: 'फसल हानि से किसानों की सुरक्षा के लिए फसल बीमा योजना',
    benefits: [
      'Protection against crop loss',
      'Low premium rates',
      'Quick claim settlement',
      'Technology-enabled assessment'
    ],
    benefitsHindi: [
      'फसल हानि से सुरक्षा',
      'कम प्रीमियम दरें',
      'त्वरित दावा निपटान',
      'प्रौद्योगिकी-सक्षम मूल्यांकन'
    ],
    eligibility: [
      'All farmers growing notified crops',
      'Tenant farmers with valid documents',
      'Sharecroppers with proper agreements'
    ],
    eligibilityHindi: [
      'अधिसूचित फसलें उगाने वाले सभी किसान',
      'वैध दस्तावेजों वाले किरायेदार किसान',
      'उचित समझौते वाले बटाईदार'
    ],
    documents: [
      'Aadhaar Card',
      'Bank Account Details',
      'Land Records',
      'Sowing Certificate'
    ],
    documentsHindi: [
      'आधार कार्ड',
      'बैंक खाता विवरण',
      'भूमि रिकॉर्ड',
      'बुवाई प्रमाणपत्र'
    ],
    applicationProcess: [
      'Apply through bank or CSC',
      'Submit required documents',
      'Pay premium amount',
      'Get insurance certificate'
    ],
    applicationProcessHindi: [
      'बैंक या CSC के माध्यम से आवेदन करें',
      'आवश्यक दस्तावेज जमा करें',
      'प्रीमियम राशि का भुगतान करें',
      'बीमा प्रमाणपत्र प्राप्त करें'
    ],
    helplineNumber: '18001801551',
    website: 'https://pmfby.gov.in',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    ministryHindi: 'कृषि और किसान कल्याण मंत्रालय',
    category: 'insurance',
    image: '/images/fasal-bima-banner.jpg'
  }
];

const bannerImages = [
  {
    id: 1,
    title: 'PM-KISAN Samman Nidhi',
    titleHindi: 'प्रधानमंत्री किसान सम्मान निधि',
    description: 'Direct income support of ₹6000 per year for farmers',
    descriptionHindi: 'किसानों के लिए प्रति वर्ष ₹6000 की प्रत्यक्ष आय सहायता',
    image: '/images/pm-kisan-banner.jpg',
    link: '/schemes/pm-kisan'
  },
  {
    id: 2,
    title: 'Soil Health Card',
    titleHindi: 'मृदा स्वास्थ्य कार्ड',
    description: 'Free soil testing and fertilizer recommendations',
    descriptionHindi: 'मुफ्त मिट्टी परीक्षण और उर्वरक सिफारिशें',
    image: '/images/soil-health-banner.jpg',
    link: '/schemes/soil-health'
  },
  {
    id: 3,
    title: 'Pradhan Mantri Fasal Bima Yojana',
    titleHindi: 'प्रधानमंत्री फसल बीमा योजना',
    description: 'Crop insurance for protection against natural calamities',
    descriptionHindi: 'प्राकृतिक आपदाओं से सुरक्षा के लिए फसल बीमा',
    image: '/images/fasal-bima-banner.jpg',
    link: '/schemes/fasal-bima'
  }
];

// Export for CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    governmentSchemes,
    bannerImages
  };
}

// Export for ES6 modules (if needed)
// export { governmentSchemes, bannerImages };