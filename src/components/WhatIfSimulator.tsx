import React, { useState, useEffect } from 'react';
import { CalculationInput } from '../types';
import { calculateProfitMetrics, formatINR, formatPercent } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface WhatIfSimulatorProps {
  currentInput: CalculationInput;
  onApplyScenario: (cost: number, sell: number, qty: number) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  currentInput,
  onApplyScenario,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const baseCost = Number(currentInput.costPrice) || 10;
  const baseSell = Number(currentInput.sellingPrice) || 20;
  const baseQty = Number(currentInput.quantity) || 100;

  const [simCost, setSimCost] = useState<number>(baseCost);
  const [simSell, setSimSell] = useState<number>(baseSell);
  const [simQty, setSimQty] = useState<number>(baseQty);
  const [justApplied, setJustApplied] = useState(false);

  // Sync with current input whenever it changes
  useEffect(() => {
    if (Number(currentInput.costPrice) > 0) setSimCost(Number(currentInput.costPrice));
    if (Number(currentInput.sellingPrice) > 0) setSimSell(Number(currentInput.sellingPrice));
    if (Number(currentInput.quantity) > 0) setSimQty(Number(currentInput.quantity));
  }, [currentInput.costPrice, currentInput.sellingPrice, currentInput.quantity]);

  // Current metrics
  const currentMetrics = calculateProfitMetrics(baseCost, baseSell, baseQty);
  // Simulated metrics
  const simMetrics = calculateProfitMetrics(simCost, simSell, simQty);

  // Deltas
  const deltaProfit = simMetrics.totalProfit - currentMetrics.totalProfit;
  const deltaRoi = simMetrics.profitPercentage - currentMetrics.profitPercentage;
  const deltaSales = simMetrics.totalSales - currentMetrics.totalSales;
  const deltaCost = simMetrics.totalCost - currentMetrics.totalCost;
  const deltaProfitPerPiece = simMetrics.profitPerPiece - currentMetrics.profitPerPiece;

  const handleReset = () => {
    setSimCost(baseCost);
    setSimSell(baseSell);
    setSimQty(baseQty);
  };

  const handleApply = () => {
    onApplyScenario(simCost, simSell, simQty);
    setJustApplied(true);
    setTimeout(() => setJustApplied(false), 2000);
  };

  const adjustPercent = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    val: number,
    percent: number
  ) => {
    const newVal = Math.max(0.1, Number((val * (1 + percent / 100)).toFixed(2)));
    setter(newVal);
  };

  const adjustQuantityPercent = (percent: number) => {
    const newQty = Math.max(1, Math.round(simQty * (1 + percent / 100)));
    setSimQty(newQty);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      {/* Header / Accordion Toggle */}
      <button
        type="button"
        id="btn-toggle-what-if-simulator"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {t.whatIfTitle}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200/60">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-purple-600" />
                {t.simulatorBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
              {t.whatIfSubtitle}
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
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.howItWorksBtn}</span>
              {showHowItWorks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showHowItWorks && (
              <div className="mt-2 p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-950 space-y-1 font-medium">
                {t.whatIfSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-purple-700 shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls: Cost, Selling Price, Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Cost Control */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {t.adjustCost}
                </span>
                <span className="text-xs font-black text-slate-900">
                  {formatINR(simCost)}
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={simCost}
                onChange={(e) => setSimCost(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <div className="flex gap-1">
                {[-10, -5, 5, 10].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => adjustPercent(setSimCost, simCost, pct)}
                    className="flex-1 py-1.5 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 cursor-pointer min-h-[32px]"
                  >
                    {pct > 0 ? `+${pct}%` : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Selling Price Control */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {t.adjustSelling}
                </span>
                <span className="text-xs font-black text-slate-900">
                  {formatINR(simSell)}
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={simSell}
                onChange={(e) => setSimSell(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <div className="flex gap-1">
                {[-10, -5, 5, 10].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => adjustPercent(setSimSell, simSell, pct)}
                    className="flex-1 py-1.5 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 cursor-pointer min-h-[32px]"
                  >
                    {pct > 0 ? `+${pct}%` : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Control */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {t.adjustQuantity}
                </span>
                <span className="text-xs font-black text-slate-900">
                  {simQty} {t.pcsLabel}
                </span>
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={simQty}
                onChange={(e) => setSimQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <div className="flex gap-1">
                {[-20, -10, 10, 25].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => adjustQuantityPercent(pct)}
                    className="flex-1 py-1.5 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 cursor-pointer min-h-[32px]"
                  >
                    {pct > 0 ? `+${pct}%` : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Simple Visual Callout Card for Shopkeeper */}
          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs font-semibold text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              💵 {t.profitPerPieceLabel}: <strong className="text-slate-900">{formatINR(simMetrics.profitPerPiece, true)}</strong> (
              {deltaProfitPerPiece > 0 ? `+${formatINR(deltaProfitPerPiece)}` : deltaProfitPerPiece < 0 ? formatINR(deltaProfitPerPiece) : '0'})
            </span>
            <span className="font-bold text-slate-900">
              📊 {t.netProfitLabel}: {formatINR(simMetrics.totalProfit, true)} (
              {deltaProfit > 0 ? `+${formatINR(deltaProfit)}` : deltaProfit < 0 ? formatINR(deltaProfit) : '0'})
            </span>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="grid grid-cols-4 p-2.5 bg-slate-100/70 border-b border-slate-200 text-[10px] font-extrabold text-slate-600 uppercase">
              <div>Metric</div>
              <div className="text-right">{t.currentScenario}</div>
              <div className="text-right text-purple-900">{t.simulatedScenario}</div>
              <div className="text-right">{t.differenceDelta}</div>
            </div>

            {/* Row 1: Total Profit */}
            <div className="grid grid-cols-4 p-2.5 border-b border-slate-100 items-center text-xs">
              <div className="font-bold text-slate-800">{t.netProfitLabel}</div>
              <div className="text-right font-medium text-slate-600">{formatINR(currentMetrics.totalProfit, true)}</div>
              <div className="text-right font-black text-slate-900">{formatINR(simMetrics.totalProfit, true)}</div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    deltaProfit > 0
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : deltaProfit < 0
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'text-slate-500'
                  }`}
                >
                  {deltaProfit > 0 ? `+${formatINR(deltaProfit)}` : deltaProfit < 0 ? formatINR(deltaProfit) : '0'}
                </span>
              </div>
            </div>

            {/* Row 2: Profit per piece */}
            <div className="grid grid-cols-4 p-2.5 border-b border-slate-100 items-center text-xs">
              <div className="font-bold text-slate-800">{t.profitPerPieceLabel}</div>
              <div className="text-right font-medium text-slate-600">{formatINR(currentMetrics.profitPerPiece, true)}</div>
              <div className="text-right font-black text-slate-900">{formatINR(simMetrics.profitPerPiece, true)}</div>
              <div className="text-right text-[11px] font-semibold text-slate-600">
                {deltaProfitPerPiece > 0 ? `+${formatINR(deltaProfitPerPiece)}` : deltaProfitPerPiece < 0 ? formatINR(deltaProfitPerPiece) : '—'}
              </div>
            </div>

            {/* Row 3: Total Sales */}
            <div className="grid grid-cols-4 p-2.5 border-b border-slate-100 items-center text-xs">
              <div className="font-bold text-slate-800">{t.totalSalesLabel}</div>
              <div className="text-right font-medium text-slate-600">{formatINR(currentMetrics.totalSales)}</div>
              <div className="text-right font-black text-slate-900">{formatINR(simMetrics.totalSales)}</div>
              <div className="text-right text-[11px] font-semibold text-slate-600">
                {deltaSales > 0 ? `+${formatINR(deltaSales)}` : deltaSales < 0 ? formatINR(deltaSales) : '—'}
              </div>
            </div>

            {/* Row 4: Total Cost */}
            <div className="grid grid-cols-4 p-2.5 border-b border-slate-100 items-center text-xs">
              <div className="font-bold text-slate-800">{t.totalCostLabel}</div>
              <div className="text-right font-medium text-slate-600">{formatINR(currentMetrics.totalCost)}</div>
              <div className="text-right font-black text-slate-900">{formatINR(simMetrics.totalCost)}</div>
              <div className="text-right text-[11px] font-semibold text-slate-600">
                {deltaCost > 0 ? `+${formatINR(deltaCost)}` : deltaCost < 0 ? formatINR(deltaCost) : '—'}
              </div>
            </div>

            {/* Row 5: ROI % */}
            <div className="grid grid-cols-4 p-2.5 items-center text-xs">
              <div className="font-bold text-slate-800">{t.roiShort} %</div>
              <div className="text-right font-medium text-slate-600">{formatPercent(currentMetrics.profitPercentage, true)}</div>
              <div className="text-right font-black text-slate-900">{formatPercent(simMetrics.profitPercentage, true)}</div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    deltaRoi > 0
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : deltaRoi < 0
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'text-slate-500'
                  }`}
                >
                  {deltaRoi > 0 ? `+${deltaRoi.toFixed(1)}%` : deltaRoi < 0 ? `${deltaRoi.toFixed(1)}%` : '0%'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar (Reset & Apply) */}
          <div className="flex items-center justify-between gap-2.5 pt-1">
            <button
              type="button"
              id="btn-reset-what-if"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer min-h-[40px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetScenarioBtn}</span>
            </button>

            <button
              type="button"
              id="btn-apply-what-if"
              onClick={handleApply}
              className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 min-h-[40px] ${
                justApplied
                  ? 'bg-teal-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              {justApplied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  {t.scenarioAppliedToast}
                </>
              ) : (
                <>
                  <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
                  {t.applyScenarioBtn}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
