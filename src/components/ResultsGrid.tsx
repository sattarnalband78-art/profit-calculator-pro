import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { formatINR, formatPercent } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import { PrintReportModal } from './PrintReportModal';
import { shareTextOrContent } from '../utils/nativeBridge';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Share2,
  Printer,
  BookmarkPlus,
  Check,
  Package,
  Coins,
  Activity,
  FileText,
} from 'lucide-react';

interface ResultsGridProps {
  result: CalculationResult | null;
  onSaveResult?: () => void;
  isSaved?: boolean;
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({
  result,
  onSaveResult,
  isSaved = false,
}) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  if (!result) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-10 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
          <Coins className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {t.emptyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            {t.emptySubtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-bold text-slate-600">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
            {t.badgeSales}
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
            {t.badgeCost}
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
            {t.badgeProfitLoss}
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
            {t.badgeReturn}
          </span>
        </div>
      </div>
    );
  }

  const {
    productName,
    totalSales,
    totalCost,
    totalProfit,
    profitPerPiece,
    profitPercentage,
    profitMarginOnSales,
    isProfit,
    isLoss,
  } = result;

  // Business Health Status Calculation
  let healthLabel = t.healthGoodProfit;
  let healthBadgeStyle = 'bg-teal-50 text-teal-800 border-teal-200';
  let healthIcon = <TrendingUp className="w-4 h-4 text-teal-600" />;

  if (isLoss) {
    healthLabel = t.healthLossStatus;
    healthBadgeStyle = 'bg-rose-50 text-rose-800 border-rose-200';
    healthIcon = <TrendingDown className="w-4 h-4 text-rose-600" />;
  } else if (!isProfit && !isLoss) {
    healthLabel = t.healthBreakEvenStatus;
    healthBadgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
    healthIcon = <Minus className="w-4 h-4 text-slate-500" />;
  } else if (profitPercentage >= 50) {
    healthLabel = t.healthExcellentProfit;
    healthBadgeStyle = 'bg-emerald-50 text-emerald-900 border-emerald-300';
    healthIcon = <TrendingUp className="w-4 h-4 text-emerald-600" />;
  } else if (profitPercentage < 15) {
    healthLabel = t.healthLowProfit;
    healthBadgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    healthIcon = <Activity className="w-4 h-4 text-amber-600" />;
  }

  const handleShare = async () => {
    const pName = productName || t.unnamedProduct;
    const profitText = isProfit
      ? `${t.netProfitLabel}: ${formatINR(totalProfit)} (+${formatINR(profitPerPiece)} / ${t.perUnit})`
      : isLoss
      ? `${t.netLossLabel}: ${formatINR(Math.abs(totalProfit))} (-${formatINR(Math.abs(profitPerPiece))} / ${t.perUnit})`
      : `${t.breakEvenStatusTitle}: ₹0.00`;

    const shareContent = `📊 ${pName} — Profit Summary
━━━━━━━━━━━━━━━━━━━━
• ${t.costPriceLabel}: ${formatINR(result.costPrice)} / ${t.perUnit}
• ${t.sellingPriceLabel}: ${formatINR(result.sellingPrice)} / ${t.perUnit}
• ${t.quantityLabel}: ${result.quantity.toLocaleString('en-IN')} ${t.pcsLabel}
• ${t.totalCostLabel}: ${formatINR(totalCost)}
• ${t.totalSalesLabel}: ${formatINR(totalSales)}
• ${profitText}
• ${t.roiLabel}: ${formatPercent(profitPercentage)}
• ${t.marginLabel}: ${formatPercent(profitMarginOnSales)}
━━━━━━━━━━━━━━━━━━━━
${t.shareFooter}`;

    await shareTextOrContent({
      title: `${pName} - Profit Summary`,
      text: shareContent,
      dialogTitle: `${pName} - Profit Summary`,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenPrint = () => {
    // Open the clean PDF report & print preview modal
    setShowPrintModal(true);
  };

  return (
    <div className="space-y-4.5 printable-area">
      {/* Top Action Toolbar (Product Title + Share + Print/PDF + Save Log) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs no-print">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-slate-900 text-white shrink-0 shadow-2xs">
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <div className="min-w-0">
            <span className="text-sm sm:text-base font-black text-slate-900 truncate block">
              {productName || t.unnamedProduct}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {result.quantity.toLocaleString('en-IN')} {t.pcsLabel} • {formatINR(result.sellingPrice)} / {t.perUnit}
            </span>
          </div>
        </div>

        {/* Action Toolbar Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          {/* Share Button */}
          <button
            id="btn-share-result"
            type="button"
            onClick={handleShare}
            className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80 transition-all cursor-pointer active:scale-95 whitespace-nowrap min-h-[42px]"
            title={t.shareBtn}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1.5 text-blue-600 shrink-0" />
                <span>{t.copiedMsg}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-1.5 text-slate-600 shrink-0" />
                <span>{t.shareBtn}</span>
              </>
            )}
          </button>

          {/* Print / PDF Invoice Button */}
          <button
            id="btn-print-pdf"
            type="button"
            onClick={handleOpenPrint}
            className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80 transition-all cursor-pointer active:scale-95 whitespace-nowrap min-h-[42px]"
            title={t.printBtn}
          >
            <Printer className="w-4 h-4 mr-1.5 text-blue-600 shrink-0" />
            <span>{t.printBtn}</span>
          </button>

          {/* Save to Log / My Products */}
          <button
            id="btn-save-log"
            type="button"
            onClick={onSaveResult}
            disabled={isSaved}
            className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap min-h-[42px] cursor-pointer ${
              isSaved
                ? 'bg-blue-50 text-blue-900 border border-blue-200/90 cursor-default font-black'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs active:scale-95'
            }`}
            title={isSaved ? t.savedLogBtn : t.saveLogBtn}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 mr-1.5 text-blue-700 shrink-0" />
                <span>{t.savedLogBtn}</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4 mr-1.5 shrink-0" />
                <span>{t.saveLogBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. Large Premium Hero Card: Your Profit */}
      <div
        className={`p-6 sm:p-7 rounded-2xl border shadow-sm transition-all relative overflow-hidden bg-white ${
          isProfit
            ? 'border-teal-500/50 ring-1 ring-teal-500/20'
            : isLoss
            ? 'border-rose-400/50 ring-1 ring-rose-400/20'
            : 'border-slate-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs sm:text-sm font-black tracking-wider uppercase ${
                  isProfit ? 'text-teal-800' : isLoss ? 'text-rose-800' : 'text-slate-600'
                }`}
              >
                {isLoss ? t.yourLossHeading : t.yourProfitHeading}
              </span>

              {/* Health Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${healthBadgeStyle}`}
              >
                {healthIcon}
                <span>{healthLabel}</span>
              </span>
            </div>

            {/* Huge Hero Profit Number - Largest number on screen */}
            <div
              className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight ${
                isProfit ? 'text-teal-700' : isLoss ? 'text-rose-700' : 'text-slate-900'
              }`}
            >
              {formatINR(totalProfit, true)}
            </div>

            {/* Sub-value: Profit / piece */}
            <div className="flex items-center gap-2 mt-2.5 text-sm sm:text-base font-bold text-slate-700">
              <span>
                {isLoss ? t.yourLossPerPiece : t.yourProfitPerPiece}:
              </span>
              <span
                className={`font-black text-base sm:text-lg ${
                  isProfit ? 'text-teal-800' : isLoss ? 'text-rose-800' : 'text-slate-900'
                }`}
              >
                {formatINR(profitPerPiece, true)}
              </span>
              <span className="text-slate-400 font-semibold">/ {t.perUnit}</span>
            </div>
          </div>

          {/* Quick Return Badge Container on Hero */}
          <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <span className="text-xs sm:text-sm text-slate-500 font-extrabold uppercase tracking-wider block">
              {t.roiLabel}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {formatPercent(profitPercentage, true)}
            </div>
            <span className="text-xs text-slate-500 font-bold block mt-0.5">
              {t.marginShort}: {formatPercent(profitMarginOnSales, true)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Prominent Supporting Cards Below (Total Sales, Total Cost, Profit/Piece, ROI, Sales Margin) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Sales */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">
            {t.totalSalesLabel}
          </span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {formatINR(totalSales)}
            </div>
            <span className="text-xs text-slate-500 font-medium block truncate mt-1">
              {result.quantity} × {formatINR(result.sellingPrice)}
            </span>
          </div>
        </div>

        {/* 2. Total Cost */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">
            {t.totalCostLabel}
          </span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {formatINR(totalCost)}
            </div>
            <span className="text-xs text-slate-500 font-medium block truncate mt-1">
              {result.quantity} × {formatINR(result.costPrice)}
            </span>
          </div>
        </div>

        {/* 3. Profit / Piece */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">
            {isLoss ? t.lossPerPieceLabel : t.profitPerPieceLabel}
          </span>
          <div className="mt-2">
            <div
              className={`text-xl sm:text-2xl font-black tracking-tight ${
                isProfit ? 'text-teal-700' : isLoss ? 'text-rose-700' : 'text-slate-900'
              }`}
            >
              {formatINR(profitPerPiece, true)}
            </div>
            <span className="text-xs text-slate-500 font-medium block truncate mt-1">
              {formatINR(result.sellingPrice)} − {formatINR(result.costPrice)}
            </span>
          </div>
        </div>

        {/* 4. ROI */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">
            {t.roiShort}
          </span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {formatPercent(profitPercentage, true)}
            </div>
            <span className="text-xs text-slate-500 font-medium block truncate mt-1">
              {t.roiLabel}
            </span>
          </div>
        </div>

        {/* 5. Sales Margin */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">
            {t.marginShort}
          </span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {formatPercent(profitMarginOnSales, true)}
            </div>
            <span className="text-xs text-slate-500 font-medium block truncate mt-1">
              {t.marginLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Print & PDF Modal */}
      {showPrintModal && (
        <PrintReportModal
          result={result}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
