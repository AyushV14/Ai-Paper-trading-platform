import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage, getColorClass } from '../../utils/portfolioUtils';

const HoldingRow = ({ holding }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {holding.symbol.substring(0, 2)}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
            <div className="text-sm text-gray-500">
              {holding.qty} shares • Avg. ₹{holding.avgCost.toFixed(2)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="text-sm font-medium text-gray-900">
          ₹{holding.currentPrice.toFixed(2)}
        </div>
        <div className={`text-sm flex items-center justify-end gap-1 ${getColorClass(holding.dayChangePerc)}`}>
          {holding.dayChangePerc >= 0 ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {formatPercentage(holding.dayChangePerc, { showSign: true })}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className={`text-sm font-medium ${getColorClass(holding.returnsPerc)}`}>
          {formatCurrency(holding.returns, { showSign: true })}
        </div>
        <div className={`text-sm ${getColorClass(holding.returnsPerc)}`}>
          {formatPercentage(holding.returnsPerc, { showSign: true })}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="text-sm font-medium text-gray-900">
          {formatCurrency(holding.current)}
        </div>
        <div className="text-sm text-gray-500">
          {formatCurrency(holding.invested)}
        </div>
      </td>
    </tr>
  );
};

export default HoldingRow;