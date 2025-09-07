"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { usePortfolioData } from '../../../../hooks/usePortfolioData';
import { useStockPrices } from '../../../../hooks/useStockPrices';
import { calculatePortfolioMetrics, getEnrichedHoldings } from '../../../../utils/portfolioUtils';

// Components
import LoadingState from '../../../../components/homepage/LoadingState';
import ErrorState from '../../../../components/homepage/ErrorState';
import PortfolioOverview from '../../../../components/homepage/PortfolioOverview';
import HoldingsTable from '../../../../components/homepage/HoldingsTable';
import PortfolioInfo from '../../../../components/homepage/PortfolioInfo';

const Portfolio = () => {
  const params = useParams();
  const id = params?.id; 
  
  const { userData, loading: userLoading, error: userError } = usePortfolioData();
  const { stockPrices, lastUpdateTime, loading: pricesLoading, error: pricesError } = useStockPrices(userData?.holdings);
  
  
  const metrics = calculatePortfolioMetrics(userData?.holdings, stockPrices);
  const enrichedHoldings = getEnrichedHoldings(userData?.holdings, stockPrices);
  
  
  const isLoading = userLoading || (pricesLoading && !userData);
  const error = userError || pricesError;

  // Handle different states
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!userData) {
    return <ErrorState error="User not found." />;
  }

  return (
    <>
      <PortfolioOverview metrics={metrics} />
      
      <HoldingsTable 
        enrichedHoldings={enrichedHoldings}
        holdingsCount={userData?.holdings?.length || 0}
      />
      
      <PortfolioInfo 
        virtualBalance={userData?.virtualBalance}
        lastUpdateTime={lastUpdateTime}
      />
    </>
  );
};

export default Portfolio;