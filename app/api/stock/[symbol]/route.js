// app/api/stock/[symbol]/route.js

const stockCache = {}; 

export async function GET(request, { params }) {
  try {
    const { symbol } = await params;
    const now = Date.now();

    // If we already have it cached and it's less than 30 seconds old
    if (
      stockCache[symbol] &&
      now - stockCache[symbol].ts < 30 * 1000
    ) {
      return Response.json(stockCache[symbol].data);
    }

    const response = await fetch(
      `https://groww.in/v1/api/stocks_data/v1/tr_live_prices/exchange/NSE/segment/CASH/${symbol}/latest`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        next: { revalidate: 0 }, // disable Next.js caching
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stock details: ${response.status}`);
    }

    const data = await response.json();

    // Cache it
    stockCache[symbol] = {
      data,
      ts: now
    };

    return Response.json(data);
  } catch (error) {
    console.error('Stock Details API Error:', error);
    return Response.json(
      { error: 'Failed to fetch stock details' },
      { status: 500 }
    );
  }
}
