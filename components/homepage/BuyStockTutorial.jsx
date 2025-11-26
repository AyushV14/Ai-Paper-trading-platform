"use client";
import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour.css";

/**
 * Exposed function for manual start of the buy stock tutorial
 */
export let startBuyStockTutorial = () => {};

export const BuyStockTutorial = () => {
  const tourRef = useRef(null);

  const createTutorial = () =>
    driver({
      showProgress: true,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Start Trading!",
      closeBtnText: "Skip",
      overlayColor: "rgba(7, 11, 22, 0.35)",
      allowClose: true, // Allow users to skip the tutorial
      animate: true,
      padding: 12,
      steps: [
        {
          popover: {
            title: "🎓 Learn to Buy Your First Stock!",
            description:
              "Welcome to the interactive trading tutorial! We'll walk you through buying a stock step-by-step. This is a hands-on guide - you can follow along or just watch. Let's get started!",
            side: "center",
            align: "center",
          },
        },
        {
          element: "#trading-panel",
          popover: {
            title: "Step 1: Your Trading Panel",
            description:
              "This is your control center for all trades. Here you'll set up your order details including what to buy, how much, and at what price. Everything you need is right here!",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#trade-type-toggle",
          popover: {
            title: "Step 2: Choose BUY Mode",
            description:
              "First, make sure BUY is selected (it should be green). This tells the system you want to purchase shares. The SELL option is for when you already own shares and want to sell them.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#order-type-selection",
          popover: {
            title: "Step 3: Select Order Type",
            description:
              "For beginners, MARKET orders are easiest - they buy at the current price instantly. LIMIT orders let you set your own price, but might not execute immediately. Let's stick with MARKET for now!",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#quantity-input",
          popover: {
            title: "Step 4: Enter Quantity",
            description:
              "Now decide how many shares you want to buy. Start small if you're learning! Try clicking one of the quick buttons (1, 5, 10) or type your own number. Remember: more shares = higher cost!",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#stock-price-card",
          popover: {
            title: "Check the Current Price",
            description:
              "Before buying, always check the current price (LTP - Last Traded Price) shown here. This is what you'll pay per share for a MARKET order. Watch for the green or red indicator to see if the stock is up or down today.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#price-input",
          popover: {
            title: "Step 5: Price Per Share",
            description:
              "Since you chose MARKET order, this field is auto-filled with the current price. For LIMIT orders, you'd set your own price here. The total cost updates automatically as you change quantity!",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#order-summary",
          popover: {
            title: "Step 6: Review Your Order",
            description:
              "This is crucial! Always review your order summary before buying. Check the quantity, price per share, and total cost. Make sure you have enough balance (shown in green if you do, red if you don't).",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#trading-panel",
          popover: {
            title: "Step 7: Execute the Trade",
            description:
              "Once everything looks good, click the big green BUY button at the bottom! The button shows exactly what you're buying (e.g., 'BUY 5 Shares'). If it's gray and disabled, check that you've filled all fields and have sufficient balance.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#stock-stats",
          popover: {
            title: "💡 Pro Tip: Study the Stats",
            description:
              "Before buying any stock, check these key metrics: Open (starting price), High/Low (price range today), and Volume (how many shares traded). These help you understand if it's a good time to buy!",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#stock-chart-section",
          popover: {
            title: "💡 Pro Tip: Analyze the Chart",
            description:
              "Study the price chart to see trends. Is the stock going up or down? Use different timeframes (1D, 1W, 1M, 1Y) to see short-term vs long-term patterns. Buy low, sell high is the golden rule!",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#key-metrics",
          popover: {
            title: "💡 Pro Tip: Research First",
            description:
              "Always research before buying! Check the previous close, day range, and market cap. These fundamentals help you make informed decisions. Never invest money you can't afford to lose!",
            side: "top",
            align: "start",
          },
        },
        {
          popover: {
            title: "🎉 You're Ready to Trade!",
            description:
              "Congratulations! You now know how to buy stocks. Remember: Start small, do your research, and never invest more than you can afford to lose. Practice makes perfect - try buying your first share now!",
            side: "center",
            align: "center",
          },
        },
      ],
      onDestroyed: () => {
        // Mark tutorial as seen when completed or skipped
        localStorage.setItem("tutorial_buy_stock_seen", "true");
      },
    });

  useEffect(() => {
    tourRef.current = createTutorial();

    // Expose starter for manual button
    startBuyStockTutorial = () => {
      try {
        if (!tourRef.current) tourRef.current = createTutorial();
        tourRef.current.drive();
      } catch (e) {
        tourRef.current = createTutorial();
        tourRef.current.drive();
      }
    };

    // Auto-run tutorial only if the overview tour has been seen but this hasn't
    const localKey = "tutorial_buy_stock_seen";
    const overviewSeenKey = "tour_stock_details_seen";
    const hasSeenTutorial = localStorage.getItem(localKey);
    const hasSeenOverview = localStorage.getItem(overviewSeenKey);

    // Only auto-run if user has seen the overview tour but not this tutorial
    if (hasSeenOverview && !hasSeenTutorial) {
      setTimeout(() => {
        tourRef.current.drive();
      }, 1000); // Longer delay since this comes after overview
    }

    // Cleanup
    return () => {
      tourRef.current = null;
      startBuyStockTutorial = () => {};
    };
  }, []);

  return null;
};

export default BuyStockTutorial;