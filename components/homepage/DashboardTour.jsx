"use client";
import { useEffect, useRef } from "react";
import { driver } from "driver.js"; // named import
import "driver.js/dist/driver.css";
import "./tour.css";

export let startDashboardTour = () => {};

export const DashboardTour = () => {
  const tourRef = useRef(null);

  const createTour = () =>
    driver({
      showProgress: true,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Finish",
      closeBtnText: "Close",
      overlayColor: "rgba(0, 0, 0, 0.5)",
      allowClose: false,
      animate: true,
      padding: 12,
      stageBackground: "#fff",
      steps: [
        {
          element: "#market-header",
          popover: {
            title: "Welcome to Market Dashboard",
            description:
              "This is your central hub for real-time stock insights. Let's take a quick tour to get familiar.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#search-bar",
          popover: {
            title: "Search Stocks",
            description: "Use this search bar to find any stock or company instantly.",
            side: "bottom",
          },
        },
        {
          element: "#notification-btn",
          popover: {
            title: "Notifications",
            description:
              "Click here to view recent alerts, updates, or news about your stocks.",
            side: "left",
          },
        },
        {
          element: "#watchlist-section",
          popover: {
            title: "Your Watchlist",
            description:
              "Track your favorite stocks here. You can add new ones by clicking the plus button.",
          },
        },
        {
          element: ".watchlist-add-btn",
          popover: {
            title: "Add to Watchlist",
            description: "Click the '+' button on any stock to add it to your watchlist.",
            side: "top",
          },
        },
        {
          element: "#market-overview",
          popover: {
            title: "Market Overview",
            description: "See quick stats about gainers, losers, and volume.",
          },
        },
        {
          element: "#portfolio-card",
          popover: {
            title: "Portfolio Balance",
            description:
              "Your total portfolio balance is displayed here. You can toggle visibility.",
            side: "top",
          },
        },
        {
          element: "#market-movers",
          popover: {
            title: "Top Gainers & Losers",
            description: "Keep an eye on trending stocks. Gainers in green, losers in red.",
          },
        },
        {
          element: "#market-footer",
          popover: {
            title: "Live Market Updates",
            description:
              "This footer shows the latest market update time and status.",
          },
        },
      ],
    });

  useEffect(() => {
    tourRef.current = createTour();

    // Expose start function
    startDashboardTour = () => {
      try {
        if (!tourRef.current) tourRef.current = createTour();
        tourRef.current.drive();
      } catch (e) {
        tourRef.current = createTour();
        tourRef.current.drive();
      }
    };

    // Auto-start if not seen
    const localKey = "tour_dashboard_seen";
    const hasSeenTour = localStorage.getItem(localKey);
    if (!hasSeenTour) {
      setTimeout(() => {
        tourRef.current.drive();
        localStorage.setItem(localKey, "true");
      }, 400);
    }

    return () => {
      tourRef.current = null;
      startDashboardTour = () => {};
    };
  }, []);

  return null;
};

export default DashboardTour;
