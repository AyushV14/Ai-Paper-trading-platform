import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, GamepadIcon, BarChart3, BookOpen, Bell, Languages, Smartphone } from "lucide-react"

export function PlatformFeatures() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Portfolio Analysis",
      description: "Advanced machine learning algorithms provide personalized investment insights and risk assessment.",
      badge: "AI-Driven",
    },
    {
      icon: Shield,
      title: "Risk Management Tools",
      description: "Intelligent stop-loss suggestions, take-profit insights, and real-time risk exposure monitoring.",
      badge: "Risk Control",
    },
    {
      icon: GamepadIcon,
      title: "Gamified Learning",
      description: "Interactive challenges, leaderboards, and achievement systems to make learning engaging.",
      badge: "Engaging",
    },
    {
      icon: BarChart3,
      title: "Real-time Market Simulation",
      description: "Live NSE/BSE data integration for authentic trading experience without financial risk.",
      badge: "Real-time",
    },
    {
      icon: BookOpen,
      title: "Certification Pathways",
      description: "Structured learning modules aligned with NISM, NCFM, and other financial certifications.",
      badge: "Certified",
    },
    {
      icon: Bell,
      title: "Sector-specific News",
      description: "AI-curated news aggregation focusing on Indian markets, sectors, and economic indicators.",
      badge: "Informed",
    },
    {
      icon: Languages,
      title: "Multi-language Support",
      description: "Available in Hindi, English, and 10+ regional languages for nationwide accessibility.",
      badge: "Inclusive",
    },
    {
      icon: Smartphone,
      title: "Mobile-first Design",
      description: "Optimized for smartphones to reach India's mobile-first user base effectively.",
      badge: "Accessible",
    },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Platform Features & Capabilities</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Cutting-edge technology meets Indian market needs to deliver a comprehensive financial education and trading
            simulation experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-100 to-green-100 dark:from-orange-900/20 dark:to-green-900/20">
                    <feature.icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
