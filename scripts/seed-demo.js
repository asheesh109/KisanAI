const fs = require('fs');
const path = require('path');

const demoSchemes = [
    {
        id: 'pm-kisan-demo',
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
        id: 'pmfby-demo',
        name: 'Pradhan Mantri Fasal Bima Yojana',
        nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
        description: 'Crop insurance protection against crop losses caused by natural calamities',
        descriptionHindi: 'प्राकृतिक आपदाओं से होने वाले फसल नुकसान के लिए बीमा सुरक्षा',
        benefits: [
            'Financial protection against crop loss',
            'Affordable farmer premium',
            'Coverage for notified crops'
        ],
        benefitsHindi: [
            'फसल नुकसान से वित्तीय सुरक्षा',
            'किसानों के लिए किफायती प्रीमियम',
            'अधिसूचित फसलों के लिए कवरेज'
        ],
        eligibility: [
            'Farmers growing notified crops',
            'Farmers with eligible agricultural land',
            'Valid land and crop records required'
        ],
        eligibilityHindi: [
            'अधिसूचित फसल उगाने वाले किसान',
            'पात्र कृषि भूमि वाले किसान',
            'वैध भूमि और फसल रिकॉर्ड आवश्यक'
        ],
        documents: [
            'Aadhaar Card',
            'Land Records',
            'Bank Account Details',
            'Crop Details'
        ],
        documentsHindi: [
            'आधार कार्ड',
            'भूमि रिकॉर्ड',
            'बैंक खाता विवरण',
            'फसल विवरण'
        ],
        applicationProcess: [
            'Visit the official PMFBY portal',
            'Select the applicable crop insurance scheme',
            'Provide land and crop details',
            'Submit the required documents'
        ],
        applicationProcessHindi: [
            'आधिकारिक PMFBY पोर्टल पर जाएं',
            'लागू फसल बीमा योजना चुनें',
            'भूमि और फसल का विवरण दें',
            'आवश्यक दस्तावेज जमा करें'
        ],
        helplineNumber: '14447',
        website: 'https://pmfby.gov.in',
        ministry: 'Ministry of Agriculture and Farmers Welfare',
        ministryHindi: 'कृषि और किसान कल्याण मंत्रालय',
        category: 'crop-insurance',
        image: '/images/pmfby-banner.jpg'
    }
];

const outputDir = path.join(__dirname, '..', 'public', 'demo');
const outputFile = path.join(outputDir, 'schemes.json');

fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(
    outputFile,
    JSON.stringify(demoSchemes, null, 2),
    'utf8'
);

console.log(`Seeded ${demoSchemes.length} demo schemes.`);
console.log(`Demo data written to: ${outputFile}`);