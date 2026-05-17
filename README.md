# KisanAI

KisanAI  an open source, farmer facing Next.js app providing curated government schemes, market prices, voice assistant, and tools to help farmers make informed decisions.

Badges: [build] [license] [contributors]

Overview
- Purpose: central portal for Indian farmers with translations, AI assisted insights, and offline friendly features.
- Tech: Next.js (App Router), React, TypeScript, Tailwind CSS, Jest

Quick links
- Documentation: docs/
- Contributing: CONTRIBUTING.md
- Issue templates: .github/ISSUE_TEMPLATE/
- CI: .github/workflows/

Getting started (developer)
See [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md) for local setup instructions and environment variables.

Contributing
We welcome contributions. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the code of conduct before opening issues or PRs.

Community
- Check [ROADMAP.md](ROADMAP.md) for planned work and milestones.
- For support and security reporting see [SUPPORT.md](SUPPORT.md) and [SECURITY.md](SECURITY.md).

Maintainers
- See CODEOWNERS and repository maintainers in the docs.
# KisanAI


KisanAI  AI powered assistant for farmers to access crop insights, schemes, market data, and voice tools.

## Table of Contents
- About
- Features
- Screenshots
- Architecture
- Folder Structure
- Quick Start
- Local Development
Badges: [build] [license] [contributors] [GSSoC]
- Tech Stack
- Contributing
- Open Source Programs
- Maintainers
- Roadmap
- License

## About

KisanAI is a progressive web app built with Next.js + TypeScript that provides farmers with contextual agricultural information, government scheme guidance, calendar/task management, and voice-based interactions.

## Features
- AI-assisted crop analysis
- Voice assistant (speech recognition + synthesis)
- Offline-first data with IndexedDB
- Market price and weather integrations
- Government scheme tracking
- Responsive, accessible UI




- Maintainer: Ashish Parab ([asheesh109](https://github.com/asheesh109)) — ashishparab03@gmail.com
## Architecture Overview

- Next.js for SSR/SSG and API routes
- React components structured under `src/components`
- Business logic and utilities under `src/lib`
- Hooks under `src/hooks`
- Data seeds under `src/data`

## Folder Structure

Key folders:

- `src/app/` — Next.js routes and pages
- `src/components/` — UI components
- `src/hooks/` — Reusable hooks
- `src/lib/` — Utilities, API, DB adapters
- `src/data/` — Seed data and fixtures
- `src/types/` — Shared TypeScript types

## Quick Start

1. Clone

```bash
git clone https://github.com/asheesh109/KisanAI.git
cd KisanAI
npm install
```

2. Run locally

```bash
npm run dev
```

3. Run tests / lint

```bash
npm run test
npm run lint
npm run type-check
```

## Environment Variables

Create `.env.local` with at least:

- `NEXT_PUBLIC_API_URL` — API base URL
- `MONGODB_URI` — optional DB connection
- `OPENAI_API_KEY` — optional for AI features

## Tech Stack

- Next.js, React, TypeScript
- TailwindCSS
- Jest + React Testing Library
- GitHub Actions for CI

## Contributing

We welcome contributions. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## Open Source Programs

This repo is organized and labeled to support GSSoC and Hacktoberfest contributors.

## Contributor Journey

A concise flow for new contributors:

```
Discover issue -> Claim -> Create branch -> Implement -> Open PR -> Review -> Merge
```

- Beginner-friendly: look for `good first issue` or `beginner` labels.
- For program-specific guidance see `docs/GSSOC_GUIDE.md` and `docs/HACKTOBERFEST_GUIDE.md`.

## Community & Maintainer Support

- Maintainer: Ashish Parab ([asheesh109](https://github.com/asheesh109)) — ashishparab03@gmail.com
- For questions, use GitHub Discussions or email ashishparab03@gmail.com for sensitive matters.


## Maintainers

- See `CODEOWNERS` for primary maintainers.

## Roadmap

See [ROADMAP.md](ROADMAP.md)

## License

MIT — see `LICENSE`
# 🌾 KisanAI - AI-Powered Farmer Assistant Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.1-000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

[![GSSoC-2025](https://img.shields.io/badge/GSSoC-2025-FF6B6B?style=for-the-badge)](https://www.girlscript.tech/home/gssoc)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2025-FF5733?style=for-the-badge)](https://hacktoberfest.com/)
[![Open Source](https://img.shields.io/badge/Open%20Source-MIT-green?style=for-the-badge)](https://opensource.org/)

**Empowering Indian Farmers with AI-Powered Intelligence** 🚀

[Features](#-features) • [Demo](#-live-demo) • [Installation](#-installation) • [Contributing](#-contributing) • [Roadmap](#-roadmap) • [Community](#-community)

</div>

---

## 📱 About KisanAI

KisanAI is a **cutting edge AI powered farmer assistant platform** designed specifically for Indian farmers. Built with modern web technologies and powered by advanced AI models, KisanAI provides intelligent, actionable insights to help farmers make better decisions.

Whether it's crop disease analysis, weather forecasting, market prices, or government scheme navigation, KisanAI delivers comprehensive assistance through an intuitive, voice-enabled interface in Hindi and English.

### 🎯 Mission
To democratize AI-powered agricultural intelligence, making it accessible to every farmer in India through simple, voice-enabled technology.

### 💡 Vision
A future where every farmer has access to real-time insights, AI-powered decision support, and government benefit information, breaking down barriers of literacy and technology adoption.

---

## ✨ Features

### 🎤 Voice Assistant
- **Hindi & English Support**: Natural language voice interaction
- **Speech Recognition**: Accurate voice input processing
- **Text-to-Speech**: Clear audio responses
- **Offline Capable**: Works without internet connection
- **Multi-turn Conversations**: Context-aware dialogues

### 📸 Crop Disease Analysis
- **Image Upload**: Analyze crop diseases from photos
- **AI Detection**: Using Gemini Vision API
- **Disease Identification**: Instant diagnosis with confidence scores
- **Treatment Recommendations**: Actionable solutions
- **Disease Prevention**: Tips for future prevention

### 🌦️ Weather Forecasting
- **Location-Based**: Precise weather data for farmer's location
- **7-Day Forecast**: Extended weather predictions
- **Alerts**: Severe weather notifications
- **Rainfall Data**: Monsoon and precipitation tracking
- **Historical Data**: Seasonal patterns and analysis

### 📈 Market Prices
- **Real-Time Updates**: Live market data
- **Price Trends**: Historical price analysis
- **Market Insights**: Supply-demand indicators
- **Price Alerts**: Notification system for price changes
- **Multi-Commodity**: Coverage of major agricultural commodities

### 📋 Government Schemes Portal
- **Scheme Discovery**: Browse all major government schemes
- **Eligibility Checker**: Interactive tool to find applicable schemes
- **Application Support**: Step-by-step KCC and other applications
- **Benefits Lookup**: Understand scheme benefits clearly
- **Application Status**: Track submitted applications

### 💳 KCC Application System
- **Digital Forms**: Streamlined application process
- **Document Management**: Upload and manage documents
- **Status Tracking**: Real-time application status
- **Mobile Optimized**: Complete on mobile devices
- **Hindi Support**: Forms available in Hindi

### 🌐 Internationalization
- **Hindi Language**: Complete Hindi localization
- **English Support**: Full English interface
- **Easy Addition**: Extensible i18n system for more languages
- **Regional Context**: Location-specific content

### 📱 Progressive Web App
- **Offline First**: Works without internet
- **Install to Home**: App-like experience
- **Push Notifications**: Stay updated
- **Fast Loading**: Optimized performance
- **Mobile Responsive**: Perfect on all devices

---

## 🖼️ Screenshots

| Feature | Preview |
|---------|---------|
| **Home Page** | Dashboard with quick access to all features |
| **Voice Assistant** | Conversational AI in Hindi and English |
| **Crop Analysis** | Disease detection from images |
| **Market Prices** | Real-time commodity pricing |
| **Schemes Portal** | Government schemes discovery |
| **Weather** | Location-based weather forecasts |

*Screenshots coming soon - [Help us add them!](docs/contributing/screenshots.md)*

---

## 🚀 Live Demo

**Live URL**: [kisanai]([https://kisanai.example.com](https://kisan-ai-m12i.vercel.app/))
*(Demo environment - May contain sample data)*

Try features:
- 🎤 [Voice Assistant Demo](https://kisan-ai-m12i.vercel.app/voice-assistant)
- 📸 [Crop Analysis Demo](https://kisan-ai-m12i.vercel.app/crop-analysis)
- 🌦️ [Weather Demo](https://kisan-ai-m12i.vercel.app/weather)
- 📈 [Market Prices Demo](https://kisan-ai-m12i.vercel.app/market-prices)
- 📋 [Schemes Portal Demo](https://kisan-ai-m12i.vercel.app/schemes)

---

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1
- **UI Components**: Radix UI, Lucide Icons
- **Animations**: Framer Motion
- **Forms**: Custom React forms with validation

### Backend
- **Runtime**: Node.js
- **Database**: MongoDB with Mongoose
- **API Client**: Axios
- **AI Integration**: Google Generative AI (Gemini)
- **Voice**: ElevenLabs TTS

### Development
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Next.js Build System
- **Package Manager**: npm

### Deployment
- **Target**: Vercel / Self-hosted
- **PWA**: next-pwa for offline support

---

## 📁 Project Structure

```
KisanAI/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   ├── layout.jsx            # Root layout
│   │   ├── page.jsx              # Home page
│   │   ├── crop-analysis/        # Crop disease analysis
│   │   ├── kcc-application/      # KCC application form
│   │   ├── market-prices/        # Market prices
│   │   ├── schemes/              # Government schemes
│   │   ├── voice-assistant/      # Voice chat interface
│   │   ├── weather/              # Weather forecasting
│   │   └── calendar/             # Farming calendar
│   │
│   ├── components/               # React components
│   │   ├── layout/               # Layout components
│   │   ├── ui/                   # Reusable UI components
│   │   └── [feature]/            # Feature-specific components
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useSpeechRecognition.js
│   │   ├── useSpeechSynthesis.js
│   │   └── [custom hooks]/
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── api.ts               # API client
│   │   ├── mongodb.ts           # Database connection
│   │   ├── geminiTranslate.ts   # AI integration
│   │   └── [utilities]/
│   │
│   ├── data/                     # Static data
│   ├── types/                    # TypeScript types
│   ├── contexts/                 # React contexts
│   └── __tests__/                # Test files
│
├── public/                       # Static assets
├── docs/                         # Documentation
├── .github/                      # GitHub config
│   ├── workflows/                # CI/CD workflows
│   ├── ISSUE_TEMPLATE/           # Issue templates
│   └── pull_request_template.md
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── jest.config.js
├── eslint.config.mjs
├── README.md                     # You are here
├── CONTRIBUTING.md               # Contribution guide
├── CODE_OF_CONDUCT.md           # Community guidelines
├── ROADMAP.md                    # Development roadmap
├── SECURITY.md                   # Security policy
└── LICENSE                       # MIT License
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                     User Interface                   │
│  (Next.js/React Components + Tailwind CSS)          │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│                  API Routes Layer                    │
│  (Voice Processing, Image Analysis, Data Fetch)    │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│              Service Layer                          │
│  (AI Integration, Data Processing, Business Logic) │
└────────────────┬────────────────────────────────────┘
                 │
      ┌──────────┴──────────┬────────────────┬────────────┐
      │                     │                │            │
┌─────▼──────┐  ┌──────────▼────┐  ┌────────▼──────┐  ┌──▼──────────┐
│  MongoDB   │  │ Gemini API    │  │ ElevenLabs    │  │ Weather API │
│  Database  │  │ (AI/Vision)   │  │ (Voice)       │  │ (Data)      │
└────────────┘  └───────────────┘  └───────────────┘  └─────────────┘
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js**: 18.0 or higher ([Download](https://nodejs.org/))
- **npm**: 9.0 or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **MongoDB**: Local instance or cloud connection string

### Quick Start (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/KisanAI.git
cd KisanAI

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Start development server
npm run dev

# 5. Open in browser
open http://localhost:3000
```

### Environment Variables

Create `.env.local` file:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kisanai

# Google Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-pro-vision

# ElevenLabs Voice API
ELEVENLABS_API_KEY=your_elevenlabs_key

# Weather API
WEATHER_API_KEY=your_weather_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Development Commands

```bash
# Start development server with turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🧪 Testing

We use **Jest** and **React Testing Library** for comprehensive testing.

```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# CI mode (for GitHub Actions)
npm run test:ci
```

### Testing Structure
```
src/__tests__/
├── components/     # Component tests
├── hooks/         # Hook tests
├── pages/         # Page tests
└── lib/           # Utility tests
```

**[Testing Guide](docs/testing.md)** | **[Example Tests](src/__tests__/)**

---

## 📖 Documentation

Complete documentation is available in the [`docs/`](./docs) directory:

| Document | Purpose |
|----------|---------|
| [**CONTRIBUTING.md**](./CONTRIBUTING.md) | How to contribute to the project |
| [**CODE_OF_CONDUCT.md**](./CODE_OF_CONDUCT.md) | Community guidelines |
| [**ROADMAP.md**](./ROADMAP.md) | Development timeline and features |
| [**docs/ARCHITECTURE.md**](./docs/ARCHITECTURE.md) | Technical architecture |
| [**docs/API.md**](./docs/API.md) | API documentation |
| [**docs/SETUP.md**](./docs/SETUP.md) | Detailed setup guide |
| [**docs/CODING_STANDARDS.md**](./docs/CODING_STANDARDS.md) | Code style guide |

---

## 🎓 Getting Started as a Contributor

### For Beginners
1. **[Read CONTRIBUTING.md](./CONTRIBUTING.md)** - Understand our process
2. **[Check Good First Issues](https://github.com/asheesh109/KisanAI/labels/good%20first%20issue)** - Find starter tasks
3. **[Follow Setup Guide](./docs/SETUP.md)** - Get development environment running
4. **[Read CODING_STANDARDS.md](./docs/CODING_STANDARDS.md)** - Learn code style
5. **[Create your PR!](./CONTRIBUTING.md#pull-request-process)** - Submit changes

### For Intermediate Developers
- Check **[Intermediate Issues](https://github.com/asheesh109/KisanAI/labels/intermediate)**
- Review **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** for system design
- Explore feature implementation patterns
- Help code review pull requests

### For Advanced Contributors
- Check **[Advanced Issues](https://github.com/asheesh109/KisanAI/labels/advanced)**
- Lead feature implementation
- Review and mentor other contributors
- Help maintain architecture quality

---

## 🔗 GSSoC 2025 & Hacktoberfest

### GSSoC 2025 Support ✨
KisanAI is an official GSSoC 2025 project! 

- 📝 **110+ Issues** specifically curated for different skill levels
- 🏆 **Regular Milestones** with achievable goals
- 👥 **Active Mentorship** from core team
- 🎯 **Clear Learning Path** for beginners
- 🚀 **Real-world Impact** helping Indian farmers

**[Start Contributing](./CONTRIBUTING.md)** to make a difference!

### Hacktoberfest Support 🎃
Perfect for Hacktoberfest participation:
- ✅ Beginner-friendly issues tagged `good-first-issue`
- ✅ Issues labeled `hacktoberfest` for easy filtering
- ✅ Quick-win tasks perfect for month-long challenge
- ✅ Supportive community for first-time contributors

**[Find Hacktoberfest Issues](https://github.com/asheesh109/KisanAI/labels/hacktoberfest)**

---

## 🌟 Features Roadmap

### ✅ Current Phase (v0.1.0)
- Voice Assistant with Hindi support
- Crop disease analysis
- Market prices tracking
- Government schemes portal
- KCC application system
- Weather forecasting

### 🔄 Next Phase (v0.2.0)
- User authentication & profiles
- Saved preferences & bookmarks
- Community discussions
- Expert consultation booking
- Mobile app (React Native)

### 🚀 Future Phase (v0.3.0+)
- IoT sensor integration
- Predictive analytics
- Blockchain for certifications
- Farmer marketplace
- Insurance integration

**[See Full Roadmap](./ROADMAP.md)**

---

## 👥 Contributors

We ❤️ our contributors! 

<a href="https://github.com/asheesh109/KisanAI/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=asheesh109/KisanAI" />
</a>

**Want to join?** [Start here!](./CONTRIBUTING.md)

---

## 🤝 Community

### Get Help
- 📖 [Documentation](./docs)
- 💬 [GitHub Discussions](https://github.com/asheesh109/KisanAI/discussions)
- 🐛 [Report Issues](https://github.com/asheesh109/KisanAI/issues)
- 💌 [Email Support](mailto:ashishparab03@gmail.com)

### Connect With Us
- 🐙 [GitHub](https://github.com/asheesh109/KisanAI)
- 🐦 [Twitter/X](https://x.com/ParabAshis49319)
- 💼 [LinkedIn](https://www.linkedin.com/in/ashish-parab-dev/)


### Code of Conduct
Please read our **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** - we are committed to providing a welcoming and inclusive environment.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

By contributing, you agree that your contributions will be licensed under its MIT License.

---

## 🙏 Acknowledgments

### Mentors & Advisors
- Special thanks to all GSSoC mentors
- Community moderators and code reviewers
- Agricultural domain experts

### Libraries & Resources
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Components
- [Google Gemini](https://ai.google.dev/) - AI Integration
- [ElevenLabs](https://elevenlabs.io/) - Voice API

---

## 📚 Additional Resources

- **[Getting Started Guide](./docs/SETUP.md)** - Detailed setup instructions
- **[Architecture Documentation](./docs/ARCHITECTURE.md)** - System design
- **[API Reference](./docs/API.md)** - Available endpoints
- **[Coding Standards](./docs/CODING_STANDARDS.md)** - Code style guide
- **[Testing Guide](./docs/TESTING.md)** - Testing practices
- **[Security Policy](./SECURITY.md)** - Reporting vulnerabilities

---

<div align="center">

### Made with ❤️ for Indian Farmers

**[⭐ Star us on GitHub](https://github.com/asheesh109/KisanAI)** if you find this project helpful!

[Contribute](./CONTRIBUTING.md) • [Discuss](https://github.com/asheesh109/KisanAI/discussions) • [Report Bug](https://github.com/asheesh109/KisanAI/issues) • [Request Feature](https://github.com/asheesh109/KisanAI/issues)

```
🌾 KisanAI - Empowering Farmers with AI 🚀
```

</div>
- **Production Ready**: Optimized build with zero errors

## 📖 Documentation

- [Product Requirements Document (PRD)](./PRD.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)

## 🤝 Contributing

This project is designed to help Indian farmers access technology and government benefits. Contributions are welcome!

## 📄 License

This project is developed as part of the Digital India initiative to empower farmers.

---

**Demo URL**: http://localhost:3001 (when running locally)  
**Status**: Phase 1 Complete - Ready for AI/ML Integration  
**Last Updated**: August 8, 2025

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
