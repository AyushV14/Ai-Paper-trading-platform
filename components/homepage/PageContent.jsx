"use client";
import React, { useEffect, useState } from "react";
import DashboardTour, { startDashboardTour } from "./DashboardTour";
import { CardBalance } from "./CardBalance";
import { StockCard } from "../homepage/StockCard";
import { MarketSection } from "./MarketSection";
import { MarketOverview } from "./MarketOverview";
import { TrendingUp, TrendingDown, Newspaper, Star, Sparkles, Info, Bell, Plus } from "lucide-react";
import { useNotifications } from "../notifications/NotificationContext";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export const PageContent = () => {
  const { notifications, openPanel } = useNotifications();
  const [lastUpdateTime, setLastUpdateTime] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const fetchWatchlist = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/watchlist?userId=${user.id}`);
      const data = await res.json();
      setWatchlist(data.watchlist || []);
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
    }
  };

  useEffect(() => {
    if (isLoaded && user?.id) fetchWatchlist();
  }, [isLoaded, user?.id]);

  return (
    <div className="flex flex-1 flex-col w-full gap-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <DashboardTour />

      {/* Market Header */}
      <div id="market-header" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Market Dashboard
          </h1>
          <p className="text-gray-600 text-base font-medium">Real-time market insights and stock analysis</p>
          <button
            onClick={() => startDashboardTour()}
            className="px-6 py-2.5 mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl"
          >
            <Info className="w-4 h-4" />
            <span>Take a Tour</span>
          </button>
        </div>

        {/* Notification Bell */}
        <button
          id="notification-btn"
          className="relative cursor-pointer hover:scale-110 transition-transform duration-300 p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md"
          onClick={openPanel}
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      {/* Market Overview */}
      <div id="market-overview">
        <MarketOverview />
      </div>

      {/* Watchlist Section */}
      <div
        id="watchlist-section"
        className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Watchlist</h2>
              <p className="text-sm text-gray-600 font-medium">Track your favorite stocks in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl px-4 py-2.5 border border-green-200 shadow-sm">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
            <span className="text-sm font-bold text-green-700 uppercase tracking-wide">Live</span>
          </div>
        </div>

        {watchlist?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
              <Star className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your watchlist is empty</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Start tracking stocks by adding them to your watchlist. Browse market movers below to get started.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Browse Stocks
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-8 px-8">
            <div className="flex gap-5 min-w-min pb-2">
              <div className="min-w-[300px] flex-shrink-0">
                <CardBalance />
              </div>
              {watchlist.map((item) => (
                <div key={item.symbol} className="min-w-[240px] flex-shrink-0">
                  <StockCard
                    symbol={item.symbol}
                    companyName={item.companyName}
                    imageUrl={item.imageUrl}
                    updateTimeCallback={setLastUpdateTime}
                    refreshWatchlist={fetchWatchlist}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Market Movers Sections */}
      <div id="market-movers" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketSection
          title="Top Gainers"
          icon={TrendingUp}
          discoveryType="TOP_GAINERS"
          iconColor="text-green-600"
          refreshWatchlist={fetchWatchlist}
        />
        <MarketSection
          title="Top Losers"
          icon={TrendingDown}
          discoveryType="TOP_LOSERS"
          iconColor="text-red-600"
          refreshWatchlist={fetchWatchlist}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketSection
          title="Stocks in News"
          icon={Newspaper}
          discoveryType="STOCKS_IN_NEWS"
          iconColor="text-blue-600"
          refreshWatchlist={fetchWatchlist}
        />
        <MarketSection
          title="Most Valuable Stocks"
          icon={Sparkles}
          discoveryType="MOST_VALUABLE"
          iconColor="text-purple-600"
          refreshWatchlist={fetchWatchlist}
        />
      </div>
    </div>
  );
};

export default PageContent;
