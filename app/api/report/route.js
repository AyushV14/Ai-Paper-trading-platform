import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import { analyzeTrading } from "../../../lib/tradingAnalyzer";
import { generateInsights } from "../../../lib/insightsGenerator";
import { expandTraderAnalysis } from "../../../lib/gemini";

// Helper function to infer trader type
function inferTraderType(analysis) {
  const avgHoldingTime = analysis?.user_summary?.avg_holding_time || 0;
  const tradesPerDay = analysis?.user_summary?.trading_frequency?.trades_per_day || 0;

  if (avgHoldingTime < 0.1 && tradesPerDay > 10) return 'SCALPER';
  if (avgHoldingTime <= 1 && tradesPerDay >= 2) return 'DAY_TRADER';
  if (avgHoldingTime <= 14 && tradesPerDay >= 0.1) return 'SWING_TRADER';
  return 'POSITION_TRADER';
}

// Note: TensorFlow.js ML models are initialized on first use
// For server-side, we use quick heuristic predictions
// Full ML predictions available in client-side components

export async function POST(req) {
  try {
    await dbConnect();

    const { userId, createNew, forceRegenerate } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get last report
    const lastReportDoc = user.reports?.[user.reports.length - 1];
    const now = new Date();
    const diffDays = lastReportDoc
      ? (now - new Date(lastReportDoc.generatedAt)) / (1000 * 60 * 60 * 24)
      : Infinity;

    // ===============================
    // Force regenerate insights
    // ===============================
    if (forceRegenerate && lastReportDoc) {
      console.log("Force regenerating insights for existing report...");

      // ALWAYS regenerate raw data from current trades/holdings
      // This ensures latest sector data and metrics are used
      const rawApiData = analyzeTrading(
        user.trades || [],
        user.holdings || [],
        user.virtualBalance || 100000
      );

      // Generate insights using Gemini AI (with local fallback)
      let aiInsights;
      try {
        console.log("Generating insights with Gemini AI...");
        aiInsights = await expandTraderAnalysis(rawApiData);
        // Add traderPrediction for compatibility
        aiInsights.traderPrediction = {
          predicted_type: inferTraderType(rawApiData),
          confidence: 0.85,
        };
      } catch (geminiError) {
        console.error("Gemini AI failed, falling back to local generator:", geminiError);
        aiInsights = generateInsights(rawApiData);
      }

      const expandedData = { 
        ...rawApiData, 
        aiInsights,
        trader_prediction: aiInsights.traderPrediction,
      };

      // Update last report
      user.reports[user.reports.length - 1] = {
        ...lastReportDoc.toObject ? lastReportDoc.toObject() : lastReportDoc,
        rawData: rawApiData,
        expandedData,
        generatedAt: lastReportDoc.generatedAt,
      };
      await user.save();

      return NextResponse.json({
        allowed: false,
        lastReport: expandedData,
      });
    }

    // ===============================
    // Create new report if allowed
    // ===============================
    if (createNew && diffDays >= 1) {
      console.log("Creating new report from local analysis...");

      // Analyze user's actual trades from MongoDB
      const rawApiData = analyzeTrading(
        user.trades || [],
        user.holdings || [],
        user.virtualBalance || 100000
      );

      // Generate insights using Gemini AI (with local fallback)
      let aiInsights;
      try {
        console.log("Generating insights with Gemini AI...");
        aiInsights = await expandTraderAnalysis(rawApiData);
        aiInsights.traderPrediction = {
          predicted_type: inferTraderType(rawApiData),
          confidence: 0.85,
        };
      } catch (geminiError) {
        console.error("Gemini AI failed, falling back to local generator:", geminiError);
        aiInsights = generateInsights(rawApiData);
      }

      const expandedData = { 
        ...rawApiData, 
        aiInsights,
        trader_prediction: aiInsights.traderPrediction,
      };

      // Save report
      user.reports = user.reports || [];
      user.reports.push({
        generatedAt: now,
        rawData: rawApiData,
        expandedData,
      });

      user.reportCount = (user.reportCount || 0) + 1;
      await user.save();

      return NextResponse.json({
        allowed: false,
        lastReport: expandedData,
      });
    }

    // ===============================
    // Return existing report
    // ===============================
    let reportToReturn = null;

    if (lastReportDoc) {
      if (lastReportDoc.expandedData) {
        reportToReturn = lastReportDoc.expandedData;
      } else if (lastReportDoc.rawData || lastReportDoc.data) {
        const rawApiData = lastReportDoc.rawData || lastReportDoc.data;

        try {
          // Generate insights using Gemini AI (with local fallback)
          let aiInsights;
          try {
            aiInsights = await expandTraderAnalysis(rawApiData);
            aiInsights.traderPrediction = {
              predicted_type: inferTraderType(rawApiData),
              confidence: 0.85,
            };
          } catch (geminiError) {
            console.error("Gemini failed, using local:", geminiError);
            aiInsights = generateInsights(rawApiData);
          }

          const expandedData = { 
            ...rawApiData, 
            aiInsights,
            trader_prediction: aiInsights.traderPrediction,
          };

          // Update stored report
          user.reports[user.reports.length - 1] = {
            ...lastReportDoc.toObject ? lastReportDoc.toObject() : lastReportDoc,
            rawData: rawApiData,
            expandedData,
          };
          await user.save();
          reportToReturn = expandedData;
        } catch (error) {
          console.error("Error generating insights:", error);
          reportToReturn = lastReportDoc.rawData || lastReportDoc.data || lastReportDoc;
        }
      } else {
        // Legacy report without structured data - regenerate from trades
        const rawApiData = analyzeTrading(
          user.trades || [],
          user.holdings || [],
          user.virtualBalance || 100000
        );
        let aiInsights;
        try {
          aiInsights = await expandTraderAnalysis(rawApiData);
          aiInsights.traderPrediction = {
            predicted_type: inferTraderType(rawApiData),
            confidence: 0.85,
          };
        } catch (e) {
          aiInsights = generateInsights(rawApiData);
        }
        reportToReturn = { 
          ...rawApiData, 
          aiInsights,
          trader_prediction: aiInsights.traderPrediction,
        };
      }
    }

    return NextResponse.json({
      allowed: diffDays >= 1,
      lastReport: reportToReturn,
    });
  } catch (err) {
    console.error("Error in /api/report:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * GET endpoint to check report status
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const lastReport = user.reports?.[user.reports.length - 1];
    const now = new Date();
    const diffDays = lastReport
      ? (now - new Date(lastReport.generatedAt)) / (1000 * 60 * 60 * 24)
      : Infinity;

    return NextResponse.json({
      hasReport: !!lastReport,
      canGenerate: diffDays >= 1,
      lastGeneratedAt: lastReport?.generatedAt || null,
      reportCount: user.reportCount || 0,
      tradesCount: user.trades?.length || 0,
      holdingsCount: user.holdings?.length || 0,
    });
  } catch (err) {
    console.error("Error in GET /api/report:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
