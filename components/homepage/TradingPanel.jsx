import React, { useState } from 'react';
import { ShoppingCart, Loader2, CheckCircle, AlertCircle, IndianRupee } from 'lucide-react';

const TradingPanel = ({ stockData, clerkId, userBalance, onBalanceUpdate }) => {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState(stockData?.ltp?.toFixed(2) || '');
  const [orderType, setOrderType] = useState('MARKET');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const totalCost = (parseFloat(quantity) || 0) * (parseFloat(price) || 0);
  const canAfford = userBalance >= totalCost;
  console.log(userBalance,"USERBALANce=====+++++++");
  

  const handleBuy = async () => {
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

    if (!canAfford) {
      setMessage('Insufficient balance');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/buy-stock', {
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
        throw new Error(data.message || 'Purchase failed');
      }

      setMessage(`Successfully bought ${quantity} shares of ${stockData.symbol}!`);
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
      setMessage(error.message || 'Purchase failed. Please try again.');
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

  const suggestedQuantities = [1, 5, 10, 25, 50];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" />
        Quick Trade
      </h2>

      <div className="space-y-4">
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
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            step="1"
          />
          
          {/* Quick quantity buttons */}
          <div className="flex gap-2 mt-2">
            {suggestedQuantities.map((qty) => (
              <button
                key={qty}
                onClick={() => setQuantity(qty.toString())}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                {qty}
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
              <span className="text-gray-600">Total Cost:</span>
              <span className="font-semibold text-lg">{formatCurrency(totalCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available Balance:</span>
              <span className={`font-medium ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(userBalance)}
              </span>
            </div>
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

        {/* Buy Button */}
        <button
          onClick={handleBuy}
          disabled={!quantity || !price || !canAfford || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            !quantity || !price || !canAfford || isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              BUY {quantity && `${quantity} Shares`}
            </>
          )}
        </button>

        {/* Balance Warning */}
        {!canAfford && quantity && price && (
          <div className="text-center">
            <p className="text-sm text-red-600">
              Insufficient balance. Need {formatCurrency(totalCost - userBalance)} more.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingPanel;