import { ExternalLink, TrendingUp, TrendingDown, Clock, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NewsCard = ({ article }) => {
  const {
    title,
    summary,
    url,
    contifyImageUrl,
    pubDate,
    source,
    companies = [],
    topics = [],
  } = article;

  const mainCompany = companies[0];
  const priceData = mainCompany?.livePriceDto;
  const isPositive = priceData?.dayChangePerc >= 0;

  const timeAgo = pubDate
    ? formatDistanceToNow(new Date(pubDate), { addSuffix: true })
    : "Recently";

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
      {/* Image Section */}
      {contifyImageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={contifyImageUrl}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x200?text=News";
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Source Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 shadow-md">
            {source}
          </div>

          {/* Time Badge */}
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        {/* Topics */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {topics.slice(0, 2).map((topic, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>

        {/* Summary */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {summary}
        </p>

        {/* Company Info */}
        {mainCompany && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-4">
            <div className="flex items-center gap-3">
              {mainCompany.imageUrl && (
                <img
                  src={mainCompany.imageUrl}
                  alt={mainCompany.companyShortName}
                  className="w-10 h-10 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {mainCompany.companyShortName}
                </p>
                <p className="text-xs text-gray-500">{mainCompany.nseScripCode}</p>
              </div>
            </div>

            {/* Price Info */}
            {priceData && (
              <div className="text-right">
                <p className="font-bold text-gray-800">₹{priceData.ltp?.toFixed(2)}</p>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(priceData.dayChangePerc).toFixed(2)}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* Read More Button */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg group/btn"
        >
          <span>Read Full Article</span>
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </a>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
};

export default NewsCard;