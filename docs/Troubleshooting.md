# Troubleshooting Guide

This guide covers the most common issues contributors may encounter while setting up and developing **KisanAI**.

> **Note:** Before troubleshooting, ensure you have followed the setup instructions in **docs/SETUP.md** or **docs/LOCAL_SETUP.md**.

---

# Table of Contents

1. Node.js Version Issues
2. Dependency Installation Failures
3. Missing Environment Variables
4. MongoDB Connection Errors
5. API Key Configuration Issues
6. Development Server Not Starting
7. TypeScript Errors
8. Build Failures
9. Jest Test Failures
10. Case-Sensitive Import Errors

---

# 1. Node.js Version Issues

## Symptoms

* `npm install` fails.
* Unsupported engine or syntax errors.
* Next.js does not start.

## Solution

Verify your Node.js version:

```bash
node -v
npm -v
```

KisanAI requires:

* Node.js **18.0+**
* npm **9.0+**

If your version is outdated, install the latest LTS version from the official Node.js website.

---

# 2. Dependency Installation Failures

## Symptoms

* `npm install` exits with errors.
* Missing package messages.
* Dependency resolution failures.

## Solution

Remove existing dependencies and reinstall:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

For Windows PowerShell:

```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

---

# 3. Missing Environment Variables

## Symptoms

* API routes fail.
* AI features do not work.
* Runtime configuration errors.

## Solution

Create a `.env.local` file in the project root and configure the required environment variables.

Common variables used in this project include:

```text
MONGODB_URI
NEXT_PUBLIC_GEMINI_API_KEY
NEXT_PUBLIC_MARKET_API_KEY
NEXT_PUBLIC_MARKET_API_URL
NEXT_PUBLIC_OPENWEATHER_API_KEY
NEXT_PUBLIC_OPENROUTER_API_KEY
OPENROUTER_API_KEY
NEXT_PUBLIC_SITE_URL
```

After updating `.env.local`, restart the development server.

---

# 4. MongoDB Connection Errors

## Symptoms

* Database connection failures.
* Server returns database-related errors.

## Solution

Verify that `MONGODB_URI` is correctly configured inside `.env.local`.

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kisanai
```

Ensure:

* MongoDB server is accessible.
* Credentials are correct.
* Network access is allowed if using MongoDB Atlas.

---

# 5. API Key Configuration Issues

## Symptoms

* AI-powered features fail.
* Weather or market data is unavailable.

## Solution

Verify all required API keys inside `.env.local`.

Restart the development server after updating environment variables.

```bash
npm run dev
```

---

# 6. Development Server Not Starting

## Symptoms

* `npm run dev` exits unexpectedly.
* Browser cannot connect to localhost.

## Solution

Install dependencies again:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

If another application is using port 3000, stop that application or run the project on a different port.

---

# 7. TypeScript Errors

## Symptoms

* Compilation errors.
* IDE reports TypeScript issues.

## Solution

Run the TypeScript checker:

```bash
npm run type-check
```

Resolve reported errors before committing changes.

---

# 8. Build Failures

## Symptoms

* Production build fails.

## Solution

Run:

```bash
npm run build
```

Common causes include:

* Missing environment variables.
* TypeScript errors.
* Dependency issues.

Resolve these issues and rebuild.

---

# 9. Jest Test Failures

## Symptoms

* Unit tests fail.
* Coverage generation fails.

## Solution

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Review failing test output and ensure dependencies are installed correctly.

---

# 10. Case-Sensitive Import Errors

## Symptoms

* Project works on Windows but fails on Linux or CI.
* Module not found errors despite the file existing.

## Cause

Windows file systems are generally case-insensitive, while Linux-based systems used in CI are case-sensitive.

## Solution

Ensure every import matches the exact filename and folder name.

Correct example:

```ts
import Button from "@/components/Button";
```

Incorrect example:

```ts
import Button from "@/components/button";
```

---

# Useful Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Generate coverage
npm run test:coverage

# Type checking
npm run type-check

# Lint
npm run lint

# Production build
npm run build
```

---

# Still Need Help?

If the issue persists:

* Confirm your Node.js and npm versions.
* Verify your `.env.local` configuration.
* Review the setup instructions in `docs/SETUP.md` and `docs/LOCAL_SETUP.md`.
* Search existing GitHub Issues before creating a new issue.
* When reporting a problem, include:

  * Operating system
  * Node.js version
  * npm version
  * Error message
  * Steps to reproduce
