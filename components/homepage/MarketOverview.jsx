"use client";

import React, { useState, useEffect } from "react";
import { Activity, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export const MarketOverview = () => {
  const [marketData, setMarketData] = useState({
    gainers: 0,
    losers: 0,
    unchanged: 0,
    totalVolume: 0
  });

  useEffect(() => {
    // Simulated market overview data
    // In production, you'd fetch this from an API
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
      bg: "bg-green-50"
    },
    {
      label: "Losers",
      value: marketData.losers,
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      label: "Unchanged",
      value: marketData.unchanged,
      icon: Activity,
      color: "text-gray-600",
      bg: "bg-gray-50"
    },
    {
      label: "Volume (Cr)",
      value: marketData.totalVolume,
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}