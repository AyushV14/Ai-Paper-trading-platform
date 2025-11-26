import { Trophy, Sparkles, Star } from "lucide-react";

const CelebrationCard = ({ achievement }) => {
  if (!achievement) return null;

  return (
    <div className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-xl shadow-lg p-6 overflow-hidden transform transition-all duration-300 hover:scale-105">
      {/* Animated sparkles */}
      <div className="absolute top-2 right-2">
        <Sparkles className="w-6 h-6 text-white animate-pulse" />
      </div>
      <div className="absolute bottom-2 left-2">
        <Star className="w-5 h-5 text-white/70 animate-bounce" />
      </div>
      <div className="absolute top-1/2 right-1/4">
        <Star className="w-4 h-4 text-white/50" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 flex items-start gap-4">
        {/* Trophy Icon */}
        <div className="flex-shrink-0 p-3 bg-white/30 backdrop-blur-sm rounded-full">
          <Trophy className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">🎉 Worth Celebrating!</h3>
          <p className="text-white/95 leading-relaxed font-medium">
            {achievement}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CelebrationCard;