import { useState, useEffect } from 'react';

export const useStockPrices = (holdings, updateInterval = 30000) => {
  const [stockPrices, setStockPrices] = useState({});
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 const fetchStockPrices = async (holdings) => {
  if (!holdings || holdings.length === 0) {
    console.warn('No holdings found');
    return;
  }

  console.log('Fetching prices for holdings:', holdings);
  const priceData = {};

  const pricePromises = holdings.map(async (holding) => {
    try {
      console.log(`Fetching price for ${holding.symbol}...`);
      const response = await fetch(`/api/stock/${holding.symbol}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${holding.symbol}`);
      }

      const data = await response.json();
      console.log(`API response for ${holding.symbol}:`, data);

      const currentPrice = parseFloat(
        data.currentPrice || data.price || data.ltp || data.last_price
      );
      const dayChange = parseFloat(data.dayChange || data.change || data.day_change || 0);
      const dayChangePerc = parseFloat(
        data.dayChangePerc || data.changePercent || data.change_percent || data.pchange || 0
      );

      if (isNaN(currentPrice)) {
        throw new Error(`Invalid price for ${holding.symbol}`);
      }

      return {
        symbol: holding.symbol,
        data: {
          currentPrice,
          dayChange,
          dayChangePerc,
          tsInMillis: data.tsInMillis || Date.now()
        }
      };
    } catch (error) {
      console.error(`Error fetching price for ${holding.symbol}:`, error);
      return {
        symbol: holding.symbol,
        data: null
      };
    }
  });

  try {
    const results = await Promise.all(pricePromises);

    results.forEach((result) => {
      if (result.data) {
        priceData[result.symbol] = result.data;
      }
    });

    console.log('Final price data:', priceData);
    setStockPrices(priceData);

    const validEntry = Object.values(priceData)[0];
    if (validEntry?.tsInMillis) {
      const time = new Date(validEntry.tsInMillis).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });
      setLastUpdateTime(time);
    }

    setError(null);
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    setError('Failed to fetch stock prices');
    setStockPrices(priceData); // Might be partial
  }
};


  useEffect(() => {
    const fetchData = async (isInitial = false) => {
      if (isInitial) {
        setLoading(true);
      }

      try {
        if (holdings && holdings.length > 0) {
          await fetchStockPrices(holdings);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        if (isInitial) {
          setLoading(false);
        }
      }
    };

    // Check if holdings exist
    if (holdings && holdings.length > 0) {
      fetchData(true);

      // Set up interval for periodic updates
      const interval = setInterval(() => fetchData(false), updateInterval);
      return () => clearInterval(interval);
    }
  }, [holdings, updateInterval]);

  return { stockPrices, lastUpdateTime, loading, error };
};