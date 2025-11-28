"use client";
import React from "react";
import { X, Bell, Trash2, CheckCircle2 } from "lucide-react";
import { useNotifications } from "./NotificationContext";

export default function NotificationPanel() {
  const {
    notifications,
    isOpen,
    closePanel,
    removeNotification,
    clearAll,
    markAsRead,
  } = useNotifications();

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closePanel}
      />

      <aside
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 h-full w-[400px] max-w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <span className="text-sm text-gray-600 font-medium">{notifications.length} total</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-red-500 hover:text-red-600 inline-flex items-center gap-1.5 transition-colors font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}

            <button
              onClick={closePanel}
              aria-label="Close notifications"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100vh-88px)] space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-600 text-center text-sm">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex gap-4 items-start p-5 rounded-xl border transition-all duration-200 ${
                  n.read 
                    ? "bg-white border-gray-200 hover:border-gray-300" 
                    : "bg-blue-50 border-blue-200 hover:border-blue-300 shadow-sm"
                }`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                    n.type === "buy" 
                      ? "bg-gradient-to-br from-green-500 to-green-600" 
                      : n.type === "sell" 
                      ? "bg-gradient-to-br from-red-500 to-red-600" 
                      : "bg-gradient-to-br from-gray-500 to-gray-600"
                  }`}>
                    <div className="text-base font-bold text-white">
                      {n.type === "buy" ? "B" : n.type === "sell" ? "S" : "!"}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm font-semibold text-gray-900 leading-relaxed">{n.message}</p>
                    {!n.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 shadow-lg shadow-blue-500/50" />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 font-medium">{n.time}</span>
                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-semibold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(n.id)}
                        className="text-xs text-red-500 hover:text-red-600 transition-colors font-semibold"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}