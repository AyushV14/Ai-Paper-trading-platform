import React from 'react';
import { formatCurrency } from '../../utils/portfolioUtils';


const PortfolioInfo = ({ virtualBalance, lastUpdateTime }) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500">
        Virtual Balance: {formatCurrency(virtualBalance || 0, { maximumFractionDigits: 2 })}
      </p>
      {lastUpdateTime && (
        <p className="text-sm text-gray-500 mt-1">Last updated: {lastUpdateTime}</p>
      )}
    </div>
  );
};

export default PortfolioInfo;