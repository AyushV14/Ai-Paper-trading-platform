import { BarChart3, Trophy } from "lucide-react";

const MostTradedStocks = ({ stocks }) => {
  if (!stocks || Object.keys(stocks).length === 0) return null;

  // Sort stocks by trade count and take top 8
  const sortedStocks = Object.entries(stocks)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Most Traded Stocks</h2>
      </div>
      
      {/* Stock Badges */}
      <div className="flex flex-wrap gap-3">
        {sortedStocks.map(([stock, count], idx) => (
          <div
            key={stock}
            className="group relative bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-3 rounded-full font-semibold shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            <span className="text-lg">{stock}</span>
            <span className="ml-2 bg-white/30 px-2 py-1 rounded-full text-sm">
              ×{count}
            </span>
            
            {/* Trophy icon for most traded */}
            {idx === 0 && (
              <Trophy className="absolute -top-2 -right-2 w-5 h-5 text-yellow-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostTradedStocks;