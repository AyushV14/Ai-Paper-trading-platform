import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const StockChart = ({ chartData, timeframe, symbol, isLoading, stockData }) => {
  // Process chart data based on the actual API response format
  const processedData = useMemo(() => {
    if (!chartData?.candles || !Array.isArray(chartData.candles)) {
      return [];
    }

    return chartData.candles.map((candle, index) => {
      // API returns [timestamp_in_seconds, price]
      const timestampInSeconds = candle[0];
      const price = parseFloat(candle[1]);
      
      // Convert timestamp from seconds to milliseconds
      const timestampInMs = timestampInSeconds * 1000;
      const date = new Date(timestampInMs);
      
      let formattedTime;

      // Format time based on timeframe
      switch (timeframe) {
        case '1d':
          formattedTime = date.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
          });
          break;
        case '1w':
          formattedTime = date.toLocaleDateString('en-IN', { 
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          });
          break;
        case '1m':
          formattedTime = date.toLocaleDateString('en-IN', { 
            day: 'numeric',
            month: 'short'
          });
          break;
        case '1y':
          formattedTime = date.toLocaleDateString('en-IN', { 
            day: 'numeric',
            month: 'short',
            year: '2-digit'
          });
          break;
        case '5y':
          formattedTime = date.toLocaleDateString('en-IN', { 
            month: 'short',
            year: 'numeric'
          });
          break;
        default:
          formattedTime = date.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
          });
      }

      return {
        time: formattedTime,
        price: price,
        timestamp: timestampInMs,
        fullDateTime: date.toLocaleString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      };
    });
  }, [chartData, timeframe]);

  // Calculate price change and trend using API response data
  const priceStats = useMemo(() => {
    if (!chartData) return { change: 0, percentage: 0, isPositive: true, currentPrice: 0 };
    
    // For 1d timeframe, chart API returns null values, so use stockData
    if (timeframe === '1d' && stockData) {
      const change = stockData.dayChange || 0;
      const percentage = stockData.dayChangePerc || 0;
      const currentPrice = stockData.ltp || 0;
      
      return {
        change: change,
        percentage: percentage,
        isPositive: change >= 0,
        currentPrice: currentPrice
      };
    }
    
    // For other timeframes, use chartData
    const change = chartData.changeValue || 0;
    const percentage = chartData.changePerc ? chartData.changePerc * 100 : 0;
    const currentPrice = chartData.closingPrice || stockData?.ltp || 0;
    
    return {
      change: change,
      percentage: percentage,
      isPositive: change >= 0,
      currentPrice: currentPrice
    };
  }, [chartData, timeframe, stockData]);

  // Simple tooltip showing only time and price
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0].payload) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-1">
            {data.fullDateTime}
          </p>
          <p className="text-lg font-semibold text-blue-600">
            ₹{data.price.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Determine line color based on trend
  const lineColor = priceStats.isPositive ? '#10b981' : '#ef4444';
  const gradientId = `gradient-${symbol}-${timeframe}`;

  if (isLoading) {
    return (
      <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          Loading chart data...
        </div>
      </div>
    );
  }

  if (!processedData.length) {
    return (
      <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Activity size={48} className="mx-auto mb-2 opacity-50" />
          <p className="text-lg font-medium">No chart data available</p>
          <p className="text-sm">Please try a different timeframe</p>
        </div>
      </div>
    );
  }

  // Calculate price range for display
  const prices = processedData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <div className="space-y-4 ">
      {/* Current Price and Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-gray-900">
            ₹{priceStats.currentPrice.toFixed(2)}
          </div>
          <div className="flex items-center gap-2">
            {priceStats.isPositive ? (
              <TrendingUp size={20} className="text-green-600" />
            ) : (
              <TrendingDown size={20} className="text-red-600" />
            )}
            <span className={`font-semibold ${priceStats.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {priceStats.isPositive ? '+' : ''}₹{Math.abs(priceStats.change).toFixed(2)}
            </span>
            <span className={`text-sm ${priceStats.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              ({priceStats.isPositive ? '+' : ''}{priceStats.percentage.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {timeframe.toUpperCase()} • {processedData.length} points
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={lineColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0" 
              vertical={false}
            />
            {/* <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              interval="preserveStartEnd"
            /> */}
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              domain={['dataMin - 10', 'dataMax + 10']}
              tickFormatter={(value) => `₹${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={lineColor}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ 
                r: 5, 
                fill: lineColor,
                strokeWidth: 2,
                stroke: '#fff'
              }}
              fill={`url(#${gradientId})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Summary */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <span>Range: ₹{minPrice.toFixed(2)} - ₹{maxPrice.toFixed(2)}</span>
          <span>•</span>
          <span>Period: {timeframe.toUpperCase()}</span>
        </div>
        {processedData.length > 0 && (
          <div>
            Last: {processedData[processedData.length - 1]?.fullDateTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockChart;