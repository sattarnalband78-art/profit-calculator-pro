import React, { useState } from 'react';
import { Target, IndianRupee, Percent, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface TargetPriceCalculatorProps {
  onApplySellingPrice: (suggestedSellingPrice: number) => void;
}

export const TargetPriceCalculator: React.FC<TargetPriceCalculatorProps> = ({
  onApplySellingPrice,
}) => {
  const [cost, setCost] = useState<number | ''>(250);
  const [desiredMargin, setDesiredMargin] = useState<number | ''>(30); // 30% margin target

  const costNum = typeof cost === 'number' && cost > 0 ? cost : 0;
  const marginNum = typeof desiredMargin === 'number' && desiredMargin >= 0 ? desiredMargin : 0;

  // Formula:
  // Markup method: Selling Price = Cost * (1 + Margin% / 100)
  const suggestedPrice = costNum * (1 + marginNum / 100);
  const profitPerUnit = suggestedPrice - costNum;

  return (
    <div className="bg-emerald-900 text-emerald-50 p-6 rounded-2xl shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="p-2 rounded-lg bg-emerald-800 text-emerald-300 border border-emerald-700/50">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-100">
              Target Price & Margin Finder
            </h3>
            <p className="text-xs text-emerald-200/80">
              Find the selling price needed for your target profit return %
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
          {/* Cost Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1">
              Cost Price (₹)
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full pl-9 pr-3 py-2 text-sm bg-emerald-950/60 border border-emerald-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                placeholder="e.g. 250"
              />
            </div>
          </div>

          {/* Desired Profit Margin % */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1">
              Target Return (%)
            </label>
            <div className="relative">
              <Percent className="w-4 h-4 text-emerald-300 absolute left-3 top-2.5" />
              <input
                type="number"
                min="0"
                value={desiredMargin}
                onChange={(e) => setDesiredMargin(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full pl-9 pr-3 py-2 text-sm bg-emerald-950/60 border border-emerald-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-400 font-semibold"
                placeholder="e.g. 30"
              />
            </div>
          </div>
        </div>

        {/* Suggested Price Result */}
        <div className="bg-emerald-950/80 p-3.5 rounded-xl border border-emerald-800/80 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-emerald-300">Suggested Selling Price:</div>
            <div className="text-xl font-black text-emerald-300">
              {costNum > 0 ? formatINR(suggestedPrice) : '₹0.00'}
              <span className="text-xs font-normal text-emerald-200/70 ml-2">
                (Profit: +{formatINR(profitPerUnit)} / unit)
              </span>
            </div>
          </div>

          {costNum > 0 && suggestedPrice > 0 && (
            <button
              type="button"
              onClick={() => onApplySellingPrice(parseFloat(suggestedPrice.toFixed(2)))}
              className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer active:scale-95 shrink-0"
            >
              Use Price <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Decorative background SVG shape */}
      <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <svg className="w-36 h-36" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
        </svg>
      </div>
    </div>
  );
};
