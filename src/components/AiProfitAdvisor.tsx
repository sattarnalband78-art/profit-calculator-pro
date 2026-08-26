import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { formatINR, formatPercent } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Info,
  Loader2,
  RefreshCw,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  BarChart3,
} from 'lucide-react';

interface AiProfitAdvisorProps {
  result: CalculationResult | null;
}

export const AiProfitAdvisor: React.FC<AiProfitAdvisorProps> = ({ result }) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isAiUnavailable, setIsAiUnavailable] = useState(false);

  // Clear previous AI response if language changes so stale language response is not shown
  React.useEffect(() => {
    setAiResponse(null);
    setIsAiUnavailable(false);
  }, [language, result?.productName, result?.costPrice, result?.sellingPrice, result?.quantity]);

  if (!result) return null;

  const {
    productName,
    costPrice,
    sellingPrice,
    quantity,
    totalSales,
    totalCost,
    totalProfit,
    profitPerPiece,
    profitPercentage,
    profitMarginOnSales,
    isProfit,
    isLoss,
  } = result;

  const safeProductName = productName || t.unnamedProduct;

  // Local Financial Heuristics for Business Analysis
  let healthVerdict = t.healthModerate;
  let verdictColor = 'text-blue-900 bg-blue-50/80 border-blue-200';
  let verdictIcon = <TrendingUp className="w-5 h-5 text-blue-600" />;

  if (isLoss) {
    healthVerdict = t.healthLoss;
    verdictColor = 'text-rose-900 bg-rose-50/80 border-rose-200';
    verdictIcon = <TrendingDown className="w-5 h-5 text-rose-600" />;
  } else if (!isProfit && !isLoss) {
    healthVerdict = t.healthBreakEven;
    verdictColor = 'text-slate-900 bg-slate-100 border-slate-200';
    verdictIcon = <Minus className="w-5 h-5 text-slate-500" />;
  } else if (profitPercentage >= 40) {
    healthVerdict = t.healthStrong;
    verdictColor = 'text-teal-900 bg-teal-50/80 border-teal-200';
    verdictIcon = <TrendingUp className="w-5 h-5 text-teal-600" />;
  } else if (profitPercentage < 15) {
    healthVerdict = t.healthThin;
    verdictColor = 'text-amber-900 bg-amber-50/80 border-amber-200';
    verdictIcon = <Info className="w-5 h-5 text-amber-600" />;
  }

  // Milestones: ₹5,000, ₹10,000, ₹25,000, ₹50,000
  const milestones = [5000, 10000, 25000, 50000];

  // Levers calculation
  const priceBump5PctExtraProfit = Math.round(sellingPrice * 0.05 * quantity);
  const costReduction5PctExtraProfit = Math.round(costPrice * 0.05 * quantity);

  // Local summary text (without duplicate currency symbol)
  const localSummary = isProfit
    ? t.localSummaryProfit.replace('{profitPerPiece}', formatINR(profitPerPiece)).replace('{product}', safeProductName)
    : isLoss
    ? t.localSummaryLoss.replace('{lossPerPiece}', formatINR(Math.abs(profitPerPiece))).replace('{product}', safeProductName)
    : t.localSummaryBreakEven.replace('{product}', safeProductName);

  // Ask Gemini AI
  const handleAskGemini = async () => {
    setIsLoadingAi(true);
    setIsAiUnavailable(false);
    const endpoint = '/api/gemini/advisor';
    try {
      const payload = {
        productName: safeProductName,
        costPrice,
        sellingPrice,
        quantity,
        totalSales,
        totalCost,
        totalProfit,
        profitPercentage: profitPercentage.toFixed(2),
        profitMarginOnSales: profitMarginOnSales.toFixed(2),
        language,
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log(`AI Advisor Debug\nHTTP Status: ${res.status}\nEndpoint: ${endpoint}`);

      if (!res.ok) {
        let errData: any = null;
        try {
          errData = await res.json();
        } catch {
          // ignore non-json response
        }
        console.warn(`AI Advisor Debug\nServer Response: ${JSON.stringify(errData || res.statusText)}`);
        setIsAiUnavailable(true);
        return;
      }

      const data = await res.json();
      console.log(`AI Advisor Debug\nServer Response: ${data.success ? `Success (model: ${data.model})` : `Failed (${data.error})`}`);

      if (data.success && data.advice) {
        setAiResponse(data.advice);
        setIsAiUnavailable(false);
      } else {
        setIsAiUnavailable(true);
      }
    } catch (err: any) {
      console.error(`AI Advisor Debug\nHTTP Status: Network Error\nEndpoint: ${endpoint}\nServer Response: ${err?.message || 'Failed to fetch'}`);
      setIsAiUnavailable(true);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Helper to render formatted Gemini response text with bold highlights
  const renderFormattedAdvice = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={lineIdx} className="h-1.5" />;
      
      // Parse **bold** parts
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={lineIdx} className="leading-relaxed text-slate-800">
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-black text-slate-950">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Header / Collapsible Button */}
      <button
        type="button"
        id="btn-toggle-ai-advisor"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-2xs shrink-0">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-slate-900">
                {t.aiAdvisorTitle}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200/70">
                <Sparkles className="w-3 h-3 mr-1 text-blue-600" />
                {t.aiBadge}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
              {t.aiAdvisorSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-slate-400 pl-2">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expanded Advisor Content */}
      {isOpen && (
        <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 bg-slate-50/40 space-y-5">
          {/* How It Works Collapsible Helper */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>{t.howItWorksBtn}</span>
              {showHowItWorks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showHowItWorks && (
              <div className="mt-2 p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 space-y-1.5 font-medium">
                {t.aiAdvisorSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-black text-blue-700 shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Small Secondary AI Unavailable Notice */}
          {isAiUnavailable && (
            <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-center justify-between gap-2.5 text-xs sm:text-sm text-amber-900">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium">
                  {t.aiUnavailableNotice}
                </span>
              </div>
              <button
                type="button"
                id="btn-retry-ai-advisor"
                onClick={handleAskGemini}
                disabled={isLoadingAi}
                className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-300 transition-all text-xs cursor-pointer shrink-0 inline-flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
                <span>{t.retryAiBtn}</span>
              </button>
            </div>
          )}

          {/* SECTION 1: BUSINESS ANALYSIS (Local calculations) */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-slate-600" />
                {t.localAnalysisTitle}
              </span>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
                {t.localAnalysisBadge}
              </span>
            </div>

            {/* 1. Health Verdict Banner & Key ROI */}
            <div className={`p-4 rounded-xl border ${verdictColor} flex items-center justify-between gap-3`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-white rounded-lg shadow-2xs shrink-0">
                  {verdictIcon}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block opacity-75">
                    {t.healthVerdictTitle}
                  </span>
                  <span className="text-sm sm:text-base font-black tracking-tight truncate block">
                    {healthVerdict}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block opacity-75">
                  {t.roiShort}
                </span>
                <span className="text-sm sm:text-base font-black">
                  {formatPercent(profitPercentage, true)}
                </span>
              </div>
            </div>

            {/* Key Summary Sentence */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
              💡 {localSummary}
            </div>

            {/* 4-Stat Core Analysis Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-slate-500 font-bold block truncate">{t.profitPerPieceLabel}</span>
                <span className={`text-sm sm:text-base font-black block mt-0.5 ${profitPerPiece >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
                  {formatINR(profitPerPiece)}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-slate-500 font-bold block truncate">{isProfit ? t.netProfitLabel : t.netLossLabel}</span>
                <span className={`text-sm sm:text-base font-black block mt-0.5 ${totalProfit >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
                  {formatINR(totalProfit)}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-slate-500 font-bold block truncate">{t.roiLabel}</span>
                <span className="text-sm sm:text-base font-black text-slate-900 block mt-0.5">
                  {formatPercent(profitPercentage, true)}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-slate-500 font-bold block truncate">{t.marginLabel}</span>
                <span className="text-sm sm:text-base font-black text-slate-900 block mt-0.5">
                  {formatPercent(profitMarginOnSales, true)}
                </span>
              </div>
            </div>

            {/* 2. Profit Milestones Volume Analysis */}
            {profitPerPiece > 0 && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-blue-600" />
                    {t.milestonesTitle}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {milestones.map((target) => {
                    const reqUnits = Math.ceil(target / profitPerPiece);
                    const reqRevenue = reqUnits * sellingPrice;
                    return (
                      <div
                        key={target}
                        className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between"
                      >
                        <span className="text-xs font-extrabold text-blue-900 block">
                          ₹{target.toLocaleString('en-IN')} {t.surplusBadge}
                        </span>
                        <div className="mt-1">
                          <span className="text-sm sm:text-base font-black text-slate-900 block">
                            {reqUnits.toLocaleString('en-IN')} {t.targetUnits}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            {t.revenueRequired} {formatINR(reqRevenue)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Strategic Levers */}
            {isProfit && (
              <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  {t.optimizationTitle}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 flex flex-col justify-between">
                    <span className="text-slate-700 font-medium">
                      {t.priceBumpTip} (+{formatINR(sellingPrice * 0.05)}):
                    </span>
                    <span className="font-black text-teal-800 text-sm mt-1">
                      +{formatINR(priceBump5PctExtraProfit)} ({quantity} {t.targetUnits})
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between">
                    <span className="text-slate-700 font-medium">
                      {t.costReductionTip} (-{formatINR(costPrice * 0.05)}):
                    </span>
                    <span className="font-black text-blue-800 text-sm mt-1">
                      +{formatINR(costReduction5PctExtraProfit)} ({quantity} {t.targetUnits})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: AI ADVICE (Gemini Powered) */}
          <div className="pt-2 border-t border-slate-200/70">
            {aiResponse ? (
              <div className="bg-white p-5 rounded-xl border border-blue-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      {t.aiBadge}
                    </span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/50">
                      Gemini
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAskGemini}
                    disabled={isLoadingAi}
                    className="text-xs font-bold text-slate-500 hover:text-blue-600 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
                    <span>{t.retryAiBtn}</span>
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
                  {renderFormattedAdvice(aiResponse)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <p className="text-xs text-slate-500 font-medium">
                  {t.aiDisclaimer}
                </p>

                <button
                  type="button"
                  id="btn-ask-gemini-ai"
                  onClick={handleAskGemini}
                  disabled={isLoadingAi}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap min-h-[42px]"
                >
                  {isLoadingAi ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      <span>{t.generatingAdvice}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>{t.askGeminiBtn}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
