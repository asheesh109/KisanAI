const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + filePath);
}

replaceInFile('src/__tests__/components/Header.test.jsx', [
  [/getByText\('आवाज सहायक'\)/g, "getByText(/Voice Assistant/i)"],
  [/getByText\('फसल विश्लेषण'\)/g, "getByText(/Crop Analysis/i)"],
  [/getByText\('मौसम'\)/g, "getByText(/Weather/i)"],
  [/getByText\('मंडी भाव'\)/g, "getByText(/Market Prices/i)"],
  [/getByText\('सरकारी योजनाएं'\)/g, "getByText(/Government Schemes/i)"],
  [/getByText\('KCC आवेदन'\)/g, "getByText(/KCC Application/i)"]
]);

replaceInFile('src/__tests__/components/Footer.test.jsx', [
  [/getByText\('KisanAI'\)/g, "getByText(/KisanAI/i)"],
  [/getByText\('किसानों के लिए उन्नत एआई समाधान'\)/g, "getByText(/Advanced AI solutions for farmers/i)"],
  [/getByText\('त्वरित लिंक'\)/g, "getByText(/Quick Links/i)"],
  [/getByText\('मुखपृष्ठ'\)/g, "getByText(/Home/i)"],
  [/getByText\('विशेषताएं'\)/g, "getByText(/Features/i)"],
  [/getByText\('हमारे बारे में'\)/g, "getByText(/About Us/i)"],
  [/getByText\('संपर्क'\)/g, "getByText(/Contact/i)"],
  [/getByText\('कानूनी'\)/g, "getByText(/Legal/i)"],
  [/getByText\('गोपनीयता नीति'\)/g, "getByText(/Privacy Policy/i)"],
  [/getByText\('सेवा की शर्तें'\)/g, "getByText(/Terms of Service/i)"],
  [/getByText\('अधिकार सुरक्षित।'\)/g, "getByText(/All rights reserved/i)"]
]);

replaceInFile('src/__tests__/components/HeroBanner.test.jsx', [
  [/getByText\('स्मार्ट कृषि के लिए एआई साथी'\)/g, "getByText(/AI Companion for Smart Agriculture/i)"],
  [/getByText\('फसल रोग पहचान, मौसम पूर्वानुमान, और मंडी भाव - सब कुछ एक जगह पर'\)/g, "getByText(/Crop disease detection/i)"],
  [/getByText\('आवाज सहायक'\)/g, "getByText(/Voice Assistant/i)"],
  [/getByText\('फसल विश्लेषण'\)/g, "getByText(/Crop Analysis/i)"],
  [/getByText\('मौसम पूर्वानुमान'\)/g, "getByText(/Weather Forecast/i)"],
  [/getByText\('मंडी भाव'\)/g, "getByText(/Market Prices/i)"],
  [/getByText\('सरकारी योजनाएं'\)/g, "getByText(/Government Schemes/i)"],
  [/getByText\('KCC आवेदन'\)/g, "getByText(/KCC Application/i)"]
]);
