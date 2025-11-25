import React from 'react';

interface ScanningOverlayProps {
  targetFound: boolean;
  onScanStart?: () => void;
}

export const ScanningOverlay: React.FC<ScanningOverlayProps> = ({ targetFound }) => {
  if (targetFound) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
      <div className="bg-black/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center animate-pulse">
        <div className="w-16 h-16 border-4 border-yellow-400 border-dashed rounded-full animate-spin mb-4 mx-auto"></div>
        <h2 className="text-white text-xl font-bold font-sans">Scan the Marker</h2>
        <p className="text-gray-200 text-sm mt-2">Point your camera at the target image</p>
      </div>
      
      {/* Visual Reticle */}
      <div className="absolute w-64 h-64 border-2 border-white/50 rounded-lg">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-yellow-400 -mt-1 -ml-1"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-yellow-400 -mt-1 -mr-1"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-yellow-400 -mb-1 -ml-1"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-yellow-400 -mb-1 -mr-1"></div>
      </div>
    </div>
  );
};