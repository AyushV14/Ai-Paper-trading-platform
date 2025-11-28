"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { TrendingUp, Target, AlertTriangle, Lightbulb, BarChart3, RefreshCw } from "lucide-react";

// Import all components
import UserHeader from "../../../components/UserHeader";
import QuickStatsCard from "../../../components/QuickStatsCard";
import FlipCard from "../../../components/FlipCard";
import ExpandableSection from "../../../components/ExpandableSection";
import TradingStyleCard from "../../../components/TradingStyleCard";
import MostTradedStocks from "../../../components/MostTradedStocks";
import ReportFooter from "../../../components/ReportFooter";
import LoadingSkeleton from "../../../components/LoadingSkeleton";
import TradingScoreCard from "../../../components/TradingScoreCard";
import NextMilestoneCard from "../../../components/NextMilestoneCard";
import CelebrationCard from "../../../components/CelebrationCard";
import TopOpportunityCard from "../../../components/TopOpportunityCard";
import PsychologicalProfileCard from "../../../components/PsychologicalProfileCard";

const AnalyzeUser = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [lastReport, setLastReport] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    
    async function checkReport() {
      try {
        const res = await fetch("/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await res.json();
        setAllowed(data.allowed);
        setLastReport(data.lastReport || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    checkReport();
  }, [isLoaded, user]);

  async function handleCreateReport() {
    setGenerating(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, createNew: true }),
      });
      const data = await res.json();
      
      if (data.error) {
        alert(data.error);
      } else {
        setAllowed(false);
        setLastReport(data.lastReport);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  }

  async function handleRegenerateInsights() {
    setGenerating(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, forceRegenerate: true }),
      });
      const data = await res.json();
      
      if (data.error) {
        alert(data.error);
      } else {
        setLastReport(data.lastReport);
        alert("AI insights regenerated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to regenerate insights");
    } finally {
      setGenerating(false);
    }
  }

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Generate new report state
  if (allowed) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold mb-4">Generate Your Trading Report</h2>
          <p className="text-gray-600 mb-6">
            Get AI-powered insights into your trading performance and personalized recommendations.
          </p>
          <button
            onClick={handleCreateReport}
            disabled={generating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {generating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating AI Insights...
              </>
            ) : (
              "Create New Report"
            )}
          </button>
          {generating && (
            <p className="mt-4 text-sm text-gray-500">
              This may take 10-30 seconds while AI analyzes your data...
            </p>
          )}
        </div>
      </div>
    );
  }

  // No report available
  if (!lastReport) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-gray-100 rounded-lg p-8">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No reports available yet.</p>
          <p className="text-sm text-gray-500 mt-2">Generate your first trading report to get started!</p>
        </div>
      </div>
    );
  }

  // Extract data safely with fallbacks
  const userSummary = lastReport.user_summary || {};
  const traderPrediction = lastReport.trader_prediction || {};
  const aiInsights = lastReport.aiInsights || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* User Header */}
        <UserHeader 
          name={user?.fullName || user?.firstName}
          email={user?.primaryEmailAddress?.emailAddress}
          profileImage={user?.imageUrl}
          virtualBalance={100000}
        />

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickStatsCard
            icon={BarChart3}
            label="Total Trades"
            value={userSummary.total_trades || 0}
            color="border-blue-600"
            info="Total number of trades executed till date."
          />
          <QuickStatsCard
            icon={TrendingUp}
            label="Win Rate"
            value={`${userSummary.win_rate ? (userSummary.win_rate * 100).toFixed(0) : 0}%`}
            color="border-green-600"
            subtext={userSummary.win_rate > 0.6 ? "Above average" : ""}
            info="Percentage of trades you won out of all executed trades."
          />

          <QuickStatsCard
            icon={Target}
            label="Avg Profit"
            value={`${userSummary.avg_profit ? userSummary.avg_profit.toFixed(1) : 0}%`}
            color="border-purple-600"
            info="Average profit per trade based on your trading history."
          />

          <QuickStatsCard
            icon={BarChart3}
            label="Trader Type"
            value={traderPrediction.predicted_type || "N/A"}
            color="border-indigo-600"
            subtext={traderPrediction.confidence ? `${(traderPrediction.confidence * 100).toFixed(0)}% confidence` : ""}
            info="AI-based prediction of your trading style."
          />
        </div>


        {/* AI Insights Section */}
        {aiInsights ? (
          <>
            {/* Celebration Banner */}
            {aiInsights.celebrationMoment && (
              <CelebrationCard achievement={aiInsights.celebrationMoment} />
            )}

            {/* Trading Score */}
            {aiInsights.tradingScore !== undefined && (
              <TradingScoreCard
                score={aiInsights.tradingScore}
                justification={`Based on your ${(userSummary.win_rate * 100).toFixed(0)}% win rate and consistent trading pattern.`}
              />
            )}

            {/* Top Opportunity & Next Milestone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiInsights.topOpportunity && (
                <TopOpportunityCard opportunity={aiInsights.topOpportunity} />
              )}
              {aiInsights.nextMilestone && (
                <NextMilestoneCard milestone={aiInsights.nextMilestone} />
              )}
            </div>

            {/* Trading Style */}
            <TradingStyleCard tradingStyle={aiInsights.tradingStyle} />

            {/* Psychological Profile */}
            {aiInsights.psychologicalProfile && (
              <PsychologicalProfileCard profile={aiInsights.psychologicalProfile} />
            )}

            {/* Flip Cards Grid for Strengths, Improvements, Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiInsights.strengths && aiInsights.strengths.length > 0 && (
                <FlipCard
                  title="Your Strengths"
                  icon={Target}
                  iconColor="text-green-600"
                  items={aiInsights.strengths}
                  type="strengths"
                />
              )}

              {aiInsights.improvements && aiInsights.improvements.length > 0 && (
                <FlipCard
                  title="Growth Areas"
                  icon={AlertTriangle}
                  iconColor="text-orange-600"
                  items={aiInsights.improvements}
                  type="improvements"
                />
              )}

              {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                <FlipCard
                  title="Action Plan"
                  icon={Lightbulb}
                  iconColor="text-yellow-600"
                  items={aiInsights.recommendations}
                  type="recommendations"
                />
              )}
            </div>

            {/* Risk Assessment - Expandable */}
            {aiInsights.riskAssessment && (
              <ExpandableSection
                title="Risk Assessment"
                content={aiInsights.riskAssessment}
                icon={AlertTriangle}
                bgColor="bg-red-50"
                textColor="text-red-900"
              />
            )}
          </>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-medium">⚠️ AI insights not yet generated</p>
              <p className="text-yellow-700 text-sm mt-2">Click the button to get personalized analysis.</p>
            </div>
            <button
              onClick={handleRegenerateInsights}
              disabled={generating}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Generate AI Insights
                </>
              )}
            </button>
          </div>
        )}

        {/* Most Traded Stocks */}
        <MostTradedStocks stocks={userSummary.most_traded_stocks} />

        {/* Report Footer */}
        <ReportFooter
          timestamp={lastReport.analysis_timestamp}
          nextReportHours={24}
        />
      </div>
    </div>
  );
};

export default AnalyzeUser;