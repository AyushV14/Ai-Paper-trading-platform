import { Brain, ChartNoAxesCombinedIcon, TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            {/* <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Brain className="h-5 w-5 text-white" /> */}
            <div className="p-2 rounded-lg bg-black">
              <ChartNoAxesCombinedIcon className="h-6 w-6 text-white" />
            </div>

            {/* Branding text */}
            <div>
              <h1 className="text-xl font-semibold text-white dark:text-white">
                BharatlEarns
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-400">
                Analyse, Optimise, Grow
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400 mb-2">
              Empowering India's next generation of intelligent investors
            </p>
            <p className="text-xs text-gray-500">
              © 2025 BharatlEarns. Building the future of financial education in
              India.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
