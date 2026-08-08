import React from 'react';
import { Calculator, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onLoadSample: () => void;
  onResetAll: () => void;
  hasHistory: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onLoadSample, onResetAll }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-md shadow-emerald-200">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-800">
                Profit Calculator <span className="text-emerald-600">Pro</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <TrendingUp className="w-3 h-3 mr-1" /> ₹ INR
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-medium">
              Calculate your business profit in seconds
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2.5 ml-auto">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer active:scale-95"
            title="Load sample business data"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Sample Data
          </button>

          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer active:scale-95"
            title="Reset inputs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Clear
          </button>
        </div>
      </div>
    </header>
  );
};
