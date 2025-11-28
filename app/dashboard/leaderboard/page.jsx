"use client";
import { Trophy, Sparkles, Clock, Zap } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8">
      <div className="max-w-3xl w-full text-center space-y-10">

        {/* Top Badge */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/30 transform hover:scale-105 transition-transform duration-300">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg shadow-blue-500/30">
            <Sparkles className="w-4 h-4" />
            Coming Soon
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Leaderboard
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Compete with traders worldwide and climb to the top.
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rankings */}
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Rankings</h3>
            <p className="text-xs text-gray-600 text-center">Real-time trader rankings</p>
          </div>

          {/* Performance */}
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Performance</h3>
            <p className="text-xs text-gray-600 text-center">Track your progress</p>
          </div>

          {/* Rewards */}
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Rewards</h3>
            <p className="text-xs text-gray-600 text-center">Earn exclusive badges</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900 font-semibold text-lg">We're building something amazing</p>
          </div>
          <p className="text-gray-600 text-sm">
            Our team is working hard to bring you a competitive leaderboard experience. Stay tuned for updates!
          </p>
        </div>

      </div>
    </div>
  );
}
