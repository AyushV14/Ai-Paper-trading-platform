import { Zap, ArrowUpRight } from "lucide-react";

const TopOpportunityCard = ({ opportunity }) => {
  if (!opportunity) return null;

  return (
    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex items-start gap-4">
        {/* Icon with pulse effect */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
          <div className="relative p-3 bg-white/20 backdrop-blur-sm rounded-full">
            <Zap className="w-8 h-8 text-yellow-300" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold">⚡ Biggest Opportunity</h3>
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <p className="text-white/95 leading-relaxed text-lg font-medium">
            {opportunity}
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold">
            High Impact Action
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopOpportunityCard;