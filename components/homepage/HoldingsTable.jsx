import React from 'react';
import { PieChart } from 'lucide-react';
import HoldingRow from './HoldingRow';

const HoldingsTable = ({ enrichedHoldings, holdingsCount }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Holdings ({holdingsCount})
          </h2>
        </div>
      </div>

      {enrichedHoldings.length === 0 ? (
        <div className="p-8 text-center">
          <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">You don't have any stocks yet.</p>
          <p className="text-gray-400 text-sm mt-1">Start investing to see your holdings here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Price (1D%)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Returns (%)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current (Invested)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrichedHoldings.map((holding) => (
                <HoldingRow key={holding.symbol} holding={holding} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;