"use client"; // make sure this is a client component
import React from "react";
import { useRouter } from "next/navigation";
import { BarChart3, MoreHorizontal } from "lucide-react";
import { formatCurrency, formatPercentage, getColorClass } from "../../utils/portfolioUtils";

const PortfolioOverview = ({ metrics }) => {
  const router = useRouter();

  const handleAnalyzeClick = () => {
    router.push("/dashboard/analyze");
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border w-auto md:w-[1200px]">
      {/* Current Value - Main Display */}
      <div className="mb-6">
        <p className="text-gray-600 text-sm mb-2">Current value</p>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            {formatCurrency(metrics.totalCurrentValue)}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAnalyzeClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              <BarChart3 className="w-4 h-4" />
              Analyse
            </button>
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Bottom Row - Three Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Invested Value */}
        <div>
          <p className="text-gray-600 text-sm mb-2">Invested value</p>
          <p className="text-xl font-semibold text-gray-900">
            {formatCurrency(metrics.totalInvested)}
          </p>
        </div>

        {/* 1D Returns */}
        <div>
          <p className="text-gray-600 text-sm mb-2">1D returns</p>
          <p className={`text-xl font-semibold ${getColorClass(metrics.totalDayChange)}`}>
            {formatCurrency(metrics.totalDayChange, { showSign: true })} ({formatPercentage(metrics.dayChangePerc, { showSign: true })})
          </p>
        </div>

        {/* Total Returns */}
        <div>
          <p className="text-gray-600 text-sm mb-2">Total returns</p>
          <p className={`text-xl font-semibold ${getColorClass(metrics.totalReturns)}`}>
            {formatCurrency(metrics.totalReturns, { showSign: true })} ({formatPercentage(metrics.totalReturnsPerc, { showSign: true })})
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;
