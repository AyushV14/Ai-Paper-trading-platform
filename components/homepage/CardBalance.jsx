"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export const CardBalance = () => {
  const { user, isLoaded } = useUser();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      const fetchBalance = async () => {
        try {
          const res = await fetch(`/api/users/${user.id}`);
          const data = await res.json();
          setBalance(data.virtualBalance);
        } catch (err) {
          console.error("Failed to fetch balance:", err);
        }
      };

      fetchBalance();
    }
  }, [isLoaded, user]);

  return (
    <div className="bg-gradient-to-br from-[#1a1a1f] to-[#0e0e10] border border-white/10 rounded-2xl p-6 w-72 shadow-[0_10px_25px_rgba(0,0,0,0.5)] text-white font-poppins">
      <div className="mb-5">
        <p className="text-sm text-gray-400 mb-1">Available Balance</p>
        <p className="text-2xl font-semibold text-gray-100">
          {balance !== null ? `₹${balance.toLocaleString()}` : "Loading..."}
        </p>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">Income</p>
          <p className="text-green-400 font-bold text-sm">+ ₹20,000</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-1">Expenses</p>
          <p className="text-red-400 font-bold text-sm">– ₹5,340</p>
        </div>
      </div>
    </div>
  );
};
