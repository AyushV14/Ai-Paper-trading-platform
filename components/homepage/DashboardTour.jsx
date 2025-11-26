"use client";
import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour.css"; // <-- custom overrides (glassmorphism + buttons + animations)

/**
 * Exposed function so PageContent can call the same tour instance manually.
 * We'll assign to this inside the component once the driver instance is created.
 */
export let startDashboardTour = () => {};

export const DashboardTour = () => {
  const tourRef = useRef(null);

  // Create one driver instance configured with the steps
  const createTour = () =>
    driver({
      showProgress: true,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Finish",
      closeBtnText: "Close",
      overlayColor: "rgba(7, 11, 22, 0.35)", // softer overlay
      allowClose: false, // user can't click outside to close; forces explicit controls
      animate: true,
      padding: 12,
      // Provide the tour steps here (single source of truth)
      steps: [
        {
          element: "#market-header",
          popover: {
            title: "Welcome to Market Dashboard",
            description:
              "This is your central hub for real-time stock insights. Use the tour to get familiar with the layout and controls.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#market-overview",
          popover: {
            title: "Market Overview",
            description: "Quick snapshot of top movers and market health stats.",
          },
        },
        {
          element: "#watchlist-section",
          popover: {
            title: "Your Watchlist",
            description: "Track favorite stocks and live price updates here.",
          },
        },
        {
          element: "#market-movers",
          popover: {
            title: "Market Movers",
            description: "Explore trending gainers and losers across the market.",
          },
        },
        {
          element: "#market-footer",
          popover: {
            title: "Live Market Updates",
            description: "This footer shows the most recent data refresh time and status.",
          },
        },
      ],
    });

  useEffect(() => {
    // create once
    tourRef.current = createTour();

    // expose starter for manual button
    startDashboardTour = () => {
      try {
        // re-create if driver was destroyed or null
        if (!tourRef.current) tourRef.current = createTour();
        tourRef.current.drive();
      } catch (e) {
        // fallback: recreate and drive
        tourRef.current = createTour();
        tourRef.current.drive();
      }
    };

    // Auto-run tour only the first time (per-page key)
    const localKey = "tour_dashboard_seen";
    const hasSeenTour = localStorage.getItem(localKey);
    if (!hasSeenTour) {
      // small timeout to let the page settle and avoid layout jumps
      setTimeout(() => {
        tourRef.current.drive();
        localStorage.setItem(localKey, "true");
      }, 400);
    }

    // cleanup: ensure we don't leak references (not strictly necessary but tidy)
    return () => {
      tourRef.current = null;
      startDashboardTour = () => {};
    };
  }, []);

  return null;
};

export default DashboardTour;
