import { Brain, Heart } from "lucide-react";

const PsychologicalProfileCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md border border-purple-200 p-6 transform transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xl font-bold text-purple-900">Trading Psychology</h3>
            <Heart className="w-5 h-5 text-pink-500" />
          </div>
          <p className="text-purple-800 leading-relaxed">
            {profile}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PsychologicalProfileCard;