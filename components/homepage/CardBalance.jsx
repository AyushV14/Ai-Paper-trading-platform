"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";

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
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-6 shadow-2xl h-full min-h-[200px] animate-pulse">
        <div className="h-4 bg-white/20 rounded w-24 mb-4" />
        <div className="h-8 bg-white/20 rounded w-32 mb-6" />
        <div className="flex gap-4">
          <div className="h-12 bg-white/20 rounded flex-1" />
          <div className="h-12 bg-white/20 rounded flex-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-6 shadow-2xl border border-white/10 hover:shadow-purple-500/20 transition-all duration-300 h-full backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-300">Portfolio</span>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          {showBalance ? (
            <Eye className="w-4 h-4 text-gray-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Balance */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-2">Available Balance</p>
        <p className="text-3xl font-bold text-white tracking-tight">
          {showBalance ? (
            balance !== null ? `₹${balance.toLocaleString('en-IN')}` : "₹0"
          ) : (
            "₹••••••"
          )}
        </p>
      </div>

      {/* Income/Expenses */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-xl p-3 border border-green-500/20 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            <p className="text-xs text-gray-400">Income</p>
          </div>
          <p className="text-green-400 font-bold text-sm">+ ₹20,000</p>
        </div>
        
        <div className="bg-white/5 rounded-xl p-3 border border-red-500/20 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            <p className="text-xs text-gray-400">Expenses</p>
          </div>
          <p className="text-red-400 font-bold text-sm">– ₹5,340</p>
        </div>
      </div>

      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-20 -z-10" />
    </div>
  );
};