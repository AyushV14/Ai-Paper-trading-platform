"use client";
import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour.css"; // Uses your existing tour.css

/**
 * Exposed function so the Stock Details page can call the tour manually.
 */
export let startStockDetailsTour = () => {};

export const StockDetailsTour = () => {
  const tourRef = useRef(null);

  // Create one driver instance configured with the steps
  const createTour = () =>
    driver({
      showProgress: true,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Finish",
      closeBtnText: "Close",
      overlayColor: "rgba(7, 11, 22, 0.35)",
      allowClose: false,
      animate: true,
      padding: 12,
      steps: [
        {
          element: "#stock-header",
          popover: {
            title: "Welcome to Stock Details",
            description:
              "This is your complete stock analysis hub. Get real-time price data, interactive charts, and execute trades instantly. Let's explore the features!",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#stock-price-card",
          popover: {
            title: "Live Stock Price",
            description:
              "Monitor real-time price movements with current LTP (Last Traded Price), day change, and percentage gains or losses. The color indicators help you spot trends at a glance.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#stock-stats",
          popover: {
            title: "Daily Trading Stats",
            description:
              "View essential trading metrics including opening price, daily high/low ranges, and trading volume. These numbers help you understand today's market activity.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#stock-chart-section",
          popover: {
            title: "Interactive Price Chart",
            description:
              "Visualize price movements across different time periods. Switch between 1D, 1W, 1M, 1Y, and 5Y views to analyze short-term fluctuations or long-term trends.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#chart-timeframes",
          popover: {
            title: "Timeframe Selection",
            description:
              "Click any timeframe button to change the chart view. Each period gives you different insights - use 1D for intraday trading or 5Y for long-term analysis.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#trading-panel",
          popover: {
            title: "Quick Trading Panel",
            description:
              "Execute buy and sell orders instantly. This panel shows your available balance, validates trades in real-time, and provides order summaries before execution.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#trade-type-toggle",
          popover: {
            title: "Buy or Sell",
            description:
              "Toggle between BUY and SELL modes. The panel automatically adjusts to show your available balance (for buying) or owned shares (for selling).",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#order-type-selection",
          popover: {
            title: "Order Type",
            description:
              "Choose between MARKET orders (execute at current price) or LIMIT orders (set your preferred price). MARKET orders are faster but LIMIT gives you price control.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#quantity-input",
          popover: {
            title: "Quantity Selection",
            description:
              "Enter the number of shares you want to trade. Use quick buttons (1, 5, 10, 25, 50) for convenience, or the 'All' button to sell your entire holding.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#price-input",
          popover: {
            title: "Price Per Share",
            description:
              "Set your desired price for LIMIT orders. For MARKET orders, this field is disabled as trades execute at the current market price automatically.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#order-summary",
          popover: {
            title: "Order Summary",
            description:
              "Review your trade details before executing. See the total cost (for buys) or proceeds (for sells), and verify your available balance or shares.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#key-metrics",
          popover: {
            title: "Key Metrics",
            description:
              "Important stock fundamentals including previous close, day range, volume, and market cap. Use these metrics to assess the stock's performance and value.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#recent-activity",
          popover: {
            title: "Recent Activity",
            description:
              "Track the latest trading activity including most recent trade price, today's volume, and day change. These live updates keep you informed of market movements.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#live-market-indicator",
          popover: {
            title: "Market Status",
            description:
              "The green pulsing indicator shows you're viewing live market data. All prices and charts update automatically during market hours.",
            side: "bottom",
            align: "end",
          },
        },
      ],
    });

  useEffect(() => {
    // Create tour instance once
    tourRef.current = createTour();

    // Expose starter for manual button
    startStockDetailsTour = () => {
      try {
        if (!tourRef.current) tourRef.current = createTour();
        tourRef.current.drive();
      } catch (e) {
        tourRef.current = createTour();
        tourRef.current.drive();
      }
    };

    // Auto-run tour only the first time (per-page key)
    const localKey = "tour_stock_details_seen";
    const hasSeenTour = localStorage.getItem(localKey);
    if (!hasSeenTour) {
      setTimeout(() => {
        tourRef.current.drive();
        localStorage.setItem(localKey, "true");
      }, 600);
    }

    // Cleanup
    return () => {
      tourRef.current = null;
      startStockDetailsTour = () => {};
    };
  }, []);

  return null;
};

export default StockDetailsTour;