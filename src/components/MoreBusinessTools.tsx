import React, { useState } from 'react';
import { CalculationInput } from '../types';
import { TargetPriceCalculator } from './TargetPriceCalculator';
import { TargetProfitCalculator } from './TargetProfitCalculator';
import { WhatIfSimulator } from './WhatIfSimulator';
import { SmartPricingSimulator } from './SmartPricingSimulator';
import { useLanguage } from '../context/LanguageContext';
import {
  Wrench,
  ChevronDown,
  ChevronUp,
  Target,
  Percent,
  SlidersHorizontal,
  Tag,
} from 'lucide-react';

interface MoreBusinessToolsProps {
  input: CalculationInput;
  onApplySellingPrice: (price: number) => void;
  onApplyQuantity: (quantity: number) => void;
  onApplyScenario: (cost: number, sell: number, qty: number) => void;
}

export const MoreBusinessTools: React.FC<MoreBusinessToolsProps> = ({
  input,
  onApplySellingPrice,
  onApplyQuantity,
  onApplyScenario,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'targetPrice' | 'targetProfit' | 'whatIf' | 'compare'>(
    'targetPrice'
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all no-print">
      {/* Accordion / Collapsible Header */}
      <button
        type="button"
        id="btn-toggle-more-tools"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-900 text-white shadow-2xs shrink-0">
            <Wrench className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {t.moreToolsTitle}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                4 Tools
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
              {t.moreToolsSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-slate-400 pl-2">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Tools Container with Clean Sub-tabs */}
      {isOpen && (
        <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 bg-slate-50/40 space-y-4">
          {/* Tool Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-3 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('targetPrice')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 ${
                activeTab === 'targetPrice'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{t.findBestPriceTitle}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('targetProfit')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 ${
                activeTab === 'targetProfit'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{t.targetProfitTitle}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('whatIf')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 ${
                activeTab === 'whatIf'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t.whatIfSimpleTitle}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 ${
                activeTab === 'compare'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>{t.comparePricesSimpleTitle}</span>
            </button>
          </div>

          {/* Active Tool Render */}
          <div className="pt-1">
            {activeTab === 'targetPrice' && (
              <TargetPriceCalculator
                currentCostPrice={input.costPrice}
                onApplySellingPrice={onApplySellingPrice}
              />
            )}

            {activeTab === 'targetProfit' && (
              <TargetProfitCalculator
                currentCostPrice={input.costPrice}
                currentSellingPrice={input.sellingPrice}
                onApplyQuantity={onApplyQuantity}
              />
            )}

            {activeTab === 'whatIf' && (
              <WhatIfSimulator
                currentInput={input}
                onApplyScenario={onApplyScenario}
              />
            )}

            {activeTab === 'compare' && (
              <SmartPricingSimulator
                costPrice={input.costPrice}
                onApplySellingPrice={onApplySellingPrice}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
