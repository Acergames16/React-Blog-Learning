import React from 'react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Editorial Header */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.6em] text-gray-300 block">
            System / Configuration
          </span>
          <h1 className="text-4xl font-light tracking-tighter text-black">
            Settings
          </h1>
        </div>

        {/* The "Coming Soon" Divider */}
        <div className="flex items-center justify-center gap-6 py-4">
          <div className="h-[1px] w-12 bg-gray-100"></div>
          <span className="text-[9px] uppercase tracking-[0.4em] text-gray-400 italic">
            Coming Soon
          </span>
          <div className="h-[1px] w-12 bg-gray-100"></div>
        </div>

        {/* Minimalist Message */}
        <p className="text-sm text-gray-400 font-light leading-relaxed max-w-xs mx-auto">
          We are currently refining the personal archive controls and aesthetic preferences. 
          Check back in the next version.
        </p>

        {/* Back Link */}
        <div className="pt-8">
          <button 
            onClick={() => window.history.back()}
            className="text-[10px] uppercase tracking-[0.2em] text-black border-b border-black pb-1 hover:text-gray-400 hover:border-gray-400 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;