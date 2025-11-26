import { useState } from "react";

const FlipCard = ({ title, icon: Icon, iconColor, items, type = 'list' }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getItemIcon = () => {
    if (type === 'strengths') return '✓';
    if (type === 'improvements') return '!';
    if (type === 'recommendations') return '→';
    return '•';
  };

  const getItemBgColor = () => {
    if (type === 'strengths') return 'bg-green-100 text-green-600';
    if (type === 'improvements') return 'bg-orange-100 text-orange-600';
    if (type === 'recommendations') return 'bg-blue-100 text-blue-600';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div 
      className="relative h-64 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front of Card */}
        <div 
          className="absolute w-full h-full"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 h-full flex flex-col items-center justify-center border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
            <div className={`p-4 rounded-full ${iconColor.replace('text-', 'bg-').replace('-600', '-100')} mb-4`}>
              <Icon className={`w-12 h-12 ${iconColor}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center">{title}</h3>
            <p className="text-sm text-gray-500 mt-2">Click to view details</p>
          </div>
        </div>
        
        {/* Back of Card */}
        <div 
          className="absolute w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 h-full overflow-y-auto border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Icon className={`w-5 h-5 ${iconColor}`} />
              <h3 className="text-lg font-bold">{title}</h3>
            </div>
            <ul className="space-y-2">
              {items && items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${getItemBgColor()}`}>
                    {getItemIcon()}
                  </span>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;