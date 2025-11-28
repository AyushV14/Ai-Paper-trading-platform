// MarketSection.jsx
"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useNotifications } from "../notifications/NotificationContext";

export const MarketSection = ({ title, icon: Icon, discoveryType, iconColor , refreshWatchlist  }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { addNotification , openPanel } = useNotifications();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/explore?discoveryType=${discoveryType}&page=0&size=5`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || `API error: ${response.status}`);
        }

        const data = await response.json();
        const stockList = data.exploreCompanies?.[discoveryType] || [];
        setStocks(stockList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [discoveryType]);

  const formatChange = (change) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}`;
  };

const addToWatchlist = async (company) => {
  try {
    const res = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userId: user.id,
        symbol: company.nseScriptCode || company.bseScriptCode,
        companyName: company.companyShortName,
        imageUrl: company.imageUrl,
      }),
    });

    const data = await res.json();
    if (data.success) {
      // send notification instead of alert
      addNotification(
        `Added ${company.companyShortName} (${company.nseScriptCode || company.bseScriptCode}) to watchlist.`,
        "watchlist",
        company.imageUrl // <- pass the company image
      );
      openPanel();
      if (refreshWatchlist) refreshWatchlist();
    } else {
      addNotification(
        `Failed to add ${company.companyShortName} to watchlist: ${data.error || "Unknown error"}`,
        "error"
      );
      openPanel();
    }
  } catch (err) {
    console.error(err);
    addNotification(
      `Failed to add ${company.companyShortName} to watchlist.`,
      "error"
    );
    openPanel();
  }
};




  const getBgGradient = () => {
    if (iconColor === "text-green-600") return "from-green-500 to-green-600";
    if (iconColor === "text-red-600") return "from-red-500 to-red-600";
    if (iconColor === "text-blue-600") return "from-blue-500 to-blue-600";
    return "from-purple-500 to-purple-600";
  };

  const handleCardClick = (company) => {
    const symbol = (company.nseScriptCode || company.bseScriptCode || "").toLowerCase();
    if (symbol) {
      router.push(`/dashboard/${symbol}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-7">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getBgGradient()} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse flex items-center justify-between p-5 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded-lg w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-5 bg-gray-200 rounded-lg w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-16"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 text-base font-bold mb-1">Failed to load data</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* No Stocks */}
      {!loading && !error && stocks.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <p className="text-gray-600 font-medium">No stocks available</p>
        </div>
      )}

      {/* Stock List */}
      {!loading && !error && stocks.length > 0 && (
        <div className="space-y-2">
          {stocks.map((item, index) => {
            const { company, stats } = item;
            const isPositive = stats.dayChange >= 0;

            return (
              <div
                key={company.isin || index}
                className="flex items-center justify-between p-5 hover:bg-gray-50 rounded-xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-200"
                onClick={() => handleCardClick(company)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {company.imageUrl && (
                    <img
                      src={company.imageUrl}
                      alt={company.companyShortName}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-sm border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 truncate text-base">
                      {company.companyShortName}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {company.nseScriptCode || company.bseScriptCode}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-bold text-gray-900 text-lg">
                    ₹{stats.ltp.toFixed(2)}
                  </p>
                  <div
                    className={`flex items-center justify-end gap-1.5 ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span className="text-sm font-bold">{formatChange(stats.dayChangePerc)}%</span>
                  </div>
                </div>

                <button
                  className="watchlist-add-btn opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 ml-3 rounded-lg hover:bg-gray-200 border border-transparent hover:border-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWatchlist(company);
                  }}
                >
                  <Plus className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
