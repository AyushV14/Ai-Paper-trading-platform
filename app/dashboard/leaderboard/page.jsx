"use client";
import { useState, useEffect } from "react";
import { Trophy, Medal, Loader2 } from "lucide-react";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setLeaders(data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-8 bg-gradient-to-b from-gray-50 to-white text-gray-800 h-full w-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Leaderboard
          </h1>
          <p className="text-gray-500 mt-1">
            Top performers ranked by their virtual trading performance.
          </p>
        </div>
        <button
          onClick={fetchLeaders}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Refresh Rankings
        </button>
      </div>

      {/* Main Leaderboard */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wide">
                <tr>
                  <th className="py-3 px-6">Rank</th>
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {leaders?.map((leader, idx) => (
                  <tr
                    key={leader._id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 font-semibold text-gray-700 flex items-center gap-2">
                      {idx === 0 && <Medal className="text-yellow-500" size={18} />}
                      {idx === 1 && <Medal className="text-gray-400" size={18} />}
                      {idx === 2 && <Medal className="text-amber-600" size={18} />}
                      {idx > 2 && <span className="text-gray-500 font-medium">#{idx + 1}</span>}
                    </td>
                    <td className="py-4 px-6 text-gray-800 font-medium flex items-center gap-2">
                      {leader.profileImage && (
                        <img
                          src={leader.profileImage}
                          alt={leader.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      {leader.name}
                    </td>
                    <td className="py-4 px-6 text-right text-blue-600 font-semibold">
                      ₹{leader.virtualBalance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
