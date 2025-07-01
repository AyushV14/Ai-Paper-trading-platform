import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { GraduationCap, Building2, TrendingUp, Users } from "lucide-react";

export function NationalImpact() {
  const impacts = [
    {
      icon: GraduationCap,
      title: "Educational Enhancement",
      description:
        "Bridge the gap between theoretical financial education and practical market experience across Indian institutions.",
      stats: "Target: 5M+ students",
      color: "blue",
    },
    {
      icon: Building2,
      title: "Market Participation",
      description:
        "India has 9.5 Cr+ retail investors with over ₹64 lakh crore in equity and mutual fund assets. Our platform promotes risk-aware investing and smarter capital deployment, boosting market depth and stability.",
      stats: "Impact: ₹50,000 Cr+ potential",
      color: "purple",
    },
    {
      icon: Users,
      title: "Skill Development",
      description:
        "Create a skilled workforce in financial services, supporting India's fintech and banking sector growth.",
      stats: "Skills: 10M+ professionals",
      color: "blue",
    },
    {
      icon: TrendingUp,
      title: "Economic Growth",
      description:
        "Support India's vision of becoming a $5 trillion economy through improved financial decision-making capabilities.",
      stats: "Vision: $5T economy by 2027",
      color: "purple",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            National Impact & Vision
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Contributing to India's economic development through enhanced
            financial literacy and market participation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, index) => (
            <Card
              key={index}
              className="text-center border border-gray-200 dark:border-white/10 hover:border-blue-200 dark:hover:border-blue-700 transition-colors bg-white/80 dark:bg-gray-950 "
            >
              <CardHeader>
                <div
                  className={`mx-auto p-3 rounded-full w-fit ${
                    impact.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-950"
                      : "bg-purple-100 dark:bg-purple-950"
                  }`}
                >
                  <impact.icon
                    className={`h-8 w-8 ${
                      impact.color === "blue"
                        ? "text-blue-600 dark:text-white"
                        : "text-purple-600 dark:text-white"
                    }`}
                  />
                </div>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  {impact.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {impact.description}
                </p>
                <div
                  className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
                    impact.color === "blue"
                      ? "text-white bg-blue-500"
                      : "text-white bg-purple-500"
                  }`}
                >
                  {impact.stats}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
