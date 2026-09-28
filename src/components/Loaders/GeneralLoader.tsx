// MapView/components/Loader.tsx
import React from "react";

const GeneralLoader: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-300 rounded-full animate-spin" />
      <p className="text-white text-sm font-medium tracking-wide">Loading ...</p>
    </div>
  </div>
);

export default GeneralLoader;