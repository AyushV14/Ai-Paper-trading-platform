export async function GET(request, { params }) {
  try {
    const { symbol } = await params;
    
    const response = await fetch(
      `https://groww.in/v1/api/stocks_data/v1/tr_live_prices/exchange/NSE/segment/CASH/${symbol}/latest`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stock details: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Stock Details API Error:', error);
    return Response.json(
      { error: 'Failed to fetch stock details' },
      { status: 500 }
    );
  }
}
