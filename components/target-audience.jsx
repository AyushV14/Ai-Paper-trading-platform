import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Briefcase, TrendingUp, Users } from "lucide-react"

export function TargetAudience() {
  const audiences = [
    {
      icon: GraduationCap,
      title: "Students & Academia",
      description:
        "College students, MBA aspirants, and educational institutions seeking practical financial education.",
      size: "15M+ students",
      benefit: "Bridge theory-practice gap",
    },
    {
      icon: Users,
      title: "Retail Investors",
      description: "Individual investors and hobby traders looking to improve their market understanding and skills.",
      size: "8M+ retail investors",
      benefit: "Skill enhancement & confidence",
    },
    {
      icon: Briefcase,
      title: "Finance Professionals",
      description: "Banking, insurance, and financial services professionals seeking continuous skill development.",
      size: "2M+ professionals",
      benefit: "Career advancement",
    },
    {
      icon: TrendingUp,
      title: "Aspiring Traders",
      description: "Individuals interested in entering financial markets but lacking practical experience.",
      size: "20M+ potential users",
      benefit: "Risk-free market entry",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Target Audience & Market Reach</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Serving diverse segments of India's population with tailored financial education and trading simulation
            experiences.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {audiences.map((audience, index) => (
            <Card
              key={index}
              className="text-center border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors"
            >
              <CardHeader>
                <div className="mx-auto p-3 rounded-full bg-gradient-to-r from-orange-100 to-green-100 dark:from-orange-900/20 dark:to-green-900/20 w-fit">
                  <audience.icon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg">{audience.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{audience.description}</p>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                    {audience.size}
                  </div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">{audience.benefit}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
