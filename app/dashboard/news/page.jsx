"use client";
import { useState, useEffect } from "react";
import { Newspaper, RefreshCw, AlertCircle, TrendingUp } from "lucide-react";
import NewsCard from "../../../components/NewsCard";
import Pagination from "../../../components/Pagination";
import NewsSkeletonLoader from "../../../components/NewsSkeletonLoader";

export default function NewsPage() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const pageSize = 9; // 3x3 grid
  const totalPages = 10; // You can adjust this based on API response

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const fetchNews = async (page) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/news?page=${page}&size=${pageSize}`);
      
      const data = await response.json();
      setArticles(data.results || []);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews(currentPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-black text-gray-800 flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                  <Newspaper className="text-white w-8 h-8" />
                </div>
                Market News
              </h1>
              <p className="text-gray-600 ml-16">
                Stay updated with the latest financial trends and market insights
              </p>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Stats Bar */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Articles</p>
                <p className="text-2xl font-bold text-gray-800">{articles.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Current Page</p>
                <p className="text-2xl font-bold text-gray-800">
                  {currentPage} of {totalPages}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Status</p>
                <p className="text-2xl font-bold text-green-600">Live</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 mb-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Failed to load news</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <NewsSkeletonLoader />
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Newspaper className="w-20 h-20 text-gray-300 mb-4" />
            <p className="text-xl font-semibold text-gray-600 mb-2">No news available</p>
            <p className="text-gray-500 text-sm">Check back later for updates</p>
          </div>
        ) : (
          <>
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}