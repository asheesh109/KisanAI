const fs = require('fs');
let setup = fs.readFileSync('jest.setup.js', 'utf8');
setup += '\n' +
'// Mock Language Context\n' +
'jest.mock(\'@/contexts/LanguageContext\', () => ({\n' +
'  useLanguage: () => {\n' +
'    const { getTranslations } = require(\'./src/lib/i18n\');\n' +
'    return {\n' +
'      language: \'en\',\n' +
'      languages: {\n' +
'        en: { code: \'en\', name: \'English\', nativeName: \'English\', dir: \'ltr\' },\n' +
'        hi: { code: \'hi\', name: \'Hindi\', nativeName: \'??????\', dir: \'ltr\' }\n' +
'      },\n' +
'      t: (key, params = {}) => {\n' +
'        const trans = getTranslations(\'en\');\n' +
'        let translation = trans[key] || key;\n' +
'        if (params.returnObjects) return translation;\n' +
'        translation = String(translation);\n' +
'        Object.keys(params).forEach((param) => {\n' +
'          if (param !== \'returnObjects\') {\n' +
'            const placeholder = new RegExp(\'{{(?:param)}}\'.replace(\'(?:param)\', param), \'g\');\n' +
'            translation = translation.replace(placeholder, String(params[param]));\n' +
'          }\n' +
'        });\n' +
'        return translation;\n' +
'      },\n' +
'      changeLanguage: jest.fn()\n' +
'    };\n' +
'  }\n' +
'}));\n';
fs.writeFileSync('jest.setup.js', setup, 'utf8');
