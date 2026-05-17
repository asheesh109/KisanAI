# Setup Guide 🛠️

Complete step-by-step guide to set up KisanAI for development.

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js 18+** - [Download](https://nodejs.org/)
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

2. **npm 9+** - [Download](https://www.npmjs.com/)
   ```bash
   npm --version  # Should be 9.0.0 or higher
   ```

3. **Git** - [Download](https://git-scm.com/)
   ```bash
   git --version
   ```

4. **A Code Editor** - [VS Code](https://code.visualstudio.com/) recommended

5. **MongoDB** - Local or cloud instance
   - Local: [Download](https://www.mongodb.com/try/download/community)
   - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 🚀 Quick Start (5 minutes)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/KisanAI.git
cd KisanAI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Open Browser

Visit: http://localhost:3000

---

## 🔑 API Keys Setup

### Get Required API Keys

#### 1. Google Gemini API
```bash
# 1. Go to https://ai.google.dev/
# 2. Click "Get API Key"
# 3. Create new project
# 4. Copy API key
# 5. Add to .env.local:
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

#### 2. ElevenLabs Voice API
```bash
# 1. Sign up at https://elevenlabs.io/
# 2. Go to Profile → API Key
# 3. Copy API key
# 4. Add to .env.local:
ELEVENLABS_API_KEY=your_key_here
```

#### 3. MongoDB Atlas
```bash
# 1. Create account at https://www.mongodb.com/cloud/atlas
# 2. Create cluster
# 3. Get connection string
# 4. Add to .env.local:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kisanai
```

#### 4. Weather API (Optional)
```bash
# 1. Sign up at https://openweathermap.org/
# 2. Get free API key
# 3. Add to .env.local:
WEATHER_API_KEY=your_key_here
```

---

## 📝 Environment Variables

Create `.env.local` file:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kisanai

# Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-pro-vision

# Voice API
ELEVENLABS_API_KEY=your_elevenlabs_key

# Weather API
WEATHER_API_KEY=your_weather_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

See [.env.example](./.env.example) for all options.

---

## 🧪 Verify Installation

### Run Tests

```bash
npm test
```

Expected output:
```
PASS  src/__tests__/components/Header.test.jsx
PASS  src/__tests__/pages/Home.test.jsx
...
Tests:       X passed, Y total
```

### Run Linter

```bash
npm run lint
```

Expected: No errors

### Build Project

```bash
npm run build
```

Expected: Build completes successfully

---

## 🖥️ Development Commands

### Start Development Server

```bash
npm run dev
# Server runs on http://localhost:3000
# Auto-reloads on file changes
```

### Run Tests

```bash
# Run all tests once
npm test

# Run in watch mode (re-run on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Lint Code

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

---

## 📂 Project Structure

```
KisanAI/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.jsx           # Home page
│   │   ├── layout.jsx         # Root layout
│   │   ├── api/              # API routes
│   │   ├── voice-assistant/  # Voice feature
│   │   ├── crop-analysis/    # Crop analysis
│   │   ├── weather/          # Weather feature
│   │   ├── market-prices/    # Market prices
│   │   └── schemes/          # Government schemes
│   │
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── layout/           # Layout components
│   │   └── [features]/       # Feature components
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useSpeechRecognition.js
│   │   ├── useSpeechSynthesis.js
│   │   └── [custom hooks]/
│   │
│   ├── lib/                  # Utilities & libraries
│   │   ├── mongodb.ts       # Database
│   │   ├── geminiTranslate.ts # AI
│   │   └── [utilities]/
│   │
│   ├── types/               # TypeScript types
│   ├── contexts/            # React contexts
│   ├── data/                # Static data
│   └── __tests__/           # Tests
│
├── public/                   # Static files
├── docs/                     # Documentation
├── .github/                 # GitHub config
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── jest.config.js
└── next.config.js
```

---

## 🔧 Configuration Files

### TypeScript Config (tsconfig.json)
- Strict mode enabled
- Path aliases configured: `@/*` → `./src/*`
- React JSX support

### Tailwind CSS (tailwind.config.js)
- Custom colors for farming theme
- Responsive design
- Dark mode support

### Jest (jest.config.js)
- React Testing Library
- jsdom environment
- Coverage collection

### ESLint (eslint.config.mjs)
- Next.js recommended rules
- TypeScript support
- Code quality checks

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Or use different port:
npm run dev -- -p 3001
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Connection Failed

```bash
# Check connection string in .env.local
# Verify MongoDB is running
# Test with MongoDB Compass

# If using local MongoDB:
mongod  # Start MongoDB server

# If using MongoDB Atlas:
# - Check IP whitelist
# - Verify username/password
# - Check connection string format
```

### Gemini API Key Invalid

```bash
# Regenerate key at https://ai.google.dev/
# Ensure key is in .env.local
# Verify NEXT_PUBLIC_ prefix for client-side keys
```

### Tests Failing

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- useSpeechRecognition.test.jsx

# Check for console errors
# Review test output for specific errors
```

---

## 📚 Next Steps

1. **Read [CONTRIBUTING.md](../CONTRIBUTING.md)** - Learn contribution process
2. **Check [ARCHITECTURE.md](./ARCHITECTURE.md)** - Understand codebase
3. **Review [CODING_STANDARDS.md](./CODING_STANDARDS.md)** - Code style
4. **Find [Good First Issues](https://github.com/yourusername/KisanAI/labels/good%20first%20issue)** - Start contributing

---

## 🤝 Need Help?

- 📖 [Documentation](../docs)
- 💬 [GitHub Discussions](https://github.com/yourusername/KisanAI/discussions)
- 🐛 [Report Issues](https://github.com/yourusername/KisanAI/issues)
- 📧 [Email Support](mailto:support@kisanai.example.com)

---

<div align="center">

Ready to start developing? [Create your first PR!](../CONTRIBUTING.md)

</div>
