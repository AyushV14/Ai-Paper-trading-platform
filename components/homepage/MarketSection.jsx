"use client";
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MarketSection = ({ title, icon: Icon, discoveryType, iconColor }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching data for:', discoveryType);

        // Call your Next.js API route
        const response = await fetch(
          `/api/explore?discoveryType=${discoveryType}&page=0&size=5`,
          {
            cache: 'no-store',
          }
        );

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error:', errorData);
          throw new Error(errorData.details || `API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        // Extract stocks from the response
        const stockList = data.exploreCompanies?.[discoveryType] || [];
        console.log(`Stocks for ${discoveryType}:`, stockList.length);
        
        setStocks(stockList);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [discoveryType]);

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
          iconColor === 'text-green-600' ? 'from-green-500 to-emerald-600' :
          iconColor === 'text-red-600' ? 'from-red-500 to-rose-600' :
          iconColor === 'text-blue-600' ? 'from-blue-500 to-indigo-600' :
          'from-purple-500 to-pink-600'
        } flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 text-sm font-medium">Failed to load data</p>
          <p className="text-red-500 text-xs mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && stocks.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No stocks available</p>
        </div>
      )}

      {!loading && !error && stocks.length > 0 && (
        <div className="space-y-2">
          {stocks.map((item, index) => {
            const { company, stats } = item;
            const isPositive = stats.dayChange >= 0;
            
            return (
              <div
                key={company.isin || index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {company.imageUrl && (
                    <img
                      src={company.imageUrl}
                      alt={company.companyShortName}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {company.companyShortName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {company.nseScriptCode || company.bseScriptCode}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-bold text-gray-900">
                    ₹{stats.ltp.toFixed(2)}
                  </p>
                  <div className={`flex items-center justify-end gap-1 ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-sm font-semibold">
                      {formatChange(stats.dayChangePerc)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};