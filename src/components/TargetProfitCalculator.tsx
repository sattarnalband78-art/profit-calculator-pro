import React, { useState, useEffect } from 'react';
import { Target, ChevronDown, ChevronUp, Check, ArrowRight, IndianRupee, AlertCircle, HelpCircle, Sparkles } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

interface TargetProfitCalculatorProps {
  currentCostPrice?: number | '';
  currentSellingPrice?: number | '';
  onApplyQuantity: (quantity: number) => void;
}

export const TargetProfitCalculator: React.FC<TargetProfitCalculatorProps> = ({
  currentCostPrice,
  currentSellingPrice,
  onApplyQuantity,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [costPrice, setCostPrice] = useState<number | ''>(() => {
    return typeof currentCostPrice === 'number' && currentCostPrice >= 0 ? currentCostPrice : 10;
  });
  const [sellingPrice, setSellingPrice] = useState<number | ''>(() => {
    return typeof currentSellingPrice === 'number' && currentSellingPrice >= 0 ? currentSellingPrice : 20;
  });
  const [targetProfit, setTargetProfit] = useState<number>(5000);
  const [justApplied, setJustApplied] = useState(false);

  // Sync if parent values change
  useEffect(() => {
    if (typeof currentCostPrice === 'number' && currentCostPrice >= 0) {
      setCostPrice(currentCostPrice);
    }
  }, [currentCostPrice]);

  useEffect(() => {
    if (typeof currentSellingPrice === 'number' && currentSellingPrice >= 0) {
      setSellingPrice(currentSellingPrice);
    }
  }, [currentSellingPrice]);

  const costNum = typeof costPrice === 'number' ? costPrice : 0;
  const sellNum = typeof sellingPrice === 'number' ? sellingPrice : 0;
  const profitPerPiece = sellNum - costNum;
  const isInvalidProfit = profitPerPiece <= 0;

  const requiredQuantity = !isInvalidProfit && targetProfit > 0 ? Math.ceil(targetProfit / profitPerPiece) : 0;
  const projectedRevenue = requiredQuantity * sellNum;
  const projectedCost = requiredQuantity * costNum;

  const presets = [1000, 5000, 10000, 25000, 50000, 100000];

  const handleApply = () => {
    if (requiredQuantity > 0) {
      onApplyQuantity(requiredQuantity);
      setJustApplied(true);
      setTimeout(() => setJustApplied(false), 2000);
    }
  };

  const simpleExplanation = t.targetProfitSimpleExplain
    .replace('{profit}', targetProfit.toLocaleString('en-IN'))
    .replace('{qty}', requiredQuantity.toLocaleString('en-IN'));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      {/* Header / Accordion Toggle */}
      <button
        type="button"
        id="btn-toggle-target-profit"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {t.targetProfitTitle}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200/60">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-teal-600" />
                {t.assistantBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
              {t.targetProfitSubtitle}
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
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.howItWorksBtn}</span>
              {showHowItWorks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showHowItWorks && (
              <div className="mt-2 p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-xs text-teal-950 space-y-1 font-medium">
                {t.targetProfitSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-teal-700 shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Input 1: Cost Price */}
            <div>
              <label htmlFor="target-profit-cost" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.costPriceLabel}
              </label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <input
                  id="target-profit-cost"
                  type="number"
                  min="0"
                  step="any"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Input 2: Selling Price */}
            <div>
              <label htmlFor="target-profit-sell" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.sellingPriceLabel}
              </label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <input
                  id="target-profit-sell"
                  type="number"
                  min="0"
                  step="any"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Input 3: Target Profit (₹) */}
            <div>
              <label htmlFor="target-profit-amount" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.desiredProfitLabel}
              </label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <input
                  id="target-profit-amount"
                  type="number"
                  min="1"
                  step="any"
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(parseFloat(e.target.value) || 0)}
                  placeholder="5000"
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              {t.quickProfitPresets}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTargetProfit(amt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    targetProfit === amt
                      ? 'bg-teal-700 text-white shadow-2xs font-black'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  ₹{amt >= 100000 ? `${amt / 100000} Lakh` : `${amt / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Output Card / Error Warning */}
          {isInvalidProfit ? (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{t.cannotReachProfitWarning}</span>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t.requiredQuantity}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {requiredQuantity.toLocaleString('en-IN')} {t.pcsLabel}
                    </span>
                    <span className="text-xs font-bold text-teal-700">
                      (@ +{formatINR(profitPerPiece)} /{t.perUnit})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium flex gap-3">
                    <span>{t.projectedRevenue}: {formatINR(projectedRevenue)}</span>
                    <span>•</span>
                    <span>{t.projectedCost}: {formatINR(projectedCost)}</span>
                  </div>
                </div>

                {/* 1-Click Apply to Form Button */}
                <button
                  type="button"
                  id="btn-apply-required-qty"
                  onClick={handleApply}
                  disabled={requiredQuantity <= 0}
                  className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 min-h-[40px] ${
                    justApplied
                      ? 'bg-teal-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {justApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      {t.qtyAppliedToast}
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
                      {t.applyQtyBtn}
                    </>
                  )}
                </button>
              </div>

              {/* Simple One-line Business Explanation */}
              {requiredQuantity > 0 && (
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-700">
                  🎯 <span className="font-semibold text-slate-900">{simpleExplanation}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
