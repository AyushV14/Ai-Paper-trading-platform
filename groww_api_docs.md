# Groww Stock Market API Documentation

## Index

1. [Market Timing API](#1-market-timing-api)
2. [Live Stock Prices API](#2-live-stock-prices-api)
3. [Company Information API](#3-company-information-api)
4. [Market Explore Lists API](#4-market-explore-lists-api)
5. [Index Data API](#5-index-data-api)
6. [Search API](#6-search-api)
7. [Market Trends API](#7-market-trends-api)
8. [Charting Service API](#8-charting-service-api)
9. [News API](#9-news-api)

---

## 1. Market Timing API

**Title:** Market Timing Information

**About the API:** Provides market opening and closing times for different dates, including pre-open session timings.

**API Endpoint:** 
```
GET https://groww.in/v1/api/stocks_data/v1/market/market_timing
```

**Parameters:** None

**Response:**
```json
{
  "dateMarketTimeMap": {
    "2025-07-28": {
      "marketOpenTime": "09:15:00",
      "marketCloseTime": "15:30:00",
      "preOpenStartTime": "09:00:00",
      "preOpenEndTime": "09:07:00"
    }
  }
}
```

---

## 2. Live Stock Prices API

**Title:** Real-time Stock Price Data

**About the API:** Fetches live trading data for specific stocks including current price, day change, volume, and price ranges.

**API Endpoint:** 
```
GET https://groww.in/v1/api/stocks_data/v1/tr_live_prices/exchange/{EXCHANGE}/segment/{SEGMENT}/{SYMBOL}/latest
```

**Parameters:**
- `EXCHANGE`: NSE, BSE
- `SEGMENT`: CASH, F&O
- `SYMBOL`: Stock symbol (e.g., TATAMOTORS, WIPRO, RELIANCE)

**Example:**
```
GET https://groww.in/v1/api/stocks_data/v1/tr_live_prices/exchange/NSE/segment/CASH/TATAMOTORS/latest
```

**Response:**
```json
{
  "close": 681.7,
  "dayChange": -1.45,
  "dayChangePerc": -0.212703535279455,
  "high": 686,
  "highPriceRange": 748.25,
  "low": 675.8,
  "lowPriceRange": 614.85,
  "ltp": 680.25,
  "open": 683,
  "prevOpenInterest": null,
  "symbol": "TATAMOTORS",
  "totalBuyQty": 362,
  "totalSellQty": 681,
  "tsInMillis": 1752777000,
  "volume": 5558670,
  "yearHighPrice": 0,
  "yearLowPrice": 0,
  "type": "LIVE_PRICE"
}
```

---

## 3. Company Information API

**Title:** Company Header and Details

**About the API:** Retrieves comprehensive company information including basic details, trading symbols, and corporate data.

**API Endpoint:** 
```
GET https://groww.in/v1/api/stocks_data/v1/company/search_id/{SEARCH_ID}?fields={FIELDS}
```

**Parameters:**
- `SEARCH_ID`: Company search identifier (e.g., tata-motors-ltd, nifty)
- `fields`: COMPANY_HEADER, COMPANY_DETAILS (optional)
- `page`: Page number for paginated results (default: 0)
- `size`: Number of results per page (default: 6)

**Examples:**
```
GET https://groww.in/v1/api/stocks_data/v1/company/search_id/tata-motors-ltd?fields=COMPANY_HEADER
GET https://groww.in/v1/api/stocks_data/v1/company/search_id/nifty?page=0&size=6
```

**Response:**
```json
{
  "header": {
    "searchId": "tata-motors-ltd",
    "growwCompanyId": "GSTK500570",
    "isin": "INE155A01022",
    "industryId": 5,
    "industryName": "Automobile",
    "displayName": "Tata Motors",
    "shortName": "Tata Motors",
    "type": "STOCK",
    "isFnoEnabled": true,
    "nseScriptCode": "TATAMOTORS",
    "bseScriptCode": "500570",
    "nseTradingSymbol": "TATAMOTORS-EQ",
    "bseTradingSymbol": "TATAMOTORS",
    "isBseTradable": true,
    "isNseTradable": true,
    "logoUrl": "https://assets-netstorage.groww.in/stock-assets/logos2/TATAMOTORS.webp",
    "floatingShares": 1723596078,
    "isBseFnoEnabled": false,
    "isNseFnoEnabled": true
  }
}
```

---

## 4. Market Explore Lists API

**Title:** Market Discovery and Trending Stocks

**About the API:** Provides categorized lists of stocks including top gainers, losers, most valuable stocks, and trending stocks.

**API Endpoint:** 
```
GET https://groww.in/v1/api/stocks_data/v2/explore/list/top
```

**Parameters:**
- `discoveryFilterTypes`: Comma-separated list of categories
  - `TOP_GAINERS`
  - `TOP_LOSERS`
  - `STOCKS_IN_NEWS`
  - `MOST_VALUABLE`
  - `POPULAR_STOCKS_MOST_BOUGHT_BY_TURNOVER`
  - `POPULAR_STOCKS_MOST_BOUGHT_MTF`
- `page`: Page number (default: 0)
- `size`: Number of results per category (default: 5)

**Example:**
```
GET https://groww.in/v1/api/stocks_data/v2/explore/list/top?discoveryFilterTypes=TOP_GAINERS%2CTOP_LOSERS%2CSTOCKS_IN_NEWS&page=0&size=5
```

**Response:**
```json
{
  "exploreCompanies": {
    "TOP_GAINERS": [
      {
        "company": {
          "isin": "INE075A01022",
          "growwContractId": "GSTK507685",
          "companyName": "Wipro",
          "searchId": "wipro-ltd",
          "nseScriptCode": "WIPRO",
          "companyShortName": "Wipro",
          "bseScriptCode": "507685",
          "imageUrl": "https://assets-netstorage.groww.in/stock-assets/logos2/WIPRO.webp"
        },
        "stats": {
          "type": "LIVE_PRICE",
          "high": 271.9,
          "low": 265.6,
          "close": 260.6,
          "ltp": 266.95,
          "dayChange": 6.35,
          "dayChangePerc": 2.44,
          "lowPriceRange": 240.25,
          "highPriceRange": 293.6
        }
      }
    ]
  }
}
```

---

## 5. Index Data API

**Title:** Index Information and Constituents

**About the API:** Provides index details, constituent stocks, and financial data for market indices like NIFTY 50.

**API Endpoint:** 
```
GET https://groww.in/v1/api/stocks_data/v1/company/search_id/{INDEX_ID}
```

**Parameters:**
- `INDEX_ID`: Index identifier (e.g., nifty, sensex)
- `page`: Page number (default: 0)
- `size`: Number of constituents to return (default: 6)

**Example:**
```
GET https://groww.in/v1/api/stocks_data/v1/company/search_id/nifty?page=0&size=6
```

**Response:** Contains index header, details, price data, and child assets (constituent stocks)

---

## 6. Search API

**Title:** Global Stock and Securities Search

**About the API:** Global search functionality for stocks, options, indices, and other securities.

**API Endpoint:** 
```
GET https://groww.in/v1/api/search/v3/query/global/st_query
```

**Parameters:**
- `query`: Search term (e.g., "rel" for Reliance)
- `from`: Starting index (default: 0)
- `size`: Number of results (default: 20, max: 50)
- `web`: Boolean flag for web search (default: true)

**Example:**
```
GET https://groww.in/v1/api/search/v3/query/global/st_query?from=0&query=rel&size=20&web=true
```

**Response:**
```json
{
  "data": {
    "content": [
      {
        "entity_type": "Stocks",
        "id": "reliance-industries-ltd",
        "title": "Reliance Industries",
        "isin": "INE002A01018",
        "nse_scrip_code": "RELIANCE",
        "bse_scrip_code": "500325",
        "groww_contract_id": "GSTK500325",
        "search_id": "reliance-industries-ltd"
      }
    ]
  }
}
```

---

## 7. Market Trends API

**Title:** Index-specific Market Trends

**About the API:** Provides trending stocks within specific indices with filtering options.

**API Endpoint:** 
```
GET https://groww.in/v1/api/stocks_data/explore/v2/indices/{INDEX_ID}/market_trends
```

**Parameters:**
- `INDEX_ID`: Index identifier (e.g., GIDXNIFTY100, GIDXNIFTY50)
- `discovery_filter_types`: Filter categories
  - `TOP_GAINERS`
  - `TOP_LOSERS`
  - `TRADED_BY_VOLUME`
  - `MOST_ACTIVE`
- `size`: Number of results (default: 5, max: 50)

**Examples:**
```
GET https://groww.in/v1/api/stocks_data/explore/v2/indices/GIDXNIFTY100/market_trends?discovery_filter_types=TOP_GAINERS&size=5
GET https://groww.in/v1/api/stocks_data/explore/v2/indices/GIDXNIFTY100/market_trends?discovery_filter_types=TOP_LOSERS&size=5
GET https://groww.in/v1/api/stocks_data/explore/v2/indices/GIDXNIFTY100/market_trends?discovery_filter_types=TRADED_BY_VOLUME&size=20
```

**Response:**
```json
{
  "categoryResponseMap": {
    "TOP_GAINERS": {
      "items": [
        {
          "gsin": "GSTK507685",
          "company": {
            "isin": "INE075A01022",
            "companyName": "Wipro",
            "searchId": "wipro-ltd",
            "nseScriptCode": "WIPRO",
            "companyShortName": "Wipro"
          },
          "stats": {
            "ltp": 266.95,
            "close": 260.6,
            "dayChange": 6.35,
            "dayChangePerc": 2.44
          }
        }
      ]
    }
  }
}
```

---

## 8. Charting Service API

**Title:** Historical Price Data and Charts

**About the API:** Provides candlestick data for different time periods and intervals for technical analysis.

**API Endpoint:** 
```
GET https://groww.in/v1/api/charting_service/v2/chart/exchange/{EXCHANGE}/segment/{SEGMENT}/{SYMBOL}/{PERIOD}
```

**Parameters:**
- `EXCHANGE`: NSE, BSE
- `SEGMENT`: CASH, F&O
- `SYMBOL`: Stock/Index symbol
- `PERIOD`: Time period options
  - `daily` - Daily data
  - `weekly` - Weekly data
  - `monthly` - Monthly data
  - `monthly/v2` - Monthly data with months parameter
  - `1y` - 1 year data
  - `5y` - 5 years data
  - `all` - All available historical data
- `intervalInMinutes`: Data interval (1, 5, 15, 30, 60)
- `intervalInDays`: Data interval in days (1, 5, 7)
- `months`: Number of months (for monthly/v2 endpoint: 3, 6, 12)
- `minimal`: Boolean flag for minimal response (default: true)
- `noOfCandles`: Number of candles to return

**Examples:**
```
GET https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/NIFTY/daily?intervalInMinutes=1&minimal=true
GET https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/WIPRO/weekly?intervalInMinutes=5&minimal=true
GET https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/WIPRO/monthly?intervalInMinutes=30&minimal=true
GET https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/WIPRO/monthly/v2?months=3&minimal=true
GET https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/WIPRO/1y?intervalInDays=1&minimal=true
GET https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/WIPRO/5y?intervalInDays=5&minimal=true
GET https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/WIPRO/all?noOfCandles=1000
```

**Response (Minimal):**
```json
{
  "candles": [
    [1752810300, 25115.85],
    [1752810360, 25100.7],
    [1752810420, 25092.7]
  ],
  "changeValue": null,
  "changePerc": null,
  "closingPrice": null,
  "startTimeEpochInMillis": 0
}
```

**Response (Full with OHLCV):**
```json
{
  "candles": [
    [timestamp, open, high, low, close, volume],
    [1027017000, 47.32, 56.99, 39.85, 50.93, 46898113]
  ],
  "changeValue": 219.63,
  "changePerc": 4.64,
  "closingPrice": 47.32,
  "startTimeEpochInMillis": 0
}
```

---

## 9. News API

**Title:** Stock-specific News and Updates

**About the API:** Retrieves latest news articles and updates for specific stocks or companies.

**API Endpoint:** 
```
GET https://groww.in/v1/api/groww-news/v2/stocks/news/{GROWW_CONTRACT_ID}
```

**Parameters:**
- `GROWW_CONTRACT_ID`: Groww contract identifier (e.g., GSTK507685 for Wipro)
- `page`: Page number for pagination (default: 0)
- `size`: Number of news articles per page (default: 10, max: 50)

**Examples:**
```
GET https://groww.in/v1/api/groww-news/v2/stocks/news/GSTK507685?page=0&size=10
GET https://groww.in/v1/api/groww-news/v2/stocks/news/GSTK507685?page=1&size=20
```

**Response:**
```json
{
  "results": [
    {
      "id": "733945196558837248",
      "title": "Wipro gains despite muted quarter as management projects stronger H2 growth.",
      "summary": "Wipro gains despite muted quarter as management projects stronger H2 growth.",
      "url": "https://sqst.in/Po8Ts",
      "imageUrl": null,
      "pubDate": "2025-07-18T12:46:10",
      "source": "ScoutQuest"
    }
  ]
}
```

---

## Common Response Fields

### Stock Stats Object
```json
{
  "ltp": "Last Traded Price",
  "close": "Previous close price",
  "open": "Opening price",
  "high": "Day's high price",
  "low": "Day's low price",
  "dayChange": "Absolute price change",
  "dayChangePerc": "Percentage price change",
  "volume": "Trading volume",
  "yearHighPrice": "52-week high",
  "yearLowPrice": "52-week low",
  "highPriceRange": "Upper circuit limit",
  "lowPriceRange": "Lower circuit limit"
}
```

### Company Header Object
```json
{
  "searchId": "URL-friendly identifier",
  "growwCompanyId": "Groww internal company ID",
  "isin": "International Securities ID",
  "displayName": "Full company name",
  "shortName": "Short company name",
  "nseScriptCode": "NSE trading symbol",
  "bseScriptCode": "BSE trading symbol",
  "logoUrl": "Company logo URL",
  "isFnoEnabled": "F&O trading enabled flag"
}
```

---

## Error Handling

Most APIs return standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (invalid symbol/ID)
- `500`: Internal Server Error

Always check the response status and handle errors appropriately in your application.

---

## Rate Limiting

- APIs may have rate limiting in place
- Implement proper retry logic with exponential backoff
- Cache responses when appropriate to reduce API calls
- Use minimal=true parameter for charting APIs when full OHLCV data is not needed

---

## Notes

1. All timestamps are in epoch milliseconds
2. Price values are in INR (Indian Rupees)
3. Percentage values are in decimal format (e.g., 2.44 represents 2.44%)
4. Volume represents number of shares traded
5. Some endpoints may require authentication for production use
6. Always validate and sanitize input parameters
7. Use appropriate error handling for network requests
8. Consider implementing caching for frequently accessed data