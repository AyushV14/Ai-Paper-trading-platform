import { RefreshCw } from "lucide-react";

const ReportFooter = ({ timestamp, nextReportHours = 24 }) => {
  const formattedDate = timestamp 
    ? new Date(timestamp).toLocaleString('en-IN', { 
        dateStyle: 'long', 
        timeStyle: 'short' 
      })
    : 'N/A';

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-md p-6 text-center border border-gray-200">
      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <p className="text-gray-700 font-medium">Report Generated</p>
      </div>
      
      {/* Timestamp */}
      <p className="text-2xl font-bold text-gray-800 mb-3">{formattedDate}</p>
      
      {/* Next Report Info */}
      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
        <RefreshCw className="w-4 h-4" />
        Next report available in {nextReportHours} hours
      </div>
    </div>
  );
};

export default ReportFooter;