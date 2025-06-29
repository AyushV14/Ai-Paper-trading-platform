"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import StockChart from '../../../components/homepage/StockChart'
import { Input } from '../../../components/ui/input';
import MarketStatus from '../../../components/homepage/MarketStatus'

const StockDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const symbol = params.symbol?.toUpperCase();

  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTimeframe, setActiveTimeframe] = useState('1d');

  const timeframes = [
    { label: '1D', value: '1d' },
    { label: '1W', value: '1w' },
    { label: '1M', value: '1m' },
    { label: '1Y', value: '1y' },
    { label: '5Y', value: '5y' }
  ];

  useEffect(() => {
    if (symbol) {
      fetchStockDetails();
      fetchChartData(activeTimeframe);
    }
  }, [symbol]);

  const fetchStockDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stock/${symbol}`);

      if (!response.ok) {
        throw new Error('Failed to fetch stock details');
      }

      const data = await response.json();
      setStockData(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (timeframe) => {
    try {
      setChartLoading(true);
      const response = await fetch(`/api/stock-chart/${symbol}?timeframe=${timeframe}`);

      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }

      const data = await response.json();
      setChartData(data);
      console.log(data, "Chart HERE--------");

    } catch (err) {
      console.error('Chart data error:', err);
    } finally {
      setChartLoading(false);
    }
  };

  const handleTimeframeChange = (timeframe) => {
    setActiveTimeframe(timeframe);
    fetchChartData(timeframe);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stockData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="text-red-500 mb-4">
              <BarChart3 size={48} className="mx-auto mb-2" />
              <h2 className="text-xl font-semibold">Failed to load stock data</h2>
              <p className="text-gray-600 mt-2">Please try again later</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPositive = stockData.dayChange >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBgColor = isPositive ? 'bg-green-50' : 'bg-red-50';
  const changeIcon = isPositive ? TrendingUp : TrendingDown;
  const ChangeIcon = changeIcon;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Market Data
          </div>
        </div>

        {/* Stock Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {stockData.symbol}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>NSE</span>
                <span>•</span>
                <span>CASH</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₹{stockData.ltp?.toFixed(2)}
              </div>
              <div className={`flex items-center gap-1 ${changeColor}`}>
                <ChangeIcon size={16} />
                <span className="font-semibold">
                  {isPositive ? '+' : ''}₹{stockData.dayChange?.toFixed(2)}
                </span>
                <span className="font-semibold">
                  ({isPositive ? '+' : ''}{stockData.dayChangePerc?.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Stock Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Open</div>
              <div className="font-semibold text-gray-900">₹{stockData.open?.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">High</div>
              <div className="font-semibold text-gray-900">₹{stockData.high?.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Low</div>
              <div className="font-semibold text-gray-900">₹{stockData.low?.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Volume</div>
              <div className="font-semibold text-gray-900">{stockData.volume?.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Chart and Trading Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Activity size={20} />
                Price Chart
              </h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {timeframes.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => handleTimeframeChange(tf.value)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTimeframe === tf.value
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Use the StockChart component here */}
            <StockChart
              chartData={chartData}
              timeframe={activeTimeframe}
              symbol={symbol}
              isLoading={chartLoading}
              stockData={stockData}
            />
          </div>

          {/* Trading Panel */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Trade</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <Input
                  type="number"
                  placeholder={`₹${stockData.ltp?.toFixed(2)}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button className="bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  BUY
                </button>
                <button className="bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  SELL
                </button>
              </div>

              {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Market Status</h3>
                <div className="text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Market:</span>
                    <span className="font-medium">Open</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Update:</span>
                    <span className="font-medium">
                      {new Date(stockData.tsInMillis).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div> */}
              <MarketStatus stockData={stockData} />
            </div>
          </div>
        </div>

        {/* Additional Stock Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Previous Close</span>
                <span className="font-medium">₹{(stockData.ltp - stockData.dayChange)?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Day Range</span>
                <span className="font-medium">₹{stockData.low?.toFixed(2)} - ₹{stockData.high?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume</span>
                <span className="font-medium">{stockData.volume?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Market Cap</span>
                <span className="font-medium">₹{((stockData.ltp * stockData.volume) / 10000000).toFixed(2)}Cr</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">Latest Trade</span>
                </div>
                <span className="font-medium">₹{stockData.ltp?.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Volume Today</span>
                </div>
                <span className="font-medium">{stockData.volume?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600">Day Change</span>
                </div>
                <span className={`font-medium ${changeColor}`}>
                  {isPositive ? '+' : ''}₹{stockData.dayChange?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailsPage;