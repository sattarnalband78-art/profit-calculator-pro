import React, { useState, useEffect } from 'react';
import { Target, ChevronDown, ChevronUp, Check, ArrowRight, IndianRupee, Percent, HelpCircle, Sparkles } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

interface TargetPriceCalculatorProps {
  currentCostPrice?: number | '';
  onApplySellingPrice: (suggestedPrice: number) => void;
}

export const TargetPriceCalculator: React.FC<TargetPriceCalculatorProps> = ({
  currentCostPrice,
  onApplySellingPrice,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [targetCost, setTargetCost] = useState<number | ''>(() => {
    return typeof currentCostPrice === 'number' && currentCostPrice > 0 ? currentCostPrice : 10;
  });
  const [targetRoi, setTargetRoi] = useState<number>(50);
  const [justApplied, setJustApplied] = useState(false);

  // Sync if parent cost price changes and tool is open
  useEffect(() => {
    if (typeof currentCostPrice === 'number' && currentCostPrice > 0) {
      setTargetCost(currentCostPrice);
    }
  }, [currentCostPrice]);

  const costNum = typeof targetCost === 'number' ? targetCost : 0;
  const suggestedSellingPrice = costNum > 0 ? costNum * (1 + targetRoi / 100) : 0;
  const projectedProfitPerUnit = suggestedSellingPrice - costNum;

  const presets = [15, 25, 35, 50, 100];

  const handleApply = () => {
    if (suggestedSellingPrice > 0) {
      const cleanPrice = Number(suggestedSellingPrice.toFixed(2));
      onApplySellingPrice(cleanPrice);
      setJustApplied(true);
      setTimeout(() => setJustApplied(false), 2000);
    }
  };

  const simpleExplanation = t.targetPriceSimpleExplain
    .replace('{cost}', costNum > 0 ? formatINR(costNum) : '₹0')
    .replace('{return}', targetRoi.toString())
    .replace('{price}', suggestedSellingPrice > 0 ? formatINR(suggestedSellingPrice) : '₹0');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      {/* Header / Accordion Toggle */}
      <button
        type="button"
        id="btn-toggle-pricing-assistant"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {t.targetFinderTitle}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200/60">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-blue-600" />
                {t.assistantBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
              {t.targetFinderSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-slate-400 pl-2">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 bg-slate-50/40 space-y-3.5">
          {/* How It Works Collapsible Helper */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.howItWorksBtn}</span>
              {showHowItWorks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showHowItWorks && (
              <div className="mt-2 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-950 space-y-1 font-medium">
                {t.targetReturnSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-blue-700 shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Input 1: Cost Price */}
            <div>
              <label htmlFor="target-calc-cost" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.costLabel}
              </label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <input
                  id="target-calc-cost"
                  type="number"
                  min="0"
                  step="any"
                  value={targetCost}
                  onChange={(e) => setTargetCost(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g. 10"
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Input 2: Desired Profit / Return % */}
            <div>
              <label htmlFor="target-calc-roi" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.targetReturnLabel}
              </label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Percent className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <input
                  id="target-calc-roi"
                  type="number"
                  min="1"
                  max="1000"
                  step="1"
                  value={targetRoi}
                  onChange={(e) => setTargetRoi(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 50"
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              {t.quickMarginsLabel}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTargetRoi(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    targetRoi === p
                      ? 'bg-blue-600 text-white shadow-2xs font-black'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  +{p}%
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Output Card with clear 1-line shopkeeper explanation */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-baseline justify-between sm:justify-start gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t.suggestedSellingPrice}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {formatINR(suggestedSellingPrice)}
                  </span>
                </div>
                <div className="h-7 w-px bg-slate-100 hidden sm:block"></div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t.projectedProfitPerUnit}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-teal-700">
                    +{formatINR(projectedProfitPerUnit)}
                  </span>
                </div>
              </div>

              {/* 1-Click Apply to Main Form Button */}
              <button
                type="button"
                id="btn-apply-suggested-price"
                onClick={handleApply}
                disabled={suggestedSellingPrice <= 0}
                className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 min-h-[40px] ${
                  justApplied
                    ? 'bg-teal-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                {justApplied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    {t.appliedToast}
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
                    {t.applyPriceBtn}
                  </>
                )}
              </button>
            </div>

            {/* Simple One-line Business Explanation */}
            {suggestedSellingPrice > 0 && (
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-700">
                💡 <span className="font-semibold text-slate-900">{simpleExplanation}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
