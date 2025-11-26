import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '5';

    // Fetch all discovery types in one API call
    // Note: We're using comma-separated values, not URL encoded %2C
    const discoveryTypes = [
      'TOP_GAINERS',
      'TOP_LOSERS',
      'STOCKS_IN_NEWS',
      'MOST_VALUABLE',
    ].join(',');

    // Encode the entire URL properly
    const growwUrl = `https://groww.in/v1/api/stocks_data/v2/explore/list/top?discoveryFilterTypes=${encodeURIComponent(discoveryTypes)}&page=${page}&size=${size}`;
    
    console.log('Fetching batch data from:', growwUrl);
    
    const response = await fetch(growwUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groww API error:', response.status, errorText);
      throw new Error(`Groww API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully fetched batch data');

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error) {
    console.error('Error fetching batch market data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch market data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}