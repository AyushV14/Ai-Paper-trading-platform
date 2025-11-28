"use client";

import React, { useState, useEffect } from "react";
import { Activity, TrendingUp, TrendingDown, DollarSign, Info } from "lucide-react";

export const MarketOverview = () => {
  const [marketData, setMarketData] = useState({
    gainers: 0,
    losers: 0,
    unchanged: 0,
    totalVolume: 0
  });

  useEffect(() => {
    setMarketData({
      gainers: 1247,
      losers: 892,
      unchanged: 234,
      totalVolume: 45678
    });
  }, []);

  const stats = [
    {
      label: "Gainers",
      value: marketData.gainers,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-gradient-to-br from-green-50 to-green-100/50",
      iconBg: "bg-green-500",
      border: "border-green-200",
      info: "Number of stocks that have increased in value today."
    },
    {
      label: "Losers",
      value: marketData.losers,
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-gradient-to-br from-red-50 to-red-100/50",
      iconBg: "bg-red-500",
      border: "border-red-200",
      info: "Number of stocks that have decreased in value today."
    },
    {
      label: "Unchanged",
      value: marketData.unchanged,
      icon: Activity,
      color: "text-gray-700",
      bg: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      iconBg: "bg-gray-500",
      border: "border-gray-200",
      info: "Number of stocks that have remained unchanged today."
    },
    {
      label: "Volume (Cr)",
      value: marketData.totalVolume,
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
      iconBg: "bg-blue-500",
      border: "border-blue-200",
      info: "Total traded volume in crores for the day."
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bg} rounded-2xl border ${stat.border} p-6 hover:shadow-xl hover:scale-[1.03] transition-all duration-300 backdrop-blur-sm relative`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>

            {/* Info Button */}
            <div className="relative group">
              <button className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-all">
                <Info className="w-4 h-4 text-gray-600" />
              </button>
              {/* Tooltip */}
              <div className="absolute top-0 right-20 -translate-y-full translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-xs rounded-md p-2 w-48 z-10">
                {stat.info}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2 font-medium uppercase tracking-wide">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
