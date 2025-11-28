const QuickStatsCard = ({ icon: Icon, label, value, color, subtext, info }) => {
  const colorName = color.split('-')[1]; // Extract color theme

  return (
    <div className="group relative overflow-hidden">
      {/* Main Card */}
      <div
        className={`relative bg-white rounded-2xl shadow-lg p-6 transform transition-all 
        duration-500 hover:scale-105 hover:shadow-2xl border-l-4 ${color} h-full`}
      >

        {/* Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-${colorName}-200/30 
          to-${colorName}-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
        ></div>

        {/* Decorative Circle */}
        <div
          className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-${colorName}-400/30 
          to-${colorName}-300/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}
        ></div>

        {/* Info Button */}
        {info && (
          <div className="absolute top-4 right-4 pointer-events-auto z-50">
            <div className="relative group/info">
              
              {/* Fixed Dark Themed Button */}
              <button
                className="w-6 h-6 flex items-center justify-center rounded-full 
                bg-gray-800 text-white text-xs font-bold shadow-md hover:scale-110 transition"
              >
                i
              </button>

              {/* Tooltip - independent hover */}
              <div
                className="absolute right-0 mt-2 w-48 p-3 text-xs bg-black text-white 
                rounded-xl shadow-lg opacity-0 group-hover/info:opacity-100 transition 
                duration-300 pointer-events-none"
              >
                {info}
              </div>
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className="relative z-10">
          
          {/* Icon */}
          <div className="flex items-center justify-between mb-4">
            <div
              className={`relative p-4 rounded-xl bg-gradient-to-br from-${colorName}-500 
              to-${colorName}-400 shadow-md group-hover:shadow-lg transition-all duration-300 
              group-hover:scale-110`}
            >
              <Icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />

              {/* Pulse */}
              <div
                className={`absolute inset-0 rounded-xl bg-${colorName}-600 opacity-0 
                group-hover:opacity-20 group-hover:animate-ping`}
              ></div>
            </div>

            {/* Badge */}
            {subtext && (
              <div
                className={`px-2 py-1 rounded-full bg-${colorName}-600 opacity-0 
                group-hover:opacity-100 transition-opacity duration-300`}
              >
                <span className="text-xs font-bold text-white">↗</span>
              </div>
            )}
          </div>

          {/* Label */}
          <div className="text-sm text-gray-700 mb-2 font-semibold tracking-wide uppercase 
          opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {label}
          </div>

          {/* Value */}
          <div className="text-4xl font-black text-gray-600 mb-1 group-hover:scale-105 
          transition-transform duration-300">
            {value}
          </div>

          {/* Subtext */}
          {subtext && (
            <div className="overflow-hidden h-5">
              <div
                className={`text-xs font-medium text-${colorName}-700 transform translate-y-5 
                group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1`}
              >
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {subtext}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden opacity-0 
          group-hover:opacity-100 transition-opacity duration-500">
            <div
              className={`h-full bg-gradient-to-r from-${colorName}-500 to-${colorName}-700 
              rounded-full transform -translate-x-full group-hover:translate-x-0 
              transition-transform duration-1000 ease-out`}
              style={{ width: "75%" }}
            ></div>
          </div>

        </div>
      </div>

      {/* Outer Glow */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-${colorName}-500/20 
        to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10`}
      ></div>
    </div>
  );
};

export default QuickStatsCard;
