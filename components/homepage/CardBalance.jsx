"use client";
import React, { useEffect, useState } from "react";
import { Wallet, Eye, EyeOff, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export const CardBalance = () => {
  const { user, isLoaded } = useUser();
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(true);

  // Initial fetch
  useEffect(() => {
    if (isLoaded && user) {
      const fetchBalance = async () => {
        try {
          const res = await fetch(`/api/users/${user.id}`);
          const data = await res.json();
          setBalance(data.virtualBalance || 0);
        } catch (err) {
          console.error("Failed to fetch balance:", err);
        }
      };
      fetchBalance();
    }
  }, [isLoaded, user]);

  // Listen for topup updates
  useEffect(() => {
    const handleBalanceUpdate = (e) => {
      setBalance(e.detail);
    };
    window.addEventListener("balanceUpdated", handleBalanceUpdate);

    return () => {
      window.removeEventListener("balanceUpdated", handleBalanceUpdate);
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-slate-700/50 hover:shadow-2xl hover:border-slate-600/50 transition-all duration-500 h-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-300 tracking-wide">PORTFOLIO</span>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            {showBalance ? <Eye className="w-4.5 h-4.5 text-slate-400 hover:text-white transition-colors" /> : <EyeOff className="w-4.5 h-4.5 text-slate-400 hover:text-white transition-colors" />}
          </button>
        </div>

        <div className="mb-8">
          <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Available Balance</p>
          <p className="text-4xl font-bold text-white tracking-tight">
            {showBalance ? `₹${balance.toLocaleString('en-IN')}` : "₹••••••"}
          </p>
        </div>

        {/* Your income/expense cards */}
      </div>
    </div>
  );
};

export default CardBalance;
