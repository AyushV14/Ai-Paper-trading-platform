"use client";

import React from "react";

export const StockCard = () => {

  return (
    <div className="rounded-xl border p-3 shadow-sm bg-white h-full animate-pulse">
        <div className="mb-2 h-6 w-6 rounded-full bg-gray-200" />
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded mb-1" />
        <div className="h-4 bg-gray-200 rounded" />
      </div>
  );
};
