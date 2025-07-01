import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  StopCircle,
  TrendingUp,
  PieChart,
  Newspaper,
  Activity,
  Target,
  Shield,
  BarChart3,
} from "lucide-react";

export function KeyFeatures() {
  const features = [
    {
      icon: StopCircle,
      title: "Intelligent Stop-Loss Timing",
      description:
        "AI determines the ideal time to input stop-loss orders based on market volatility and stock behavior patterns.",
      badge: "AI-Powered",
      color: "blue",
    },
    {
      icon: TrendingUp,
      title: "Market Sentiment Analysis",
      description:
        "Real-time analysis of market sentiment using news, social media, and trading volume indicators.",
      badge: "Real-time",
      color: "purple",
    },
    {
      icon: PieChart,
      title: "Historical Analytics",
      description:
        "Access to past P/E ratios, sector performance metrics, and comprehensive historical data analysis.",
      badge: "Data-Rich",
      color: "blue",
    },
    {
      icon: Newspaper,
      title: "Sector-Specific News Aggregation",
      description:
        "Curated news feed focusing on specific sectors and stocks in your portfolio for informed decision-making.",
      badge: "Curated",
      color: "purple",
    },
    {
      icon: Activity,
      title: "Sector Drop Simulation",
      description:
        "Practice handling sector-specific market drops and learn crisis management strategies.",
      badge: "Simulation",
      color: "blue",
    },
    {
      icon: Target,
      title: "Take-Profit Recommendations",
      description:
        "AI-driven suggestions for optimal profit-taking points based on technical and fundamental analysis.",
      badge: "Smart",
      color: "purple",
    },
    {
      icon: Shield,
      title: "Portfolio Risk Analysis",
      description:
        "Comprehensive risk assessment with suggestions for diversification, Fundamental and technical analysis, and hedging strategies.",
      badge: "Risk Management",
      color: "blue",
    },
    {
      icon: BarChart3,
      title: "Benchmark Comparison",
      description:
        "Compare your portfolio performance against Nifty, Sensex, and other benchmark indices with detailed analytics.",
      badge: "Performance",
      color: "purple",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Key Platform Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Advanced AI and ML capabilities designed specifically for the Indian
            stock market ecosystem.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${
                      feature.color === "blue"
                        ? "from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20"
                        : "from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20"
                    }`}
                  >
                    <feature.icon
                      className={`h-5 w-5 ${
                        feature.color === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-purple-600 dark:text-purple-400"
                      }`}
                    />
                  </div>
                  <Badge
                    className={`text-xs border-0 ${
                      feature.color === "blue"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    }`}
                  >
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-base leading-tight">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
