import React from 'react';

const MarketStatus = ({ stockData }) => {
  // Helper function to check if market is open
  const getMarketStatus = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); 
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // NSE market hours: 9:15 AM to 3:30 PM (IST), Monday to Friday
    const marketOpenTime = 9 * 60 + 15; // 9:15 AM in minutes
    const marketCloseTime = 15 * 60 + 30; // 3:30 PM in minutes
    
    // Check if it's a weekend
    if (currentDay === 0 || currentDay === 6) {
      return { isOpen: false, status: 'Closed - Weekend' };
    }
    
    // Check if current time is within market hours
    if (currentTime >= marketOpenTime && currentTime <= marketCloseTime) {
      return { isOpen: true, status: 'Open' };
    } else if (currentTime < marketOpenTime) {
      return { isOpen: false, status: 'Pre-Market' };
    } else {
      return { isOpen: false, status: 'Closed' };
    }
  };
  
  // Convert timestamp correctly
  const getLastUpdateTime = () => {
    if (!stockData?.tsInMillis) return 'N/A';
    
    // tsInMillis might be in seconds, so convert to milliseconds if needed
    let timestamp = stockData.tsInMillis;
    
    // If the timestamp is less than a reasonable millisecond value, it's likely in seconds
    if (timestamp < 10000000000) {
      timestamp = timestamp * 1000;
    }
    
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const marketInfo = getMarketStatus();
  const lastUpdateTime = getLastUpdateTime();
  
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 className="font-semibold text-blue-900 mb-2">Market Status</h3>
      <div className="text-sm text-blue-800">
        <div className="flex justify-between items-center">
          <span>Market:</span>
          <div className="flex items-center gap-2">
            <span 
              className={`w-2 h-2 rounded-full ${
                marketInfo.isOpen ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></span>
            <span className="font-medium">{marketInfo.status}</span>
          </div>
        </div>
        {/* <div className="flex justify-between mt-2">
          <span>Last Update:</span>
          <span className="font-medium text-right max-w-[200px]">
            {lastUpdateTime}
            A:AA 
          </span>
        </div> */}
        {marketInfo.isOpen && (
          <div className="flex justify-between mt-2">
            <span>Market Hours:</span>
            <span className="font-medium">9:15 AM - 3:30 PM</span>
          </div>
        )}
        {!marketInfo.isOpen && marketInfo.status === 'Pre-Market' && (
          <div className="flex justify-between mt-2">
            <span>Opens at:</span>
            <span className="font-medium">9:15 AM</span>
          </div>
        )}
        {!marketInfo.isOpen && marketInfo.status === 'Closed' && (
          <div className="flex justify-between mt-2">
            <span>Next Open:</span>
            <span className="font-medium">9:15 AM Tomorrow</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketStatus;