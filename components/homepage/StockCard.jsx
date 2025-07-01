"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const StockCard = ({ symbol, updateTimeCallback }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStockData = async (isInitial = false) => {
      try {
        if (isInitial) {
          setInitialLoad(true);
        } else {
          setLoading(true);
        }
        
        const response = await fetch(`/api/stock/${symbol}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }
        
        const data = await response.json();
        setStockData(data);
        setError(null);

        if (data?.tsInMillis && updateTimeCallback) {
          const time = new Date(data.tsInMillis).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
          });
          updateTimeCallback(time);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    if (symbol) {
      fetchStockData(true);
      
      const interval = setInterval(() => fetchStockData(false), 30000);
      return () => clearInterval(interval);
    }
  }, [symbol, updateTimeCallback]);

  const handleCardClick = () => {
    if (stockData?.symbol) {
      router.push(`/dashboard/${stockData.symbol.toLowerCase()}`);
    }
  };

  // Initial loading skeleton
  if (initialLoad) {
    return (
      <div className="rounded-xl border p-4 shadow-sm bg-white h-full animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded-full w-3" />
        </div>
        <div className="h-8 bg-gray-200 rounded mb-3" />
        <div className="h-6 bg-gray-200 rounded mb-3" />
        <div className="flex justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-xl border p-4 shadow-sm bg-white h-full">
        <div className="text-red-500 text-center py-4">
          <p className="text-sm">Failed to load</p>
          <p className="text-xs text-gray-500">{symbol}</p>
        </div>
      </div>
    );
  }

  if (!stockData) return null;

  const isPositive = stockData.dayChange >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBgColor = isPositive ? 'bg-green-50' : 'bg-red-50';

  return (
    <div 
      className="rounded-xl border p-4 shadow-sm bg-white h-full hover:shadow-md transition-all duration-200 relative cursor-pointer hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      {/* Loading indicator for updates */}
      {loading && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm truncate">
          {stockData.symbol}
        </h3>
        {/* <div className="text-xs text-gray-400">→</div> */}
      </div>

      {/* Current Price */}
      <div className="mb-3">
        <p className="text-2xl font-bold text-gray-900">
          ₹{stockData.ltp?.toFixed(2)}
        </p>
      </div>

      {/* Change Info */}
      <div className={`rounded-lg p-2.5 ${changeBgColor} mb-3`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${changeColor}`}>
            {isPositive ? '+' : ''}₹{stockData.dayChange?.toFixed(2)}
          </span>
          <span className={`text-sm font-semibold ${changeColor}`}>
            {isPositive ? '+' : ''}{stockData.dayChangePerc?.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};
