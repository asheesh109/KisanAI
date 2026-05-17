# Local Setup

Follow these steps to set up a local development environment for KisanAI. Do not share secrets publicly.

## Requirements

- Node.js 18+ and npm 9+
- Optional: MongoDB local instance for full feature testing

## Quick Start

1. Clone the repository

```bash
git clone https://github.com/asheesh109/KisanAI.git
cd KisanAI
```

2. Copy environment variables

```bash
cp .env.example .env.local
# Fill in MONGODB_URI, NEXT_PUBLIC_... keys as needed
```

3. Install dependencies (locally)

```bash
npm install
```

4. Run the app

```bash
npm run dev
```

Notes:
- Developers should keep credentials in `.env.local` and never commit them.
- For AI provider keys, put them in environment variables and opt-in when testing.
# Local Development Setup

This file explains how contributors can run the project locally. Follow these steps on your machine.

1) Prerequisites
- Node.js (LTS)
- npm or yarn
- Optional: VS Code with recommended extensions

2) Steps
- Clone the repository
- Copy `.env.example` to `.env.local` and fill values
- Install dependencies (`npm ci` or `npm install`)
- Run development server (`npm run dev`)

Testing
- Run tests: `npm test`
- Lint: `npm run lint`
- Type-check: `npm run type-check`

Notes
- No credentials are committed. Use environment variables for any API keys.
