// CardBalance.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff, ArrowUpRight, ArrowDownRight } from "lucide-react";

export const CardBalance = () => {
  const { user, isLoaded } = useUser();
  const [balance, setBalance] = useState(null);
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      const fetchBalance = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/users/${user.id}`);
          const data = await res.json();
          setBalance(data.virtualBalance);
        } catch (err) {
          console.error("Failed to fetch balance:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchBalance();
    }
  }, [isLoaded, user]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl h-full min-h-[240px] animate-pulse border border-slate-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        <div className="relative z-10">
          <div className="h-5 bg-white/10 rounded-lg w-28 mb-5" />
          <div className="h-10 bg-white/10 rounded-lg w-40 mb-8" />
          <div className="flex gap-3">
            <div className="h-16 bg-white/10 rounded-xl flex-1" />
            <div className="h-16 bg-white/10 rounded-xl flex-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="portfolio-card" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-slate-700/50 hover:shadow-2xl hover:border-slate-600/50 transition-all duration-500 h-full relative overflow-hidden group">
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
            {showBalance ? (
              <Eye className="w-4.5 h-4.5 text-slate-400 hover:text-white transition-colors" />
            ) : (
              <EyeOff className="w-4.5 h-4.5 text-slate-400 hover:text-white transition-colors" />
            )}
          </button>
        </div>

        <div className="mb-8">
          <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Available Balance</p>
          <p className="text-4xl font-bold text-white tracking-tight">
            {showBalance ? (
              balance !== null ? `₹${balance.toLocaleString('en-IN')}` : "₹0"
            ) : (
              "₹••••••"
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 backdrop-blur-sm group/card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-xs text-slate-400 font-medium">INCOME</p>
            </div>
            <p className="text-green-400 font-bold text-lg group-hover/card:text-green-300 transition-colors">+ ₹20,000</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-4 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 backdrop-blur-sm group/card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              </div>
              <p className="text-xs text-slate-400 font-medium">EXPENSES</p>
            </div>
            <p className="text-red-400 font-bold text-lg group-hover/card:text-red-300 transition-colors">– ₹5,340</p>
          </div>
        </div>
      </div>
    </div>
  );
};