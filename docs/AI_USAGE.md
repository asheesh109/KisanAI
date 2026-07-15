# AI Usage Guide

## Overview

KisanAI leverages AI and external APIs to provide agricultural assistance, including crop analysis, weather information, market prices, and farmer support services.

---

## AI Models and Services Used

| Service | Purpose |
|--------|--------|
| Google Gemini | Crop analysis, schemes assistance, KCC application support, and AI-powered responses. |
| OpenRouter | Additional AI integrations and conversational capabilities. |
| OpenWeather API | Fetches weather information for users. |
| Market API | Retrieves agricultural market prices. |
| MongoDB | Stores application data and user-related information. |

---

## Environment Variables

| Variable | Description |
|---------|-------------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | API key for accessing Google Gemini services. |
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | API key for OpenRouter integration. |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | API key for weather data retrieval. |
| `NEXT_PUBLIC_MARKET_API_KEY` | API key for market price services. |
| `NEXT_PUBLIC_MARKET_API_URL` | Endpoint URL for market data APIs. |
| `MONGODB_URI` | MongoDB connection string. |
| `MONGODB_PASSWORD` | Password used for MongoDB authentication. |
| `NEXT_PUBLIC_SITE_URL` | Base URL of the application. |
| `NODE_ENV` | Specifies whether the application runs in development or production mode. |

---

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_key
NEXT_PUBLIC_OPENROUTER_API_KEY=your_key
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key
NEXT_PUBLIC_MARKET_API_KEY=your_key
NEXT_PUBLIC_MARKET_API_URL=your_url
MONGODB_URI=your_mongodb_uri
MONGODB_PASSWORD=your_password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Start the development server:

```bash
npm run dev
```

---

## Token Usage and API Cost Considerations

AI providers charge based on token consumption.

- Input tokens represent user prompts.
- Output tokens represent AI-generated responses.
- Longer prompts and responses increase costs.
- Image analysis generally consumes more tokens than text-only requests.

### Recommendations

- Keep prompts concise.
- Limit response length where possible.
- Reuse cached responses.
- Avoid unnecessary AI requests during development.

---

## Development Best Practices

- Use test API keys whenever possible.
- Mock API responses for repetitive testing.
- Test with small prompts.
- Monitor token usage frequently.
- Enable debug logs only during development.

---

## Production Best Practices

- Implement rate limiting.
- Monitor API quotas.
- Store secrets securely.
- Use centralized logging.
- Add retry mechanisms for failed requests.
- Regularly review API usage patterns.

---

## Error Handling

Contributors should handle:

- Invalid API keys.
- Network failures.
- API timeouts.
- Rate limit errors.
- Quota exceeded errors.
- MongoDB connection failures.

Example:

```javascript
try {
    const response = await fetchData();
} catch (error) {
    console.error("Service unavailable:", error);
}
```

---

## Rate Limiting Recommendations

| Environment | Suggested Limit |
|------------|----------------|
| Development | 10 requests/minute |
| Production | 60 requests/minute |

Implement exponential backoff for repeated failures.

---

## Security Considerations

- Never commit `.env.local` or API keys.
- Ensure `.env*` files are listed in `.gitignore`.
- Avoid exposing secrets in client-side code whenever possible.
- Rotate compromised API keys immediately.
- Use HTTPS in production environments.
- Restrict database access to trusted IP addresses.

---

## Troubleshooting

### Invalid API Key

- Verify values in `.env.local`.
- Restart the development server.

### MongoDB Connection Issues

- Verify `MONGODB_URI`.
- Ensure the database is accessible.

### Quota Exceeded

- Check the provider dashboard.
- Wait for quota reset or upgrade your plan.

### Build Failures

```bash
npm run build
```

Review any missing environment variables reported during the build process.

---

## Contributor Notes

Before submitting a pull request:

- Verify all required environment variables are documented.
- Avoid hardcoding API keys.
- Test changes locally.
- Ensure documentation remains up to date as new AI services are introduced.