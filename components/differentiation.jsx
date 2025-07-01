import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, BookOpen, Milestone, Lightbulb } from "lucide-react";

export function Differentiation() {
  const competitors = [
    {
      name: "BullSpree",
      icon: Lightbulb,
      ourAdvantage:
        "AI-driven feedback, sentiment insights, and interactive learning for real skill-building.",
      theirWeakness:
        "Tournaments only, no personalized feedback; learning tied to expensive static courses.",
      badge: "Insightful",
    },
    {
      name: "Neostox",
      icon: Users,
      ourAdvantage:
        "AI-guided, beginner-friendly with learning paths and trade feedback.",
      theirWeakness: "Built for pros—no feedback, no educational support",
      badge: "Inclusive",
    },
    {
      name: "TradingView (India)",
      icon: Milestone,
      ourAdvantage:
        "Real-time simulation, AI-driven feedback and learning modules tailored for beginners and institutions.",
      theirWeakness:
        "Powerful charting but no guidance, no education, and no safe space to practice trades.",
      badge: "Guided",
    },
    {
      name: "Varsity by Zerodha",
      icon: BookOpen,
      ourAdvantage: "Interactive simulation with feedback loop",
      theirWeakness: "Learning by courses and lectures only",
      badge: "Practical",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            How We Stand Apart from Competition
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our unique approach combines AI with practical simulation, setting
            us apart from existing platforms in the market.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitors.map((competitor, index) => {
            const Icon = competitor.icon;
            return (
              <Card
                key={index}
                className="bg-white dark:bg-gray-950 hover:shadow-lg transition-shadow hover:border-blue-200 dark:hover:border-blue-800 "
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg border border-white/20 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/20 dark:to-purple-950/20">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>

                      <CardTitle className="text-lg text-gray-900 dark:text-white">
                        vs. {competitor.name}
                      </CardTitle>
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 text-xs">
                      {competitor.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-800 dark:text-green-400 mb-1">
                      Our Advantage:
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {competitor.ourAdvantage}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                      Their Limitation:
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {competitor.theirWeakness}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
