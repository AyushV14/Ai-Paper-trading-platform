import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowRight, TrendingUp, Shield, Brain } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20" />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            🚀 Next-Gen Trading Simulation
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            AI-Powered{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stock Market
            </span>{" "}
            Simulation Platform
          </h1>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Bridge the gap between financial education and real-world trading
            with our intelligent simulation platform. Practice with virtual
            currency, get AI-driven insights, and become a confident,
            market-ready investor.
          </p>
          <div className="mb-12 flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 dark:bg-gray-800/80 border border-blue-100">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">AI-Driven Insights</span>
            </div>
            <div className="flex items-center space-x-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 dark:bg-gray-800/80 border border-purple-100">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">
                Real-time NSE/BSE Data
              </span>
            </div>
            <div className="flex items-center space-x-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 dark:bg-gray-800/80 border border-blue-100">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Risk-free Learning</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              View Platform Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {/* <Button size="lg" variant="outline" className="border-blue-200 hover:bg-blue-50 bg-transparent">
              View Platform Demo
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
}
