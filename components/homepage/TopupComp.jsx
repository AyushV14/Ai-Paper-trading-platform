"use client";
import React, { useState } from 'react';
import { CreditCard, Plus, Loader2, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { useNotifications } from '../notifications/NotificationContext'; 

const TopupComp = ({ clerkId, currentBalance, onBalanceUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const { addNotification, openPanel } = useNotifications(); 

  const topupOptions = [
    { amount: 10000, label: '₹10K' },
    { amount: 20000, label: '₹20K' },
    { amount: 50000, label: '₹50K' },
  ];

  const handleTopup = async (amount) => {
    setIsLoading(true);
    setMessage('');
    setIsOpen(false);

    try {
      const response = await fetch('/api/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Topup failed');
      }

      const data = await response.json();

      setMessage(`+₹${(amount/1000)}K added!`);
      setMessageType('success');

      // Update balance in parent
      if (onBalanceUpdate) {
        onBalanceUpdate(data.user.virtualBalance);
      }

      // Dispatch event for CardBalance
      window.dispatchEvent(new CustomEvent('balanceUpdated', { detail: data.user.virtualBalance }));

      // ⭐ Add notification
      addNotification(`Added ₹${(amount/1000)}K to your balance`, 'topup');
      openPanel();

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      setMessage('Topup failed');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBalance = (amount) => {
    if (amount >= 100000) return `₹${(amount/100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount/1000).toFixed(0)}K`;
    return `₹${amount}`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-600" />
          <div>
            <p className="text-xs font-medium text-gray-700">Balance</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatBalance(currentBalance || 0)}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={isLoading}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <Plus className="w-3 h-3" />
                <span>Top Up</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {topupOptions.map((option) => (
                <button
                  key={option.amount}
                  onClick={() => handleTopup(option.amount)}
                  className="w-full px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className={`p-2 rounded text-xs flex items-center gap-1 mb-2 ${
          messageType === 'success' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {messageType === 'success' ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <AlertCircle className="w-3 h-3" />
          )}
          <span>{message}</span>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export default TopupComp;
