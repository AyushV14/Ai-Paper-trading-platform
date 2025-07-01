export async function GET(request, { params }) {
  try {
    const { symbol } = await params;
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '1d';
    
    let apiUrl;
    
    switch (timeframe) {
      case '1d':
        apiUrl = `https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${symbol}/daily?intervalInMinutes=1&minimal=true`;
        break;
      case '1w':
        apiUrl = `https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${symbol}/weekly?intervalInMinutes=5&minimal=true`;
        break;
      case '1m':
        apiUrl = `https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${symbol}/monthly?intervalInMinutes=30&minimal=true`;
        break;
      case '1y':
        apiUrl = `https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${symbol}/1y?intervalInDays=1&minimal=true`;
        break;
      case '5y':
        apiUrl = `https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${symbol}/5y?intervalInDays=5&minimal=true`;
        break;
      default:
        apiUrl = `https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${symbol}/daily?intervalInMinutes=1&minimal=true`;
    }
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Chart API Error:', error);
    return Response.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}