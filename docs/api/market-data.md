# Market Data API Reference

> **KisanAI** — Smart Market Analysis for Indian Agriculture
>
> This document is the authoritative API reference for all market data endpoints used by the KisanAI platform. It covers the upstream Government of India data source, the internal client-side API calls, and the utility functions exposed by `src/data/marketData.js`.
>
> **Maintainer:** asheesh109 | **Contact:** ashishparab03@gmail.com

---

## Table of Contents

1. [Overview](#overview)
2. [Base URL & Authentication](#base-url--authentication)
3. [Environment Variables](#environment-variables)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Endpoints](#endpoints)
   - [GET /api/market-prices — List Commodity Prices](#get-apimarket-prices--list-commodity-prices)
   - [GET /api/market-prices — Filter by Commodity](#get-apimarket-prices--filter-by-commodity)
   - [GET /api/market-prices — Fetch Available Commodities](#get-apimarket-prices--fetch-available-commodities)
6. [Client-Side Utility Functions](#client-side-utility-functions)
   - [fetchMarketPrices](#fetchmarketprices)
   - [fetchPriceHistory](#fetchpricehistory)
   - [createPriceAlert](#createpricealert)
   - [calculatePriceChange](#calculatepricechange)
   - [getDemandSupplyStatus](#getdemandsupplystatus)
   - [formatCurrency](#formatcurrency)
   - [formatVolume](#formatvolume)
   - [getCropCategories](#getcropcategories)
   - [getCropsByCategory](#getcropsbycategory)
   - [getMarketsByState](#getmarketsbystate)
   - [getQualityGrades](#getqualitygrades)
   - [getUnitTypes](#getunittypes)
7. [Data Models](#data-models)
   - [CropPrice](#cropprice)
   - [MarketRecord (Raw API Response)](#marketrecord-raw-api-response)
   - [Market](#market)
   - [PriceAlert](#pricealert)
   - [MarketInsight](#marketinsight)
   - [PriceAnalysis](#priceanalysis)
8. [Crop Categories & Commodities](#crop-categories--commodities)
9. [Supported States & Union Territories](#supported-states--union-territories)
10. [Error Handling & Fallback Strategy](#error-handling--fallback-strategy)
11. [Status Codes](#status-codes)
12. [Rate Limiting](#rate-limiting)
13. [Localization](#localization)
14. [Configuration Reference](#configuration-reference)
15. [Examples](#examples)

---

## Overview

KisanAI's market data layer fetches live commodity prices from the **Government of India Open Data Platform (data.gov.in)** — specifically the AGMARKNET (Agricultural Marketing Information Network) dataset, which aggregates official APMC (Agricultural Produce Market Committee) Mandi records.

The client (`src/app/market-prices/page.jsx`) calls the upstream API directly from the browser using environment-variable-injected credentials. A two-tier fallback strategy ensures the UI always displays useful data:

1. **Primary** — Live upstream API response.
2. **Secondary** — Curated static seed data (`staticMarketData` in `page.jsx`).
3. **Tertiary** — Procedurally generated mock prices (deterministic, category-aware).

---

## Base URL & Authentication

The upstream endpoint is the **AGMARKNET daily price feed** provided by the Government of India:

```
Base URL: https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
```

> **Note:** This URL is injected via the `NEXT_PUBLIC_MARKET_API_URL` environment variable. Do **not** hard-code it.

### Authentication

The API uses an **API key** passed as a query parameter:

| Parameter | Type   | Location      | Description                      |
|-----------|--------|---------------|----------------------------------|
| `api-key` | string | Query string  | Government data platform API key |

---

## Environment Variables

| Variable                        | Required | Description                                              | Example                                                                 |
|---------------------------------|----------|----------------------------------------------------------|-------------------------------------------------------------------------|
| `NEXT_PUBLIC_MARKET_API_URL`    | ✅ Yes   | Base URL for the AGMARKNET data feed                     | `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070` |
| `NEXT_PUBLIC_MARKET_API_KEY`    | ✅ Yes   | API key obtained from data.gov.in                        | `579b464db66ec23d318a35b7e...`                                          |

> **Obtaining an API key:** Register at [https://data.gov.in](https://data.gov.in), navigate to the AGMARKNET dataset, and generate an API key from your dashboard.

Add these to your `.env.local` file (never commit to version control):

```env
NEXT_PUBLIC_MARKET_API_URL=https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
NEXT_PUBLIC_MARKET_API_KEY=your_api_key_here
```

---

## Data Flow Architecture

```
Browser (Next.js Client Component)
        │
        ▼
┌────────────────────────────────────────────────────────┐
│  src/app/market-prices/page.jsx                        │
│  ┌──────────────────────┐  ┌───────────────────────┐  │
│  │ fetchAvailableCommodities│  │ loadCategoryData()    │  │
│  └──────────────────────┘  └───────────────────────┘  │
│            │                          │                 │
│            ▼                          ▼                 │
│   GET ${API_URL}?api-key=...  GET ${API_URL}?...&      │
│            limit=1000          filters[commodity]=...   │
└────────────────────┬───────────────────────────────────┘
                     │  HTTP (fetch)
                     ▼
        ┌─────────────────────────┐
        │  data.gov.in AGMARKNET  │
        │  (Live APMC Mandi Data) │
        └──────────┬──────────────┘
                   │ JSON response
                   ▼
        ┌─────────────────────────────────────┐
        │  Response Processing                │
        │  1. Parse records[]                 │
        │  2. Deduplicate by market+date      │
        │  3. Calculate price change & trend  │
        │  4. Apply i18n translations         │
        │  5. Fall back to static/mock data   │
        └─────────────────────────────────────┘
                   │
                   ▼
        marketPrices state → UI rendering
        analyzeMarketTrends() → AI recommendations
```

---

## Endpoints

### GET /api/market-prices — List Commodity Prices

Fetches live APMC market data for a specific commodity.

**URL Template:**

```
GET ${NEXT_PUBLIC_MARKET_API_URL}?api-key=${NEXT_PUBLIC_MARKET_API_KEY}&format=json&limit=50&filters[commodity]={commodity}
```

**Query Parameters:**

| Parameter              | Type    | Required | Default | Description                                              |
|------------------------|---------|----------|---------|----------------------------------------------------------|
| `api-key`              | string  | ✅ Yes   | —       | Your data.gov.in API key                                 |
| `format`               | string  | ✅ Yes   | `json`  | Response format. Always use `json`                       |
| `limit`                | integer | No       | `10`    | Maximum number of records to return (up to `1000`)       |
| `filters[commodity]`   | string  | No       | —       | URL-encoded commodity name (e.g., `Onion`, `Wheat`)      |
| `filters[state]`       | string  | No       | —       | Filter by state name (e.g., `Maharashtra`)               |
| `filters[district]`    | string  | No       | —       | Filter by district name                                  |
| `filters[market]`      | string  | No       | —       | Filter by market/mandi name                              |
| `filters[arrival_date]`| string  | No       | —       | Filter by arrival date (`YYYY-MM-DD` format)             |

**Example Request:**

```http
GET https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
    ?api-key=579b464db66ec23d318a35b7e
    &format=json
    &limit=50
    &filters[commodity]=Onion
```

**Example cURL:**

```bash
curl -X GET \
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070\
?api-key=YOUR_API_KEY\
&format=json\
&limit=50\
&filters%5Bcommodity%5D=Onion" \
  -H "Accept: application/json"
```

**Success Response — 200 OK:**

```json
{
  "updated_date": "2025-11-04",
  "created_date": "2015-07-01",
  "active": "1",
  "index_name": "agmarknet",
  "org": ["data.gov.in"],
  "org_type": "Central",
  "source": "AGMARKNET",
  "title": "Current Daily Price of Various Commodities from Various Markets",
  "description": "...",
  "visualizable": "1",
  "fields": [
    { "id": "id", "name": "id", "type": "keyword" },
    { "id": "state", "name": "state", "type": "keyword" },
    { "id": "district", "name": "district", "type": "keyword" },
    { "id": "market", "name": "market", "type": "keyword" },
    { "id": "commodity", "name": "commodity", "type": "keyword" },
    { "id": "variety", "name": "variety", "type": "keyword" },
    { "id": "grade", "name": "grade", "type": "keyword" },
    { "id": "arrival_date", "name": "arrival_date", "type": "date" },
    { "id": "min_price", "name": "min_price", "type": "double" },
    { "id": "max_price", "name": "max_price", "type": "double" },
    { "id": "modal_price", "name": "modal_price", "type": "double" },
    { "id": "arrivals_in_qtl", "name": "arrivals_in_qtl", "type": "double" }
  ],
  "count": 50,
  "total": 2847,
  "records": [
    {
      "id": "12345",
      "state": "Maharashtra",
      "district": "Pune",
      "market": "Pune",
      "commodity": "Onion",
      "variety": "General",
      "grade": "Medium",
      "arrival_date": "04/11/2025",
      "min_price": "4800",
      "max_price": "5400",
      "modal_price": "5127",
      "arrivals_in_qtl": "514.00"
    },
    {
      "id": "12346",
      "state": "Karnataka",
      "district": "Bangalore",
      "market": "Bangalore",
      "commodity": "Onion",
      "variety": "General",
      "grade": "Medium",
      "arrival_date": "04/11/2025",
      "min_price": "4700",
      "max_price": "5300",
      "modal_price": "5068",
      "arrivals_in_qtl": "910.00"
    }
  ]
}
```

---

### GET /api/market-prices — Filter by Commodity

Fetches data for a specific commodity in batches. The client loads crops in batches of 3 per category to avoid rate limiting.

**URL Template (Batch/Lazy Loading):**

```
GET ${NEXT_PUBLIC_MARKET_API_URL}?api-key=${API_KEY}&format=json&limit=20&filters[commodity]={commodity}
```

**Parameters:** Same as [List Commodity Prices](#get-apimarket-prices--list-commodity-prices) above.

**Batch Loading Behaviour:**

The client uses `Promise.allSettled()` to fetch 3 commodities in parallel per batch, with a 100 ms delay between batches to avoid throttling:

```js
const batchSize = 3
for (let i = 0; i < crops.length; i += batchSize) {
  const batch = crops.slice(i, i + batchSize)
  const batchResponses = await Promise.allSettled(
    batch.map(commodity =>
      fetch(`${API_URL}?api-key=${API_KEY}&format=json&limit=20&filters[commodity]=${encodeURIComponent(commodity)}`)
    )
  )
  // 100ms delay between batches
  if (i + batchSize < crops.length) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}
```

---

### GET /api/market-prices — Fetch Available Commodities

Used on initial page load to discover which commodities have data in the system.

**URL Template:**

```
GET ${NEXT_PUBLIC_MARKET_API_URL}?api-key=${API_KEY}&format=json&limit=1000
```

**Purpose:** Retrieves a large batch of records and extracts the unique `commodity` field values to build the list of available commodities.

**Example Request:**

```http
GET https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
    ?api-key=YOUR_API_KEY
    &format=json
    &limit=1000
```

**Processing Logic (Client-Side):**

```js
const uniqueCommodities = [...new Set(
  (data.records || [])
    .map(record => record.commodity)
    .filter(commodity => commodity && commodity.trim() !== '')
)].sort()
```

**Sample Response Fields:**

The same structure as above; after extraction the result is an alphabetically sorted `string[]`:

```json
["Apple", "Bajra", "Banana", "Barley", "Bengal Gram", "Black Gram", "Cabbage", "Carrot", ...]
```

---

## Client-Side Utility Functions

These functions are defined in [`src/data/marketData.js`](../src/data/marketData.js) and exported for use in components.

---

### `fetchMarketPrices`

Fetches market prices with optional filters. In the current implementation this function acts as a stub/placeholder — actual data fetching occurs directly in the page component via the upstream API.

**Signature:**

```ts
fetchMarketPrices(filters?: {
  crop?: string
  market?: string
  state?: string
}): Promise<CropPrice[]>
```

**Parameters:**

| Parameter        | Type   | Required | Description              |
|------------------|--------|----------|--------------------------|
| `filters`        | object | No       | Optional filter criteria |
| `filters.crop`   | string | No       | Crop name to filter by   |
| `filters.market` | string | No       | Market name to filter by |
| `filters.state`  | string | No       | State name to filter by  |

**Returns:** `Promise<CropPrice[]>` — Always resolves to `[]` in the current implementation (stub).

**Example:**

```js
import { fetchMarketPrices } from '@/data/marketData'

const prices = await fetchMarketPrices({ state: 'Maharashtra', crop: 'Onion' })
console.log(prices) // []  — placeholder; see page.jsx for live fetching
```

---

### `fetchPriceHistory`

Generates mock historical price data for a given crop over a specified number of days.

**Signature:**

```ts
fetchPriceHistory(cropId: number, days?: number): Promise<Array<{ date: string, price: number }>>
```

**Parameters:**

| Parameter | Type   | Required | Default | Description                          |
|-----------|--------|----------|---------|--------------------------------------|
| `cropId`  | number | ✅ Yes   | —       | Crop identifier                      |
| `days`    | number | No       | `30`    | Number of historical days to generate|

**Returns:** `Promise<Array<{ date: string, price: number }>>` — Array of daily price objects.

**Example:**

```js
import { fetchPriceHistory } from '@/data/marketData'

const history = await fetchPriceHistory(101, 7)
// [
//   { date: "2025-10-28", price: 2341 },
//   { date: "2025-10-29", price: 2187 },
//   ...
// ]
```

**Sample Response:**

```json
[
  { "date": "2025-10-28", "price": 2341 },
  { "date": "2025-10-29", "price": 2187 },
  { "date": "2025-10-30", "price": 2456 },
  { "date": "2025-10-31", "price": 2298 },
  { "date": "2025-11-01", "price": 2512 },
  { "date": "2025-11-02", "price": 2389 },
  { "date": "2025-11-03", "price": 2601 }
]
```

---

### `createPriceAlert`

Creates a new price alert for a crop. In the current implementation, this is a client-side simulation.

**Signature:**

```ts
createPriceAlert(alert: Omit<PriceAlert, 'id' | 'created'>): Promise<PriceAlert>
```

**Parameters:**

| Parameter             | Type                     | Required | Description                         |
|-----------------------|--------------------------|----------|-------------------------------------|
| `alert.crop`          | string                   | ✅ Yes   | Crop name                           |
| `alert.targetPrice`   | number                   | ✅ Yes   | Target price threshold              |
| `alert.currentPrice`  | number                   | ✅ Yes   | Current market price                |
| `alert.status`        | `'ऊपर'` \| `'नीचे'`     | ✅ Yes   | Alert status label                  |
| `alert.alertType`     | `'above'` \| `'below'`   | ✅ Yes   | Trigger when price goes above/below |

**Returns:** `Promise<PriceAlert>` — The created alert with `id` and `created` fields populated.

**Example:**

```js
import { createPriceAlert } from '@/data/marketData'

const alert = await createPriceAlert({
  crop: 'Onion',
  targetPrice: 5500,
  currentPrice: 5127,
  status: 'ऊपर',
  alertType: 'above'
})

// {
//   crop: "Onion",
//   targetPrice: 5500,
//   currentPrice: 5127,
//   status: "ऊपर",
//   alertType: "above",
//   id: 7842,
//   created: "4/11/2025"
// }
```

---

### `calculatePriceChange`

Calculates price change amount, percentage, and trend direction from two price points.

**Signature:**

```ts
calculatePriceChange(currentPrice: number, previousPrice: number): {
  change: string
  changePercent: string
  trending: 'up' | 'down'
}
```

**Parameters:**

| Parameter       | Type   | Required | Description            |
|-----------------|--------|----------|------------------------|
| `currentPrice`  | number | ✅ Yes   | Current price          |
| `previousPrice` | number | ✅ Yes   | Previous/minimum price |

**Returns:** Object with formatted change strings and trend direction.

**Example:**

```js
import { calculatePriceChange } from '@/data/marketData'

const result = calculatePriceChange(5127, 4927)
// { change: "+200", changePercent: "+4.1%", trending: "up" }

const result2 = calculatePriceChange(1800, 2100)
// { change: "-300", changePercent: "-14.3%", trending: "down" }
```

---

### `getDemandSupplyStatus`

Evaluates demand and supply levels on a 1–5 scale and generates a price forecast string.

**Signature:**

```ts
getDemandSupplyStatus(demand: number, supply: number): {
  demandLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  supplyLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  forecast: string
}
```

**Parameters:**

| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| `demand`  | number | ✅ Yes   | Demand score on a 1–5 scale    |
| `supply`  | number | ✅ Yes   | Supply score on a 1–5 scale    |

**Level Thresholds:**

| Score Range | Level      |
|-------------|------------|
| ≥ 4.5       | `very_high`|
| ≥ 3.5       | `high`     |
| ≥ 2.5       | `medium`   |
| ≥ 1.5       | `low`      |
| < 1.5       | `very_low` |

**Forecast Logic (Demand/Supply Ratio):**

| Ratio          | Forecast                           |
|----------------|------------------------------------|
| > 1.5          | तेजी से बढ़ने की संभावना (Strong rise) |
| 1.2 – 1.5      | बढ़ने की संभावना (Likely rise)       |
| 0.8 – 1.2      | स्थिर रहने की संभावना (Stable)        |
| 0.6 – 0.8      | गिरने की संभावना (Likely fall)       |
| < 0.6          | तेजी से गिरने की संभावना (Sharp fall)|

**Example:**

```js
import { getDemandSupplyStatus } from '@/data/marketData'

const status = getDemandSupplyStatus(4.0, 2.5)
// {
//   demandLevel: "high",
//   supplyLevel: "medium",
//   forecast: "बढ़ने की संभावना"
// }
```

---

### `formatCurrency`

Formats a number as Indian Rupee (INR) currency using the `hi-IN` locale.

**Signature:**

```ts
formatCurrency(amount: number): string
```

**Example:**

```js
import { formatCurrency } from '@/data/marketData'

formatCurrency(5127)  // "₹5,127"
formatCurrency(150000) // "₹1,50,000"
```

---

### `formatVolume`

Formats a quintal volume with appropriate unit suffix.

**Signature:**

```ts
formatVolume(volume: number): string
```

**Example:**

```js
import { formatVolume } from '@/data/marketData'

formatVolume(500)   // "500 क्विंटल"
formatVolume(1500)  // "1.5K क्विंटल"
```

---

### `getCropCategories`

Returns the list of supported crop category names (in Hindi).

**Signature:**

```ts
getCropCategories(): string[]
```

**Returns:**

```json
["अनाज", "दलहन", "तिलहन", "सब्जियां", "फल", "मसाले", "नकदी फसल", "चारा फसल"]
```

---

### `getCropsByCategory`

Returns all crops belonging to a given Hindi category name.

**Signature:**

```ts
getCropsByCategory(category: string): string[]
```

**Example:**

```js
import { getCropsByCategory } from '@/data/marketData'

getCropsByCategory('अनाज')
// ["गेहूं", "चावल", "मक्का", "बाजरा", "ज्वार"]

getCropsByCategory('सब्जियां')
// ["प्याज", "आलू", "टमाटर", "मिर्च", "बैंगन"]
```

---

### `getMarketsByState`

Returns a list of markets (mandis) for a given state name (Hindi).

**Signature:**

```ts
getMarketsByState(state: string): Market[]
```

**Supported States (currently seeded):** `दिल्ली`, `हरियाणा`

**Example:**

```js
import { getMarketsByState } from '@/data/marketData'

getMarketsByState('दिल्ली')
// [
//   {
//     name: "आज़ादपुर मंडी",
//     distance: "12 km",
//     crops: 35,
//     status: "खुला",
//     timing: "4:00 AM - 12:00 PM",
//     contact: "011-2358-7410"
//   },
//   {
//     name: "गाज़ीपुर मंडी",
//     distance: "18 km",
//     crops: 28,
//     status: "खुला",
//     timing: "5:00 AM - 1:00 PM",
//     contact: "011-2214-3625"
//   }
// ]
```

---

### `getQualityGrades`

Returns the list of all supported quality grade strings.

**Signature:**

```ts
getQualityGrades(): string[]
```

**Returns:**

```json
[
  "A1 Grade", "A Grade", "B Grade", "C Grade",
  "Premium", "Super Fine", "Fine", "Medium",
  "FAQ (Fair Average Quality)", "Below FAQ"
]
```

---

### `getUnitTypes`

Returns the list of all supported measurement unit types (in Hindi).

**Signature:**

```ts
getUnitTypes(): string[]
```

**Returns:**

```json
["प्रति क्विंटल", "प्रति टन", "प्रति किलो", "प्रति बोरी", "प्रति दर्जन", "प्रति पीस"]
```

---

## Data Models

### CropPrice

The normalized crop price object used throughout the UI after processing the raw API response.

```ts
interface CropPrice {
  /** Localized crop name (translated) */
  crop: string

  /** Original English crop name (used as a stable lookup key) */
  englishName: string

  /** Crop category key: 'vegetables' | 'spices' | 'grains' | 'pulses' | 'oilseeds' | 'fruits' | 'cashcrops' */
  category: string

  /** Modal (most common) price in INR per quintal */
  price: number

  /** Minimum price from the mandi record */
  minPrice: number

  /** Maximum price from the mandi record */
  maxPrice: number

  /** Formatted price change string e.g., "+200" or "-150" */
  change: string

  /** Formatted percentage change e.g., "+4.1%" or "-7.2%" */
  changePercent: string

  /** Market and district display name e.g., "Pune, Pune District" */
  market: string

  /** State name in English */
  state: string

  /** District name in English */
  district: string

  /** Unit label (localized) e.g., "Per Quintal" */
  unit: string

  /** Price trend direction */
  trending: 'up' | 'down'

  /** Crop variety e.g., "General", "Hybrid" */
  variety: string

  /** Quality grade e.g., "Medium", "A Grade" */
  grade: string

  /** Arrival date at the mandi (YYYY-MM-DD format) */
  arrivalDate: string

  /** Quantity arrived in quintals */
  quantity: number

  /** Whether this crop is currently considered a good profit opportunity (price > ₹3000/qtl) */
  goodProfit: boolean
}
```

---

### MarketRecord (Raw API Response)

The raw record object returned inside `response.records[]` from the AGMARKNET API.

```ts
interface MarketRecord {
  /** Internal record ID */
  id: string

  /** State name */
  state: string

  /** District name */
  district: string

  /** Market/Mandi name */
  market: string

  /** Commodity name in English */
  commodity: string

  /** Crop variety */
  variety: string

  /** Quality grade */
  grade: string

  /** Arrival date (format: DD/MM/YYYY from API) */
  arrival_date: string

  /** Minimum price (INR/quintal) as string */
  min_price: string

  /** Maximum price (INR/quintal) as string */
  max_price: string

  /** Modal price (INR/quintal) as string — most common price */
  modal_price: string

  /** Quantity arrived in quintals as string */
  arrivals_in_qtl: string
}
```

---

### Market

Represents a local market/mandi.

```ts
interface Market {
  /** Market/mandi name (Hindi) */
  name: string

  /** Distance from user's location */
  distance: string

  /** Number of active crop listings */
  crops: number

  /** Current market status */
  status: 'खुला' | 'बंद'

  /** Operating hours */
  timing: string

  /** Contact phone number */
  contact: string
}
```

---

### PriceAlert

Represents a user-defined price alert for a crop.

```ts
interface PriceAlert {
  /** Unique alert identifier */
  id: number

  /** Crop name */
  crop: string

  /** Target price threshold (INR) */
  targetPrice: number

  /** Current market price at time of creation (INR) */
  currentPrice: number

  /** Status label (Hindi) */
  status: 'ऊपर' | 'नीचे'

  /** Whether to trigger when price goes above or below the target */
  alertType: 'above' | 'below'

  /** Creation date (formatted in hi-IN locale) */
  created: string
}
```

---

### MarketInsight

Aggregated statistics for a single commodity, computed by `analyzeMarketTrends()`.

```ts
interface MarketInsight {
  /** Localized crop name */
  name: string

  /** English crop name */
  englishName: string

  /** Crop category */
  category: string

  /** All price points observed across markets */
  prices: number[]

  /** Set of states where the crop is available */
  states: Set<string>

  /** Total quantity (in qtl) across all markets */
  totalQuantity: number

  /** Average price across all markets */
  avgPrice: number

  /** Highest price observed */
  maxPrice: number

  /** Lowest price observed */
  minPrice: number

  /** Max − Min price spread */
  priceVariance: number

  /** Price volatility as percentage of average: (priceVariance / avgPrice) * 100 */
  volatility: string

  /** Demand score: totalQuantity × number of states */
  demandScore: number

  /** Profit potential score: (avgPrice/1000) × (totalQuantity/100) × stateCount */
  profitPotential: number
}
```

---

### PriceAnalysis

The complete analysis object returned by `analyzeMarketTrends()`.

```ts
interface PriceAnalysis {
  /** Top 10 crops by profit potential */
  highPriceItems: MarketInsight[]

  /** Top 10 crops by demand score */
  highDemandItems: MarketInsight[]

  /** Top 10 crops by price variance */
  priceVolatileItems: MarketInsight[]

  /** AI-generated farming recommendations grouped by type */
  recommendations: FarmingRecommendation[]
}

interface FarmingRecommendation {
  /** Recommendation type */
  type: 'profit' | 'seasonal' | 'demand' | 'nationwide' | 'lowrisk'

  /** Translated title */
  title: string

  /** Translated description */
  description: string

  /** Top crops for this recommendation */
  crops: MarketInsight[]

  /** Lucide icon component */
  icon: React.ComponentType

  /** Priority level */
  priority: 'high' | 'medium' | 'low'
}
```

---

## Crop Categories & Commodities

The following categories and their commodities are supported. Category keys are used throughout the API and UI.

| Category Key  | Display Name  | Season         | Profit Margin | Commodities                                                                                                                                                                                                                           |
|---------------|---------------|----------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `vegetables`  | Vegetables    | All Seasons    | High          | Onion, Potato, Tomato, Cabbage, Cauliflower, Carrot, Radish, Brinjal, Lady Finger, Green Chilli, Spinach, Bitter Gourd, Bottle Gourd, Ridge Gourd, Snake Gourd, Pumpkin, Cucumber, Green Peas, French Beans, Cluster Beans, Drumstick, Capsicum, Sweet Potato, Beetroot, Turnip, Green Beans, Plantain |
| `spices`      | Spices        | Rabi/Kharif    | Very High     | Turmeric, Chilli, Coriander, Garlic, Ginger, Fenugreek, Mint, Tamarind, Black Pepper, Cardamom, Clove, Nutmeg, Cinnamon, Cumin, Fennel, Ajwain, Asafoetida                                                                           |
| `grains`      | Grains        | Rabi/Kharif    | Medium        | Wheat, Rice, Maize, Bajra, Jowar, Barley, Ragi, Foxtail Millet, Pearl Millet, Finger Millet                                                                                                                                          |
| `pulses`      | Pulses        | Rabi/Kharif    | High          | Black Gram, Green Gram, Red Gram, Bengal Gram, Field Pea, Lentil, Cowpea, Horse Gram, Kidney Beans, Soyabean                                                                                                                          |
| `oilseeds`    | Oilseeds      | Rabi/Kharif    | High          | Groundnut, Mustard, Sesame, Sunflower, Safflower, Castor, Niger, Linseed, Coconut, Palm Oil                                                                                                                                           |
| `fruits`      | Fruits        | Perennial      | Very High     | Banana, Apple, Orange, Mango, Grapes, Papaya, Lemon, Pomegranate, Guava, Pineapple, Watermelon, Muskmelon, Jackfruit, Custard Apple, Dates                                                                                           |
| `cashcrops`   | Cash Crops    | Kharif/Rabi    | Very High     | Cotton, Sugarcane, Tobacco, Jute, Tea, Coffee, Rubber, Indigo                                                                                                                                                                         |

---

## Supported States & Union Territories

The API supports all 28 Indian states and 8 Union Territories:

| States                | States (cont.)     | Union Territories             |
|-----------------------|--------------------|-------------------------------|
| Andhra Pradesh        | Nagaland           | Delhi                         |
| Arunachal Pradesh     | Odisha             | Jammu and Kashmir             |
| Assam                 | Punjab             | Ladakh                        |
| Bihar                 | Rajasthan          | Puducherry                    |
| Chhattisgarh          | Sikkim             | Chandigarh                    |
| Goa                   | Tamil Nadu         | Andaman and Nicobar Islands   |
| Gujarat               | Telangana          | Dadra and Nagar Haveli and Daman and Diu |
| Haryana               | Tripura            | Lakshadweep                   |
| Himachal Pradesh      | Uttar Pradesh      |                               |
| Jharkhand             | Uttarakhand        |                               |
| Karnataka             | West Bengal        |                               |
| Kerala                |                    |                               |
| Madhya Pradesh        |                    |                               |
| Maharashtra           |                    |                               |
| Manipur               |                    |                               |
| Meghalaya             |                    |                               |
| Mizoram               |                    |                               |

---

## Error Handling & Fallback Strategy

The market data layer implements a **three-tier fallback** to ensure the UI is never empty:

```
Tier 1 (Primary): Live upstream API
        │ Failed or empty response?
        ▼
Tier 2 (Static): Curated staticMarketData seed (page.jsx)
        │ No static entry for this commodity?
        ▼
Tier 3 (Mock): generateMockPrices() — deterministic pseudo-random data
```

### Error States & UI Behaviour

| Condition                         | Behaviour                                               | `usingFallback` |
|-----------------------------------|---------------------------------------------------------|-----------------|
| API returns `200` with records    | Display live data; no fallback notification             | `false`         |
| API returns `200` with `[]`       | Use static/mock data; show fallback notification banner | `true`          |
| API returns non-200 HTTP error    | Use static/mock data; show fallback notification banner | `true`          |
| JSON parse error                  | Use static/mock data; show fallback notification banner | `true`          |
| Network timeout / offline         | Use static/mock data; show fallback notification banner | `true`          |

### Fallback Notification (Localized)

When `usingFallback` is `true`, the UI displays:

> _"Using sample data due to temporary connectivity issues. Please ensure a stable network connection for real-time market data."_

---

## Status Codes

| HTTP Status | Meaning                                        | Client Behaviour                    |
|-------------|------------------------------------------------|-------------------------------------|
| `200 OK`    | Successful response                            | Process `records[]` array           |
| `400`       | Bad request (invalid parameters)               | Log warning; fall back to static    |
| `401`       | Unauthorized (invalid/missing API key)         | Log error; fall back to static      |
| `403`       | Forbidden (API key quota exceeded)             | Log error; fall back to static      |
| `404`       | Resource not found                             | Fall back to static                 |
| `429`       | Too many requests (rate limited)               | Back off; fall back to static       |
| `500`       | Server error on data.gov.in                    | Fall back to static                 |

---

## Rate Limiting

The data.gov.in API does not publish an official rate limit, but the following best practices are implemented in KisanAI:

- **Batch size:** 3 commodities fetched in parallel per batch.
- **Inter-batch delay:** 100 ms between batches.
- **Max records per request:** `limit=50` for commodity-specific queries; `limit=1000` for commodity discovery.
- **Graceful degradation:** Any failed request automatically falls back without blocking UI.

---

## Localization

All user-facing strings, crop names, and category labels are fully localized. The following language codes are supported:

| Code | Language   | Locale    |
|------|------------|-----------|
| `en` | English    | `en-IN`   |
| `hi` | Hindi      | `hi-IN`   |
| `mr` | Marathi    | `mr-IN`   |
| `gu` | Gujarati   | `gu-IN`   |
| `ml` | Malayalam  | `ml-IN`   |

The `useLanguage()` context hook (from `@/contexts/LanguageContext`) provides the active language. Commodity names are translated using the `commodityNames` map; UI strings use the `translations` map. Both are keyed by language code.

---

## Configuration Reference

Defined in `src/data/marketData.js` as `marketConfig`:

```js
const marketConfig = {
  // Auto-refresh interval in milliseconds
  refreshInterval: 30000,

  // Price alert value boundaries (INR)
  priceAlertLimits: {
    min: 10,
    max: 100000
  },

  // States with seeded mandi data (expandable)
  supportedStates: [
    'दिल्ली', 'हरियाणा', 'पंजाब', 'उत्तर प्रदेश',
    'राजस्थान', 'मध्य प्रदेश', 'गुजरात', 'महाराष्ट्र'
  ],

  // Default UI filter/sort settings
  defaultFilters: {
    sortBy: 'name',
    viewMode: 'grid',
    showOnlyActive: true
  }
}
```

### Season Detection

The active agricultural season is determined by the current calendar month:

| Months          | Season  | Example Crops                       |
|-----------------|---------|-------------------------------------|
| June – October  | Kharif  | Rice, Maize, Cotton, Sugarcane      |
| November – March| Rabi    | Wheat, Barley, Mustard, Chickpea    |
| April – May     | Zaid    | Vegetables, Fruits, Watermelon      |

---

## Examples

### Example 1: Fetch Onion Prices Across All Markets

```js
const API_KEY  = process.env.NEXT_PUBLIC_MARKET_API_KEY
const API_URL  = process.env.NEXT_PUBLIC_MARKET_API_URL

async function getOnionPrices() {
  const url = `${API_URL}?api-key=${API_KEY}&format=json&limit=50&filters[commodity]=Onion`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const data = await response.json()
  return data.records.map(record => ({
    market:     record.market,
    state:      record.state,
    district:   record.district,
    modalPrice: parseFloat(record.modal_price),
    minPrice:   parseFloat(record.min_price),
    maxPrice:   parseFloat(record.max_price),
    arrivedOn:  record.arrival_date,
    quantity:   parseFloat(record.arrivals_in_qtl)
  }))
}
```

**Sample Output:**

```json
[
  {
    "market": "Pune",
    "state": "Maharashtra",
    "district": "Pune",
    "modalPrice": 5127,
    "minPrice": 4800,
    "maxPrice": 5400,
    "arrivedOn": "04/11/2025",
    "quantity": 514
  },
  {
    "market": "Bangalore",
    "state": "Karnataka",
    "district": "Bangalore",
    "modalPrice": 5068,
    "minPrice": 4700,
    "maxPrice": 5300,
    "arrivedOn": "04/11/2025",
    "quantity": 910
  }
]
```

---

### Example 2: Discover All Available Commodities

```js
async function getAvailableCommodities() {
  const url = `${API_URL}?api-key=${API_KEY}&format=json&limit=1000`
  const response = await fetch(url)
  const data = await response.json()

  return [...new Set(
    (data.records || [])
      .map(r => r.commodity)
      .filter(Boolean)
  )].sort()
}

// Returns: ["Apple", "Bajra", "Banana", "Barley", "Bengal Gram", ...]
```

---

### Example 3: Calculate Price Change and Format Output

```js
import {
  calculatePriceChange,
  getDemandSupplyStatus,
  formatCurrency
} from '@/data/marketData'

const { change, changePercent, trending } = calculatePriceChange(5127, 4927)
// change: "+200", changePercent: "+4.1%", trending: "up"

const { demandLevel, supplyLevel, forecast } = getDemandSupplyStatus(4.2, 2.8)
// demandLevel: "high", supplyLevel: "medium", forecast: "बढ़ने की संभावना"

const formatted = formatCurrency(5127)
// "₹5,127"
```

---

### Example 4: Batch Loading with Fallback

The pattern used inside `loadCategoryData()` for lazy loading:

```js
const batchSize = 3
const crops = ['Wheat', 'Rice', 'Maize', 'Bajra', 'Jowar', 'Barley']

for (let i = 0; i < crops.length; i += batchSize) {
  const batch = crops.slice(i, i + batchSize)

  const results = await Promise.allSettled(
    batch.map(commodity =>
      fetch(`${API_URL}?api-key=${API_KEY}&format=json&limit=20&filters[commodity]=${encodeURIComponent(commodity)}`)
        .then(r => r.json())
        .then(data => ({ commodity, records: data.records || [] }))
        .catch(() => ({ commodity, records: [] })) // silent fallback
    )
  )

  results.forEach(result => {
    if (result.status === 'fulfilled') {
      const { commodity, records } = result.value
      if (records.length > 0) {
        // Process live records ...
      } else {
        // Use staticMarketData or generateMockPrices() ...
      }
    }
  })

  // Throttle: 100ms pause between batches
  if (i + batchSize < crops.length) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}
```

---

### Example 5: Error Response

When the API key is invalid or quota exceeded:

```json
{
  "message": "Forbidden",
  "status": 403
}
```

The client handles this via `response.ok` check:

```js
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`)
  // Falls through to catch → uses staticMarketData / generateMockPrices
}
```

---

> **Disclaimer:** Price information is based on government APMC data and AI analysis. Always verify current prices directly from your local mandi before making selling decisions.
>
> **Source:** Government of India Open Data Platform — [data.gov.in AGMARKNET](https://data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi)
>
> **Last Updated:** 2026-07-15 | **Maintained by:** [@asheesh109](https://github.com/asheesh109)
