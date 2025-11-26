import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import { expandTraderAnalysis } from "../../../lib/gemini";

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
    // Force regenerate AI insights
    // ===============================
    if (forceRegenerate && lastReportDoc) {
      console.log("Force regenerating AI insights for existing report...");

      let rawApiData = lastReportDoc.rawData || lastReportDoc.data || {};

      // If no rawData exists, fetch from API
      if (Object.keys(rawApiData).length === 0) {
        const res = await fetch(
          "https://trading-analyzer-3pi8.onrender.com/api/analyze/trader/U024"
        );
        rawApiData = await res.json();
      }

      // Expand with Gemini AI
      const aiInsights = await expandTraderAnalysis(rawApiData);
      const expandedData = { ...rawApiData, aiInsights };

      // Update last report
      user.reports[user.reports.length - 1] = {
        ...lastReportDoc,
        rawData: rawApiData,
        expandedData,
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
      console.log("Creating new report...");

      const res = await fetch(
        "https://trading-analyzer-3pi8.onrender.com/api/analyze/trader/U024"
      );
      const rawApiData = await res.json();

      const aiInsights = await expandTraderAnalysis(rawApiData);
      const expandedData = { ...rawApiData, aiInsights };

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
          const aiInsights = await expandTraderAnalysis(rawApiData);
          const expandedData = { ...rawApiData, aiInsights };

          user.reports[user.reports.length - 1] = {
            ...lastReportDoc,
            rawData: rawApiData,
            expandedData,
          };
          await user.save();
          reportToReturn = expandedData;
        } catch (error) {
          console.error("Error generating AI insights:", error);
          reportToReturn = lastReportDoc.rawData || lastReportDoc.data || lastReportDoc;
        }
      } else {
        reportToReturn = lastReportDoc;
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
