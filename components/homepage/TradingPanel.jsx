"use client";

import React, { useState } from 'react';
import { ShoppingCart, TrendingDown, Loader2, CheckCircle, AlertCircle, IndianRupee } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { getEnrichedHoldings } from '../../utils/portfolioUtils';
import { useStockPrices } from '../../hooks/useStockPrices';

const TradingPanel = ({ stockData, clerkId, userBalance, onBalanceUpdate }) => {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState(stockData?.ltp?.toFixed(2) || '');
  const [orderType, setOrderType] = useState('MARKET');
  const [tradeType, setTradeType] = useState('BUY'); 
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');


  const { userData, loading: userLoading, error: userError } = usePortfolioData();
  const { stockPrices, lastUpdateTime, loading: pricesLoading, error: pricesError } = useStockPrices(userData?.holdings);
  
  const enrichedHoldings = getEnrichedHoldings(userData?.holdings, stockPrices);
  

  const userHolding = enrichedHoldings?.find(holding => holding.symbol === stockData?.symbol);
  const availableShares = userHolding?.qty || 0;

  const totalCost = (parseFloat(quantity) || 0) * (parseFloat(price) || 0);
  const canAffordBuy = userBalance >= totalCost;
  const canSell = availableShares >= (parseFloat(quantity) || 0);

  const handleTrade = async () => {
    if (!quantity || !price || !clerkId) {
      setMessage('Please fill all fields');
      setMessageType('error');
      return;
    }

    if (parseFloat(quantity) <= 0) {
      setMessage('Quantity must be positive');
      setMessageType('error');
      return;
    }

    if (parseFloat(price) <= 0) {
      setMessage('Price must be positive');
      setMessageType('error');
      return;
    }

    if (tradeType === 'BUY' && !canAffordBuy) {
      setMessage('Insufficient balance');
      setMessageType('error');
      return;
    }

    if (tradeType === 'SELL' && !canSell) {
      setMessage('Insufficient shares to sell');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const endpoint = tradeType === 'BUY' ? '/api/buy-stock' : '/api/sell-stock';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId,
          symbol: stockData.symbol,
          qty: parseInt(quantity),
          price: parseFloat(price),
          orderType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${tradeType.toLowerCase()} failed`);
      }

      const action = tradeType === 'BUY' ? 'bought' : 'sold';
      setMessage(`Successfully ${action} ${quantity} shares of ${stockData.symbol}!`);
      setMessageType('success');
      
      // Update balance in parent component
      if (onBalanceUpdate) {
        onBalanceUpdate(data.newBalance);
      }

      // Reset form
      setQuantity('');
      setPrice(stockData?.ltp?.toFixed(2) || '');

      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000);

    } catch (error) {
      setMessage(error.message || `${tradeType.toLowerCase()} failed. Please try again.`);
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const suggestedQuantities = tradeType === 'SELL' && availableShares > 0
    ? [
        Math.min(1, availableShares),
        Math.min(5, availableShares),
        Math.min(10, availableShares),
        Math.min(25, availableShares),
        availableShares
      ].filter((qty, index, arr) => qty > 0 && arr.indexOf(qty) === index)
    : [1, 5, 10, 25, 50];

  const getMaxQuantity = () => {
    return tradeType === 'SELL' ? availableShares : undefined;
  };

  const isTradeDisabled = () => {
    if (!quantity || !price || isLoading) return true;
    if (tradeType === 'BUY') return !canAffordBuy;
    if (tradeType === 'SELL') return !canSell;
    return false;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" />
        Quick Trade
      </h2>

      <div className="space-y-4">
        {/* Buy/Sell Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trade Type
          </label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTradeType('BUY')}
              className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-center gap-2 ${
                tradeType === 'BUY'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              BUY
            </button>
            <button
              onClick={() => setTradeType('SELL')}
              disabled={availableShares === 0}
              className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-center gap-2 ${
                tradeType === 'SELL'
                  ? 'bg-red-600 text-white shadow-sm'
                  : availableShares === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              SELL
            </button>
          </div>
          {tradeType === 'SELL' && availableShares === 0 && (
            <p className="text-xs text-gray-500 mt-1">
              You don't own any shares of {stockData?.symbol}
            </p>
          )}
          {tradeType === 'SELL' && availableShares > 0 && (
            <p className="text-xs text-green-600 mt-1">
              You own {availableShares} shares of {stockData?.symbol}
            </p>
          )}
        </div>

        {/* Order Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Type
          </label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['MARKET', 'LIMIT'].map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                  orderType === type
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
            {tradeType === 'SELL' && availableShares > 0 && (
              <span className="text-gray-500"> (Max: {availableShares})</span>
            )}
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max={getMaxQuantity()}
            step="1"
            disabled={tradeType === 'SELL' && availableShares === 0}
          />
          
          {/* Quick quantity buttons */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {suggestedQuantities.map((qty) => (
              <button
                key={qty}
                onClick={() => setQuantity(qty.toString())}
                disabled={tradeType === 'SELL' && availableShares === 0}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  tradeType === 'SELL' && availableShares === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {qty === availableShares && tradeType === 'SELL' ? 'All' : qty}
              </button>
            ))}
          </div>
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price per Share
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={`${stockData?.ltp?.toFixed(2)}`}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
              disabled={orderType === 'MARKET'}
            />
          </div>
          {orderType === 'MARKET' && (
            <p className="text-xs text-gray-500 mt-1">
              Market orders execute at current market price
            </p>
          )}
        </div>

        {/* Order Summary */}
        {quantity && price && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-medium">{quantity} shares</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price per share:</span>
              <span className="font-medium">{formatCurrency(parseFloat(price))}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-gray-600">
                {tradeType === 'BUY' ? 'Total Cost:' : 'Total Proceeds:'}
              </span>
              <span className="font-semibold text-lg">{formatCurrency(totalCost)}</span>
            </div>
            
            {tradeType === 'BUY' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Balance:</span>
                <span className={`font-medium ${canAffordBuy ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(userBalance)}
                </span>
              </div>
            )}
            
            {tradeType === 'SELL' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Shares:</span>
                <span className={`font-medium ${canSell ? 'text-green-600' : 'text-red-600'}`}>
                  {availableShares} shares
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error/Success Message */}
        {message && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${
            messageType === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {/* Trade Button */}
        <button
          onClick={handleTrade}
          disabled={isTradeDisabled()}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isTradeDisabled()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : tradeType === 'BUY'
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : tradeType === 'BUY' ? (
            <>
              <ShoppingCart className="w-4 h-4" />
              BUY {quantity && `${quantity} Shares`}
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4" />
              SELL {quantity && `${quantity} Shares`}
            </>
          )}
        </button>

        {/* Balance/Shares Warning */}
        {tradeType === 'BUY' && !canAffordBuy && quantity && price && (
          <div className="text-center">
            <p className="text-sm text-red-600">
              Insufficient balance. Need {formatCurrency(totalCost - userBalance)} more.
            </p>
          </div>
        )}
        
        {tradeType === 'SELL' && !canSell && quantity && availableShares > 0 && (
          <div className="text-center">
            <p className="text-sm text-red-600">
              Insufficient shares. You can sell up to {availableShares} shares.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingPanel;