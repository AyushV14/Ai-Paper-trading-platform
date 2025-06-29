"use client"
import React, { useState } from 'react';
import { CardBalance } from "./CardBalance";
import { StockCard } from "../homepage/StockCard";

export const PageContent = () => {

  const [lastUpdateTime, setLastUpdateTime] = useState("");
  const stockSymbols = [
    "RELIANCE",    // Reliance Industries
    "TCS",         // Tata Consultancy Services
    "INFY",        // Infosys
    "HDFCBANK"     // HDFC Bank
  ];


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
        <h1 className="text-3xl font-bold text-gray-900">Market Dashboard</h1>
        <p className="text-gray-600 mt-1">Live stock prices powered by SmartAPI</p>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className='text-sm'>Live {lastUpdateTime}</span>
        </div>
      </div>
      </div>

      {/* Stock Cards Grid Wrapper with Horizontal Scroll */}
      <div className="w-full overflow-x-auto">
        <div className="flex gap-4 min-w-[900px] pb-2 overflow-x-auto">
          {stockSymbols.map((symbol) => (
            <div key={symbol} className="min-w-[200px] flex-shrink-0">
              <StockCard symbol={symbol} updateTimeCallback={setLastUpdateTime} />
            </div>
          ))}

          {/* Balance Card */}
          <div className="min-w-[200px] flex-shrink-0">
            <CardBalance />
          </div>
        </div>
      </div>

      {/* Market Status Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Market Status</h3>
            <p className="text-blue-100 text-sm">
              Data refreshes every 30 seconds • Powered by Angel Broking SmartAPI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Additional Content Area */}
      <div className="min-h-[50vh] flex-1 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-6">
        <div className="text-center text-gray-500 mt-16">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Trading Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Your comprehensive trading interface with real-time market data
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-medium text-gray-700">Portfolio</div>
                <div className="text-gray-500">Track your investments</div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-medium text-gray-700">Orders</div>
                <div className="text-gray-500">Manage buy/sell orders</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};