// stockcard.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import { useNotifications } from "../notifications/NotificationContext";

export const StockCard = ({ symbol, updateTimeCallback, companyName, imageUrl , refreshWatchlist }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { addNotification , openPanel } = useNotifications();
  
  const { user } = useUser();

  useEffect(() => {
    const fetchStockData = async (isInitial = false) => {
      try {
        if (isInitial) setInitialLoad(true);
        else setLoading(true);

        const res = await fetch(`/api/stock/${symbol}`);
        if (!res.ok) throw new Error("Failed to fetch stock data");

        const data = await res.json();
        setStockData(data);
        setError(null);

        if (data?.tsInMillis && updateTimeCallback) {
          const time = new Date(data.tsInMillis).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
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

const removeFromWatchlist = async (e) => {
  e.stopPropagation();
  try {
    const res = await fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, symbol }),
    });
    const data = await res.json();
    if (data.success) {
      addNotification(
        `${symbol} removed from your watchlist.`,
        "watchlist",
        stockData?.imageUrl || imageUrl // <- use stock image
      );
      openPanel();
      if (refreshWatchlist) refreshWatchlist();
    } else {
      addNotification(
        `Failed to remove ${symbol} from watchlist: ${data.error || "Unknown error"}`,
        "error"
      );
      openPanel();
    }
  } catch (err) {
    console.error(err);
    addNotification(
      `Failed to remove ${symbol} from watchlist.`,
      "error"
    );
    openPanel();
  }
};





  if (initialLoad) {
    return (
      <div className="rounded-2xl border border-gray-200 p-6 shadow-lg bg-white h-full min-h-[240px] animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="h-12 w-12 bg-gray-200 rounded-xl" />
          <div className="h-8 w-8 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-5 bg-gray-200 rounded-lg w-24 mb-4" />
        <div className="h-9 bg-gray-200 rounded-lg mb-6" />
        <div className="h-16 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 p-6 shadow-lg bg-red-50 h-full min-h-[240px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-1">Failed to load</p>
          <p className="text-red-500 text-sm">{symbol}</p>
        </div>
      </div>
    );
  }

  if (!stockData) return null;

  const isPositive = stockData.dayChange >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const changeBg = isPositive 
    ? "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200" 
    : "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200";

  return (
    <div
      onClick={handleCardClick}
      className="rounded-2xl border border-gray-200 p-6 shadow-lg bg-white h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative cursor-pointer group"
    >
      {loading && (
        <div className="absolute top-4 right-4">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
        </div>
      )}

      <button
        onClick={removeFromWatchlist}
        className="absolute top-4 left-4 p-2 w-8 h-8 flex items-center justify-center rounded-lg 
                   bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-sm"
        title="Remove from watchlist"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex justify-between items-start mb-5">
        {(stockData.imageUrl || imageUrl) && (
          <img
            src={stockData.imageUrl || imageUrl}
            alt={stockData.symbol}
            className="w-14 h-14 rounded-xl object-cover shadow-md border border-gray-200"
          />
        )}
      </div>

      <h3 className="font-bold text-gray-900 text-base mb-1">
        {stockData.symbol}
      </h3>
      <p className="text-xs text-gray-500 font-medium mb-4 truncate">
        {companyName || stockData.symbol}
      </p>

      <p className="text-3xl font-bold text-gray-900 mb-5">
        ₹{stockData.ltp?.toFixed(2)}
      </p>

      <div className={`rounded-xl p-4 border ${changeBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm font-bold ${changeColor}`}>
              {isPositive ? "+" : ""}
              ₹{stockData.dayChange?.toFixed(2)}
            </span>
          </div>
          <span className={`text-sm font-bold ${changeColor}`}>
            {isPositive ? "+" : ""}
            {stockData.dayChangePerc?.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};