import { useState } from "react";

const ExpandableSection = ({ title, content, icon: Icon, bgColor, textColor }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`${bgColor} rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg`}>
      {/* Header Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${textColor}`} />
          <h3 className={`text-xl font-bold ${textColor}`}>{title}</h3>
        </div>
        
        {/* Chevron Icon */}
        <svg
          className={`w-6 h-6 ${textColor} transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Expandable Content */}
      <div 
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="p-6 pt-0">
          <p className={`${textColor} leading-relaxed`}>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpandableSection;