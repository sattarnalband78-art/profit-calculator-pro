import React, { useState } from 'react';
import { CalculationInput, CalculationResult } from '../types';
import { calculateProfitMetrics, formatINR, formatPercent } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  TrendingUp,
  Target,
  Tag,
  SlidersHorizontal,
  ArrowRight,
  Check,
  Zap,
} from 'lucide-react';

interface SmartBusinessInsightsProps {
  result: CalculationResult | null;
  input: CalculationInput;
  onApplySellingPrice: (price: number) => void;
  onApplyQuantity: (qty: number) => void;
  onApplyScenario: (cost: number, sell: number, qty: number) => void;
}

export const SmartBusinessInsights: React.FC<SmartBusinessInsightsProps> = ({
  result,
  input,
  onApplySellingPrice,
  onApplyQuantity,
  onApplyScenario,
}) => {
  const { t } = useLanguage();

  const [appliedTargetQty, setAppliedTargetQty] = useState(false);
  const [appliedBestPrice, setAppliedBestPrice] = useState(false);
  const [appliedWhatIf, setAppliedWhatIf] = useState(false);

  // Target Profit State
  const [desiredProfit, setDesiredProfit] = useState<number>(5000);

  // Best Price State
  const [targetRoi, setTargetRoi] = useState<number>(50);

  // What-If Quick State
  const [simPriceDelta, setSimPriceDelta] = useState<number>(2); // +₹2 by default

  if (!result) return null;

  const { costPrice, sellingPrice, quantity, totalProfit, profitPerPiece } = result;

  // 1. Target Profit Calculation
  const isPositiveProfitPerUnit = profitPerPiece > 0;
  const targetRequiredQty = isPositiveProfitPerUnit && desiredProfit > 0
    ? Math.ceil(desiredProfit / profitPerPiece)
    : 0;

  const handleApplyTargetQty = () => {
    if (targetRequiredQty > 0) {
      onApplyQuantity(targetRequiredQty);
      setAppliedTargetQty(true);
      setTimeout(() => setAppliedTargetQty(false), 2000);
    }
  };

  // 2. Best Selling Price Calculation
  const suggestedBestPrice = Number((costPrice * (1 + targetRoi / 100)).toFixed(2));
  const suggestedProfitPerUnit = Number((suggestedBestPrice - costPrice).toFixed(2));

  const handleApplyBestPrice = () => {
    if (suggestedBestPrice > 0) {
      onApplySellingPrice(suggestedBestPrice);
      setAppliedBestPrice(true);
      setTimeout(() => setAppliedBestPrice(false), 2000);
    }
  };

  // 3. What-If Quick Simulator Calculation
  const simSellPrice = Math.max(0.1, Number((sellingPrice + simPriceDelta).toFixed(2)));
  const simMetrics = calculateProfitMetrics(costPrice, simSellPrice, quantity);
  const simProfitDiff = simMetrics.totalProfit - totalProfit;

  const handleApplyWhatIf = () => {
    onApplyScenario(costPrice, simSellPrice, quantity);
    setAppliedWhatIf(true);
    setTimeout(() => setAppliedWhatIf(false), 2000);
  };

  // 4. Profit Boosters Calculation
  const priceUp1Extra = quantity * 1;
  const costDown1Extra = quantity * 1;
  const qtyStep = Math.max(1, Math.round(quantity * 0.1)); // 10% more units
  const qtyUpExtra = profitPerPiece > 0 ? qtyStep * profitPerPiece : 0;

  return (
    <div className="space-y-4 no-print">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {t.smartInsightsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.smartInsightsSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Smart Business Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Target Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-teal-600 shrink-0" />
                {t.targetProfitTitle}
              </span>
              <span className="text-xs font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md uppercase">
                {t.goalBadge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.targetProfitSubtitle}
            </p>

            {/* Target Input & Presets */}
            <div className="mt-3 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-700 shrink-0">
                  {t.iWantToEarnLabel}:
                </span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="100"
                    step="500"
                    value={desiredProfit}
                    onChange={(e) => setDesiredProfit(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-7 pr-3 py-2 text-sm sm:text-base font-black bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1000, 5000, 10000, 25000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDesiredProfit(preset)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      desiredProfit === preset
                        ? 'bg-slate-900 text-white font-black'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ₹{preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Outcome Box */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {isPositiveProfitPerUnit && targetRequiredQty > 0 ? (
              <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-teal-800 font-bold block">
                    {t.requiredQuantity}:
                  </span>
                  <span className="text-base sm:text-lg font-black text-teal-950">
                    {targetRequiredQty.toLocaleString('en-IN')} {t.pcsLabel}
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-apply-smart-qty"
                  onClick={handleApplyTargetQty}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 min-h-[38px]"
                >
                  {appliedTargetQty ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>{t.qtyAppliedToast}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.applyQtyBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl">
                {t.cannotReachProfitWarning}
              </p>
            )}
          </div>
        </div>

        {/* Card 2: Best Selling Price */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600 shrink-0" />
                {t.findBestPriceTitle}
              </span>
              <span className="text-xs font-extrabold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md uppercase">
                {t.pricingBadge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.targetFinderSubtitle}
            </p>

            {/* Target ROI Presets */}
            <div className="mt-3 space-y-2">
              <span className="text-xs sm:text-sm font-bold text-slate-700 block">
                {t.targetReturnLabel}: <strong className="text-slate-950 font-black">{targetRoi}%</strong>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[20, 35, 50, 75, 100].map((roi) => (
                  <button
                    key={roi}
                    type="button"
                    onClick={() => setTargetRoi(roi)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      targetRoi === roi
                        ? 'bg-slate-900 text-white font-black'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {roi}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Outcome Box */}
          <div className="pt-2 border-t border-slate-100">
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-blue-800 font-bold block">
                  {t.suggestedSellingPrice}:
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-black text-blue-950">
                    {formatINR(suggestedBestPrice)}
                  </span>
                  <span className="text-xs text-blue-700 font-bold">
                    (+{formatINR(suggestedProfitPerUnit)} / {t.perUnit})
                  </span>
                </div>
              </div>
              <button
                type="button"
                id="btn-apply-smart-price"
                onClick={handleApplyBestPrice}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 min-h-[38px]"
              >
                {appliedBestPrice ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>{t.appliedToast}</span>
                  </>
                ) : (
                  <>
                    <span>{t.applyPriceBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: What-If Quick Simulator */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-purple-600 shrink-0" />
                {t.whatIfSimpleTitle}
              </span>
              <span className="text-xs font-extrabold text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md uppercase">
                {t.simulatorBadge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.whatIfSubtitle}
            </p>

            {/* Quick Price Delta Buttons */}
            <div className="mt-3 space-y-2">
              <span className="text-xs sm:text-sm font-bold text-slate-700 block">
                {t.adjustSelling}: <strong className="text-slate-950 font-black">{formatINR(simSellPrice)}</strong>
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {[-2, -1, 1, 2, 5, 10].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => setSimPriceDelta(delta)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      simPriceDelta === delta
                        ? 'bg-slate-900 text-white font-black'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {delta > 0 ? `+₹${delta}` : `-₹${Math.abs(delta)}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Outcome Box */}
          <div className="pt-2 border-t border-slate-100">
            <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-purple-800 font-bold block">
                  {t.differenceDelta}:
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-base sm:text-lg font-black ${simProfitDiff >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
                    {simProfitDiff >= 0 ? `+${formatINR(simProfitDiff)}` : `-${formatINR(Math.abs(simProfitDiff))}`}
                  </span>
                  <span className="text-xs text-slate-600 font-bold">
                    (Total: {formatINR(simMetrics.totalProfit)})
                  </span>
                </div>
              </div>
              <button
                type="button"
                id="btn-apply-smart-whatif"
                onClick={handleApplyWhatIf}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 min-h-[38px]"
              >
                {appliedWhatIf ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>{t.scenarioAppliedToast}</span>
                  </>
                ) : (
                  <>
                    <span>{t.applyScenarioBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: Profit Boosters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                {t.profitBoostersTitle}
              </span>
              <span className="text-xs font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md uppercase">
                {t.quickWinsBadge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.profitBoostersSubtitle}
            </p>

            {/* Quick Win List */}
            <div className="mt-3 space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-800 font-semibold">
                  {t.profitBoosterPriceUp}
                </span>
                <span className="font-black text-teal-700">
                  +{formatINR(priceUp1Extra)} {t.extraProfitText}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-800 font-semibold">
                  {t.profitBoosterCostDown}
                </span>
                <span className="font-black text-blue-700">
                  +{formatINR(costDown1Extra)} {t.extraProfitText}
                </span>
              </div>

              {profitPerPiece > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-800 font-semibold">
                    {t.profitBoosterQtyUp.replace('{qty}', qtyStep.toString())}
                  </span>
                  <span className="font-black text-purple-700">
                    +{formatINR(qtyUpExtra)} {t.extraProfitText}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              {t.smallChangesMultiplyText.replace('{qty}', quantity.toLocaleString('en-IN')).replace('{unit}', t.pcsLabel)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
