import React, { useState } from 'react';
import { Tag, ChevronDown, ChevronUp, Check, ArrowRight, Info, HelpCircle, Sparkles } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

interface SmartPricingSimulatorProps {
  costPrice?: number | '';
  onApplySellingPrice: (price: number) => void;
}

interface PricingTier {
  id: string;
  nameKey: 'tierCompetitive' | 'tierStandard' | 'tierHealthy' | 'tierHigh' | 'tierPremium' | 'tierLuxury';
  markupPercent: number;
  badgeColor: string;
}

export const SmartPricingSimulator: React.FC<SmartPricingSimulatorProps> = ({
  costPrice,
  onApplySellingPrice,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [appliedTierId, setAppliedTierId] = useState<string | null>(null);

  const baseCost = typeof costPrice === 'number' && costPrice > 0 ? costPrice : 10;

  const tiers: PricingTier[] = [
    { id: 't1', nameKey: 'tierCompetitive', markupPercent: 20, badgeColor: 'bg-slate-100 text-slate-700 border-slate-200' },
    { id: 't2', nameKey: 'tierStandard', markupPercent: 50, badgeColor: 'bg-blue-50 text-blue-800 border-blue-200' },
    { id: 't3', nameKey: 'tierHealthy', markupPercent: 75, badgeColor: 'bg-teal-50 text-teal-800 border-teal-200' },
    { id: 't4', nameKey: 'tierHigh', markupPercent: 100, badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { id: 't5', nameKey: 'tierPremium', markupPercent: 150, badgeColor: 'bg-purple-50 text-purple-800 border-purple-200' },
    { id: 't6', nameKey: 'tierLuxury', markupPercent: 200, badgeColor: 'bg-amber-50 text-amber-900 border-amber-200' },
  ];

  const handleApply = (tierId: string, price: number) => {
    onApplySellingPrice(price);
    setAppliedTierId(tierId);
    setTimeout(() => setAppliedTierId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      {/* Header / Accordion Toggle */}
      <button
        type="button"
        id="btn-toggle-smart-pricing"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {t.smartPricingTitle}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200/60">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-blue-600" />
                {t.pricingBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
              {t.smartPricingSubtitle}
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
                {t.smartPricingSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-blue-700 shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Simple Explanation banner */}
          <div className="flex items-start gap-2 p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-950 font-medium">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              {t.pricingDisclaimer} (<span className="font-bold">{t.costPriceLabel} {formatINR(baseCost)}</span>)
            </span>
          </div>

          {/* Tiers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {tiers.map((tier) => {
              const sellPrice = Number((baseCost * (1 + tier.markupPercent / 100)).toFixed(2));
              const profitPerUnit = Number((sellPrice - baseCost).toFixed(2));
              const isApplied = appliedTierId === tier.id;

              return (
                <div
                  key={tier.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-blue-300 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {t[tier.nameKey]}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${tier.badgeColor}`}>
                        +{tier.markupPercent}%
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="text-lg sm:text-xl font-black text-slate-900 block">
                        {formatINR(sellPrice)}
                      </span>
                      <div className="text-xs font-bold text-teal-700 pt-0.5">
                        +{formatINR(profitPerUnit)} {t.profitPerPieceText}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      id={`btn-apply-tier-${tier.id}`}
                      onClick={() => handleApply(tier.id, sellPrice)}
                      className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 min-h-[36px] ${
                        isApplied
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 border border-slate-200/70'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          {t.appliedToast}
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" />
                          {t.useThisPrice}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
