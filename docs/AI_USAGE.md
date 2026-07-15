# AI Usage and Cost Guidance

This document explains the AI services used in KisanAI, required environment variables, cost considerations, security recommendations, and best practices for contributors working on AI-powered features.

---

# Overview

KisanAI uses a combination of AI services and supporting APIs to provide intelligent assistance for farmers, including crop disease analysis, farming recommendations, government scheme guidance, voice interactions, and schedule planning.

The project currently integrates:

* Google Gemini
* OpenRouter
* ElevenLabs
* MyMemory Translation API
* OpenWeather API
* MongoDB

Contributors should understand the cost implications, security requirements, and development practices before modifying AI-related features.

---

# AI Services Used

## Google Gemini

### Gemini 2.5 Flash

Used in:

* Crop Disease Analysis
* Government Schemes Assistant
* Weather-Based Farming Advice

Files:

```text
src/app/crop-analysis/page.jsx
src/app/schemes/page.jsx
src/app/weather/page.jsx
```

Purpose:

* Crop diagnosis from images
* Agricultural recommendations
* Contextual farmer assistance
* Government scheme recommendations

### Gemini 2.0 Flash

Used in:

```text
src/app/kcc-application/page.jsx
```

Purpose:

* Kisan Credit Card (KCC) application assistance
* Conversational farmer support

---

## OpenRouter

Current model:

```text
openai/gpt-4o-mini
```

Used in:

```text
src/app/api/calendar/events/reschedule/route.ts
```

Purpose:

* AI-powered calendar event rescheduling
* Disaster and weather-response planning
* Agricultural scheduling recommendations

Current configuration:

```text
Temperature: 0.3
Max Tokens: 2048
Top P: 0.9
```

The implementation includes:

* API key validation
* Structured JSON responses
* Error handling
* Response validation

---

## MyMemory Translation API

Used in:

```text
src/lib/geminiTranslate.ts
```

Despite the filename, this service does not use Gemini.

Purpose:

* Multi-language translation
* Hindi
* Marathi
* Gujarati
* Malayalam

Advantages:

* Free
* No authentication required
* No token-based billing

---

## ElevenLabs

Purpose:

* Text-to-Speech (TTS)
* Voice assistant responses

Dependency:

```text
@elevenlabs/elevenlabs-js
```

Cost depends on:

* Audio generation volume
* Character usage
* Subscription plan

---

## OpenWeather API

Purpose:

* Weather forecasts
* Agricultural weather insights

Used together with AI-generated farming recommendations.

---

# Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kisanai

# Gemini
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Weather
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_weather_api_key

# Market Data
NEXT_PUBLIC_MARKET_API_KEY=your_market_api_key
NEXT_PUBLIC_MARKET_API_URL=your_market_api_url

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

# Development Setup

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Build production bundle:

```bash
npm run build
```

---

# Token Usage and Cost Considerations

Most AI providers charge based on token usage.

A token is a small unit of text processed by a model.

Cost generally increases with:

* Longer prompts
* Larger responses
* More requests
* Higher-capability models

---

## Cost Impact by Service

### Low Cost

* MyMemory Translation API
* Weather API requests
* Market price API requests

### Moderate Cost

* Gemini 2.0 Flash
* Gemini 2.5 Flash

### Variable Cost

* OpenRouter (depends on selected model)
* ElevenLabs (depends on audio generation volume)

---

# Cost Optimization Best Practices

Contributors should follow these practices during development:

## Use Minimal Prompts

Avoid sending unnecessary context.

Bad:

```text
Entire page content + user question
```

Good:

```text
Relevant farming context + user question
```

---

## Reduce Response Length

Request concise responses whenever possible.

Example:

```text
Provide advice in 3 bullet points.
```

---

## Avoid Duplicate Requests

Cache or reuse results when inputs have not changed.

Examples:

* Crop analysis results
* Scheme recommendations
* Weather advice

---

## Test with Small Inputs

Use shorter prompts while developing and debugging.

---

## Monitor API Usage

Review provider dashboards regularly:

* Gemini usage
* OpenRouter usage
* ElevenLabs usage

---

# Development vs Production Guidelines

## Development

Recommended:

* Use test datasets
* Use shorter prompts
* Avoid stress-testing paid APIs
* Log failures for debugging

Example:

```text
Generate brief farming advice.
```

---

## Production

Recommended:

* Monitor usage metrics
* Apply request limits
* Validate all user input
* Cache expensive operations
* Track API costs

---

# Security Best Practices

## Never Commit API Keys

Do not commit:

```env
OPENROUTER_API_KEY=abc123
```

Use:

```text
.env.local
```

and ensure it is ignored by Git.

---

## Protect Sensitive Keys

Current implementation uses some client-side variables such as:

```text
NEXT_PUBLIC_GEMINI_API_KEY
```

Important:

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

For production deployments, AI requests should preferably be routed through secure server-side API endpoints whenever possible.

---

## Validate User Input

Always validate:

* Uploaded files
* Prompt content
* Request payloads

before forwarding them to AI services.

---

## Do Not Log Secrets

Avoid logging:

* API keys
* Access tokens
* Authentication headers

---

# Error Handling

KisanAI already includes several good error-handling patterns.

## Missing API Keys

Example:

```text
Missing OPENROUTER_API_KEY environment variable
```

Recommended:

* Detect missing configuration early
* Return actionable messages

---

## Authentication Errors

Example:

```text
401 Unauthorized
```

Recommended response:

```text
Verify API key configuration.
```

---

## Rate Limits

Example:

```text
429 Too Many Requests
```

Recommended:

* Retry later
* Display user-friendly messages
* Avoid rapid repeated requests

---

## Invalid AI Responses

Always validate:

* JSON structure
* Required fields
* Response completeness

before using model output.

---

## Empty Responses

Handle cases where providers return:

```text
null
empty string
missing content
```

and provide fallback messaging.

---

# Rate Limiting Recommendations

Contributors adding new AI features should:

* Prevent excessive repeated requests
* Debounce user-triggered actions
* Cache responses where possible
* Limit expensive operations

Particularly important for:

* Voice assistant interactions
* Crop analysis uploads
* Government scheme generation
* Calendar rescheduling

---

# Contributor Guidelines

Before submitting AI-related pull requests:

## Verify Environment Variables

Confirm required keys are configured.

---

## Test Failure Scenarios

Check:

* Missing API key
* Invalid API key
* Network failure
* Empty response
* Rate limiting

---

## Consider Cost Impact

Ask:

* Does this feature increase API usage?
* Can requests be cached?
* Can prompts be shortened?
* Is a cheaper model sufficient?

---

## Keep AI Features Optional

Where practical:

* Provide graceful fallbacks
* Avoid breaking the application when AI services are unavailable

---

# Troubleshooting

## Gemini API Errors

Check:

```env
NEXT_PUBLIC_GEMINI_API_KEY
```

Verify:

* Key is valid
* API is enabled
* Billing/quota limits have not been exceeded

---

## OpenRouter Errors

Check:

```env
OPENROUTER_API_KEY
```

Verify:

* API key is valid
* Model is available
* Rate limits have not been exceeded

---

## ElevenLabs Errors

Verify:

```env
ELEVENLABS_API_KEY
```

and check account quotas.

---

## MongoDB Errors

Verify:

```env
MONGODB_URI
```

and ensure the database is reachable.

---

# Summary

KisanAI currently combines:

* Gemini 2.5 Flash
* Gemini 2.0 Flash
* OpenRouter (GPT-4o Mini)
* ElevenLabs
* MyMemory Translation API
* Weather and market data services

Contributors should prioritize:

* Cost efficiency
* Security
* Reliable error handling
* Responsible API usage
* Production-safe deployment practices

Following these guidelines helps keep KisanAI sustainable, secure, and contributor-friendly.
