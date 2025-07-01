import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { AlertTriangle, Target, CheckCircle } from "lucide-react"

export function ProblemSolution() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Problem Statement */}
          <Card className="border-2 border-red-100 dark:border-red-300/20 bg-red-50/50 dark:bg-gray-950">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <CardTitle className="text-2xl text-red-800 dark:text-red-400">The Problem</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                India's next-gen investors lack access to <strong>risk-free, practical environments</strong> to learn
                trading with real-time data and receive personalized insights.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Most existing simulators gamify the experience but fail to provide intelligent feedback
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Real markets expose novices to irreversible financial losses
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No personalized insights or behavioral pattern analysis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Solution */}
          <Card className="border-2 border-green-100 dark:border-green-300/20 bg-green-50/50 dark:bg-gray-950">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-green-600" />
                <CardTitle className="text-2xl text-green-800 dark:text-green-400">Our Solution</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                An <strong>AI and ML-driven virtual stock market simulator</strong> that mimics real-time Indian market
                rates using virtual currency.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Personalized, portfolio-level feedback through AI-generated reports
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Highlights risk exposures, behavioral patterns, and missed opportunities
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bridges education and execution with real-world stock analytics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
