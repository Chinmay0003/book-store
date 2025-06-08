// components/LoadingSpinner.tsx
import React from "react";

const LoadingSpinner = ({ size = "h-24 w-24" }: { size?: string }) => {
  return (
    <div className={`animate-spin rounded-full ${size} border-t-4 border-b-4 border-[#23395d]`}></div>
  );
};

export default LoadingSpinner;
