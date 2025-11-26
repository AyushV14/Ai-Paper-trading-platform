import { TrendingUp } from "lucide-react";

const TradingStyleCard = ({ tradingStyle }) => {
  if (!tradingStyle) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Trading Style Analysis</h2>
      </div>
      
      {/* Content */}
      <p className="text-gray-700 leading-relaxed">{tradingStyle}</p>
    </div>
  );
};

export default TradingStyleCard;