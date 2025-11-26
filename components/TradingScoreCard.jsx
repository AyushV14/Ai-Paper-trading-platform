import { Award, TrendingUp } from "lucide-react";

const TradingScoreCard = ({ score, justification }) => {
  if (score === undefined || score === null) return null;

  // Determine color and label based on score
  const getScoreDetails = (score) => {
    if (score >= 80) return { color: 'from-green-500 to-emerald-600', label: 'Excellent', ring: 'ring-green-500' };
    if (score >= 65) return { color: 'from-blue-500 to-indigo-600', label: 'Good', ring: 'ring-blue-500' };
    if (score >= 50) return { color: 'from-yellow-500 to-orange-600', label: 'Average', ring: 'ring-yellow-500' };
    return { color: 'from-orange-500 to-red-600', label: 'Needs Work', ring: 'ring-orange-500' };
  };

  const { color, label, ring } = getScoreDetails(score);

  // Calculate circle circumference for animated progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Circular Progress */}
        <div className="relative">
          <svg className="transform -rotate-90 w-40 h-40">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={`text-${color.split('-')[1]}-500`} stopColor="currentColor" />
                <stop offset="100%" className={`text-${color.split('-')[3]}`} stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Score in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
              {score}
            </span>
            <span className="text-sm text-gray-600 font-medium">{label}</span>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
            <Award className={`w-6 h-6 text-${color.split('-')[1]}-600`} />
            <h3 className="text-2xl font-bold">Your Trading Score</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {justification || "Your overall trading performance and consistency rating."}
          </p>
          <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${color} text-white text-sm font-semibold`}>
            <TrendingUp className="w-4 h-4" />
            Keep improving!
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingScoreCard;