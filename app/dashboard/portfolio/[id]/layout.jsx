import { CardBalance } from '../../../../components/homepage/CardBalance';

export default function PortfolioLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start justify-between md:gap-96">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
            <p className="text-gray-600">Track your investment performance and holdings</p>
          </div>
          <div className='mr-20'>
          <CardBalance />
          </div>
        </div>
        
        {/* Portfolio Content */}
        {children}
      </div>
    </div>
  );
}