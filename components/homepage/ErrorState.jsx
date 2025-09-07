import React from 'react';

const ErrorState = ({ error, message = "Please try refreshing the page." }) => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <p className="text-gray-500 mt-2">{message}</p>
      </div>
    </div>
  );
};

export default ErrorState;