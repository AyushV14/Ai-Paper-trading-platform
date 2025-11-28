"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from "react";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch {
        setNotifications([]);
      }
    }
  }, []);

  // ✅ Save notifications to localStorage on every update
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((message, type = "info",imageUrl = null) => {
    const newNote = {
      id: Date.now().toString(),
      message,
      type,
      time: new Date().toLocaleTimeString(),
      read: false,
      imageUrl,
    };

    setNotifications((prev) => [newNote, ...prev]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const openPanel = useCallback(() => setIsOpen(true), []);
  const closePanel = useCallback(() => setIsOpen(false), []);
  const togglePanel = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        markAsRead,
        isOpen,
        openPanel,
        closePanel,
        togglePanel,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
