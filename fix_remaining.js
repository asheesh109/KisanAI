const fs = require('fs');

// Fix jest.setup.js
let jestSetup = fs.readFileSync('jest.setup.js', 'utf8');
jestSetup = jestSetup.replace(/stop: jest.fn\(\),/g, 'stop: jest.fn(),\n    abort: jest.fn(),');
fs.writeFileSync('jest.setup.js', jestSetup, 'utf8');

// Fix paths in the 3 failing tests
let elig = fs.readFileSync('src/__tests__/pages/EligibilityChecker.test.jsx', 'utf8');
elig = elig.replace('@/app/schemes/eligibility/page', '@/app/schemes/eligibility-checker/page');
fs.writeFileSync('src/__tests__/pages/EligibilityChecker.test.jsx', elig, 'utf8');

let kcc = fs.readFileSync('src/__tests__/pages/KCCApplication.test.jsx', 'utf8');
kcc = kcc.replace('@/app/kcc/page', '@/app/kcc-application/page');
fs.writeFileSync('src/__tests__/pages/KCCApplication.test.jsx', kcc, 'utf8');

let hero = fs.readFileSync('src/__tests__/components/HeroBanner.test.jsx', 'utf8');
hero = hero.replace('@/components/layout/HeroBanner', '@/components/HeroBanner');
fs.writeFileSync('src/__tests__/components/HeroBanner.test.jsx', hero, 'utf8');

console.log('Fixed remaining files!');
