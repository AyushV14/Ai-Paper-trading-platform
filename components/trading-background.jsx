"use client"

import { useEffect, useState } from "react"

export function TradingBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5 dark:opacity-10">
      {/* Floating stock symbols */}
      <div className="absolute top-20 left-10 text-6xl font-bold text-blue-600 animate-pulse">₹</div>
      <div className="absolute top-40 right-20 text-4xl font-bold text-purple-600 animate-bounce">NIFTY</div>
      <div className="absolute top-60 left-1/4 text-3xl font-bold text-blue-500 animate-pulse">BSE</div>
      <div className="absolute bottom-40 right-10 text-5xl font-bold text-purple-500 animate-bounce">📈</div>
      <div className="absolute bottom-60 left-20 text-3xl font-bold text-blue-600 animate-pulse">SENSEX</div>
      <div className="absolute top-1/3 right-1/3 text-4xl font-bold text-purple-600 animate-bounce">📊</div>

      {/* Animated lines representing charts */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4e7fee" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#863be1" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M0,400 Q200,300 400,350 T800,320 L800,500 L0,500 Z"
          fill="url(#chartGradient)"
          className="animate-pulse"
        />
        <path
          d="M200,200 Q400,150 600,180 T1000,160"
          stroke="url(#chartGradient)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
        />
      </svg>
    </div>
  )
}
