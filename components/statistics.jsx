import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Statistics() {
  const stats = [
    {
      number: "45M+",
      label: "Demat Accounts in India",
      description: "Growing retail participation",
      color: "blue",
    },
    {
      number: "₹280 Cr",
      label: "Daily Retail Trading Volume",
      description: "Massive market opportunity",
      color: "purple",
    },
    {
      number: "23%",
      label: "Financial Literacy Rate",
      description: "Huge improvement potential",
      color: "blue",
    },
    {
      number: "65%",
      label: "Population Under 35",
      description: "Tech-savvy demographic",
      color: "purple",
    },
    {
      number: "750M+",
      label: "Internet Users",
      description: "Digital platform readiness",
      color: "blue",
    },
    {
      number: "$5T",
      label: "Economic Goal by 2027",
      description: "National vision alignment",
      color: "purple",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Market Opportunity & Impact Potential
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            India's financial market landscape presents unprecedented
            opportunities for educational technology and financial inclusion.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center border border-gray-200 dark:border-white/10 hover:border-blue-200 dark:hover:border-blue-700 transition-colors bg-white/80 dark:bg-gray-950 backdrop-blur-sm"
            >
              <CardHeader>
                <CardTitle
                  className={`text-4xl font-bold ${
                    stat.color === "blue"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent"
                  }`}
                >
                  {stat.number}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
