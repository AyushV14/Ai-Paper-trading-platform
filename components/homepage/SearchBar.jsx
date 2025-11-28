"use client";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const SearchBar = ({ query, setQuery, isFocused, setIsFocused, onSelect }) => {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const delay = setTimeout(() => fetchResults(query), 350);
    return () => clearTimeout(delay);
  }, [query]);

  const fetchResults = async (text) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/search?q=${text}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    onSelect(item);
    setQuery("");
    setResults([]);
    setIsFocused(false);
    router.push(
      `/dashboard/${
        item.symbol || item.nse_scrip_code || item.bse_scrip_code || item.search_id
      }`
    );
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsFocused(false);
  };

  // Close dropdown if clicked outside searchbar container
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsFocused]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[520px] mx-auto z-50 transition-all duration-300 ${
        isFocused ? "scale-105 opacity-100" : "scale-100 opacity-100"
      }`}
    >
      <div className="relative rounded-xl border border-gray-200 bg-white/90 backdrop-blur-xl shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 px-4 py-3">
          <Search className="w-5 h-5 text-gray-600" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Search stocks, indices, ETFs..."
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-base transition-all duration-300"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {isFocused && (query || loading) && (
          <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-fade-in">
            <div className="max-h-[55vh] overflow-y-auto p-1">
              {loading && (
                <div className="p-6 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm mt-3">Searching...</p>
                </div>
              )}
              {!loading && results.length > 0 && (
                <div className="space-y-1">
                  {results.map((item, idx) => (
                    <div
                      key={`${item.id || item.search_id || idx}`}
                      onClick={() => handleSelect(item)}
                      className="px-4 py-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-900 font-medium">{item.title}</p>
                          <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                            <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">
                              {item.entity_type}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-sm">
                              {item.symbol || item.nse_scrip_code || item.bse_scrip_code}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loading && results.length === 0 && query && (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium">No results found</p>
                  <p className="text-gray-500 text-sm mt-1">Try another keyword</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
