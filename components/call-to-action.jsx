import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowRight, Calendar, FileText, Users } from "lucide-react";

export function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-900 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Partner with Us to Transform Financial Education
              </CardTitle>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Join us in building India's most advanced AI-driven trading
                simulation platform. Let's discuss how this innovation can
                contribute to national financial literacy and economic growth.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="mx-auto p-3 rounded-full bg-blue-100 dark:bg-blue-900 w-fit mb-3">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    Schedule Presentation
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Comprehensive platform demo and technical deep-dive
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto p-3 rounded-full bg-purple-100 dark:bg-purple-900 w-fit mb-3">
                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    Review Technical Proposal
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Detailed architecture, AI models, and implementation roadmap
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto p-3 rounded-full bg-blue-100 dark:bg-[#1a1a3c] w-fit mb-3">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    Pilot Implementation
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Start with select institutions and measure impact metrics
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
                >
                  Schedule Technical Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-200 dark:border-blue-700 dark:hover:bg-blue-900 hover:bg-blue-50"
                >
                  Download Technical Proposal
                </Button>
              </div>
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Contact: info@BharatlEarns.ai | +91-XXXX-XXXXXX
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
