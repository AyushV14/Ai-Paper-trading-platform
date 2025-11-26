import { Target, CheckCircle, ArrowRight } from "lucide-react";

const NextMilestoneCard = ({ milestone }) => {
  if (!milestone) return null;

  return (
    <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
      
      <div className="relative z-10">
        {/* Icon and Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Target className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              Next Goal
            </span>
          </div>
          <CheckCircle className="w-6 h-6 opacity-50" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-3">Your Next Milestone</h3>

        {/* Content */}
        <p className="text-white/90 text-lg leading-relaxed mb-6">
          {milestone}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>Let's achieve this together</span>
          <ArrowRight className="w-4 h-4 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default NextMilestoneCard;