"use client";
import React, { useState } from "react";
import DashboardTour, { startDashboardTour } from "./DashboardTour";
import { CardBalance } from "./CardBalance";
import { StockCard } from "../homepage/StockCard";
import { MarketSection } from "./MarketSection";
import { MarketOverview } from "./MarketOverview";
import { TrendingUp, TrendingDown, Newspaper, Star, Sparkles, Info } from "lucide-react";

export const PageContent = () => {
  const [lastUpdateTime, setLastUpdateTime] = useState("");
  const watchlistSymbols = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "WIPRO", "ICICIBANK"];

  return (
    <div className="flex flex-1 flex-col w-full gap-6 pb-8">
      {/* mounted tour component (auto-run handled inside) */}
      <DashboardTour />

      {/* Header */}
      <div id="market-header" className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Dashboard</h1>
        <p className="text-gray-600">Real-time market insights and stock analysis</p>

        {/* Manual Start uses the same tour instance */}
        <button
          onClick={() => startDashboardTour()}
          className="px-4 py-2 mt-3 inline-flex items-center gap-2 rounded-lg shadow-sm bg-gradient-to-br from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 transition"
        >
          <Info className="w-4 h-4" />
          <span className="hidden sm:inline">Tour</span>
        </button>
      </div>

      {/* Market Overview */}
      <div id="market-overview">
        <MarketOverview />
      </div>

      {/* Watchlist Section */}
      <div
        id="watchlist-section"
        className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-indigo-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Watchlist</h2>
              <p className="text-sm text-gray-600">Track your favorite stocks</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Live</span>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <div className="flex gap-4 min-w-min pb-2">
            <div className="min-w-[280px] flex-shrink-0">
              <CardBalance />
            </div>

            {watchlistSymbols.map((symbol) => (
              <div key={symbol} className="min-w-[220px] flex-shrink-0">
                <StockCard symbol={symbol} updateTimeCallback={setLastUpdateTime} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Movers Grid */}
      <div id="market-movers" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketSection title="Top Gainers" icon={TrendingUp} discoveryType="TOP_GAINERS" iconColor="text-green-600" />
        <MarketSection title="Top Losers" icon={TrendingDown} discoveryType="TOP_LOSERS" iconColor="text-red-600" />
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketSection title="Stocks in News" icon={Newspaper} discoveryType="STOCKS_IN_NEWS" iconColor="text-blue-600" />
        <MarketSection title="Most Valuable Stocks" icon={Sparkles} discoveryType="MOST_VALUABLE" iconColor="text-purple-600" />
      </div>

      {/* Footer */}
      <div
        id="market-footer"
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl p-6 shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">Live Market Updates</h3>
            <p className="text-blue-100 text-sm">Data refreshes automatically • Powered by Groww API</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-blue-100 mb-1">Last Update</p>
              <p className="font-semibold">{lastUpdateTime || "Loading..."}</p>
            </div>

            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageContent;
