import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { formatINR, formatPercent } from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BookmarkPlus,
  Check,
  Share2,
  Printer,
  Copy,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
} from 'lucide-react';

interface ResultsGridProps {
  result: CalculationResult | null;
  onSaveResult: () => void;
  isSaved: boolean;
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ result, onSaveResult, isSaved }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!result) return;

    const summaryText = `📊 Profit Calculator Pro Report
Product: ${result.productName || 'Item'}
------------------------------------
💰 Total Sales: ${formatINR(result.totalSales)}
💸 Total Cost: ${formatINR(result.totalCost)}
📈 Net ${result.isLoss ? 'Loss' : 'Profit'}: ${formatINR(result.totalProfit, true)}
🏷️ Profit per Piece: ${formatINR(result.profitPerPiece, true)}
📊 Profit Return: ${formatPercent(result.profitPercentage, true)}
------------------------------------
Calculated via Profit Calculator Pro (₹ INR)`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Profit Report - ${result.productName || 'Product'}`,
          text: summaryText,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if user cancelled or error
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert(summaryText);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!result) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center min-h-[360px]">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100 shadow-inner">
          <Calculator className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Calculate Your Business Profit in Seconds
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          Enter product name, cost price per piece, selling price per piece, and quantity sold on the left to instantly calculate total sales, total cost, net profit or loss, and profit percentage.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-slate-600 font-semibold max-w-md w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <span className="flex items-center justify-center gap-1">💰 Total Sales</span>
          <span className="flex items-center justify-center gap-1">💸 Total Cost</span>
          <span className="flex items-center justify-center gap-1">📈 Profit/Loss</span>
          <span className="flex items-center justify-center gap-1">📊 Profit %</span>
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

  // Status Banner Config
  const statusConfig = isProfit
    ? {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        badge: 'bg-emerald-600 text-white',
        icon: <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />,
        title: 'PROFIT GENERATED',
        subtitle: `Making ${formatINR(profitPerPiece)} profit per piece sold (${formatPercent(profitPercentage)} return on cost).`,
      }
    : isLoss
    ? {
        bg: 'bg-rose-50 border-rose-200 text-rose-900',
        badge: 'bg-rose-600 text-white',
        icon: <TrendingDown className="w-5 h-5 text-rose-600 shrink-0" />,
        title: 'OPERATING AT A LOSS',
        subtitle: `Losing ${formatINR(Math.abs(profitPerPiece))} on every piece sold. Consider raising selling price or lowering costs.`,
      }
    : {
        bg: 'bg-slate-100 border-slate-200 text-slate-900',
        badge: 'bg-slate-600 text-white',
        icon: <Minus className="w-5 h-5 text-slate-600 shrink-0" />,
        title: 'BREAK EVEN POINT',
        subtitle: 'Selling price equals cost price with zero net profit or loss.',
      };

  return (
    <div className="space-y-4 printable-area">
      {/* Action Bar (Share & Print) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 px-2 py-1 bg-slate-100 rounded-md">
            Product: {productName || 'Item'}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 transition-colors cursor-pointer active:scale-95"
            title="Share calculation summary"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Copied!
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 mr-1.5 text-slate-600" /> Share Result
              </>
            )}
          </button>

          {/* Print / Save PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 transition-colors cursor-pointer active:scale-95"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-600" /> Print / PDF
          </button>

          {/* Save to Log */}
          <button
            type="button"
            onClick={onSaveResult}
            disabled={isSaved}
            className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Saved
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5 mr-1.5" /> Save Log
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. Profit / Loss Status Indicator Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border ${statusConfig.bg} shadow-xs transition-all flex items-center justify-between gap-3`}>
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 bg-white rounded-xl shadow-2xs border border-slate-100 shrink-0">
            {statusConfig.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${statusConfig.badge}`}>
                {statusConfig.title}
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1 font-medium">{statusConfig.subtitle}</p>
          </div>
        </div>
      </div>

      {/* 2. Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: 💰 Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">💰</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">Revenue</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
              {formatINR(totalSales)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {result.quantity} units × {formatINR(result.sellingPrice)}
            </span>
          </div>
        </div>

        {/* Card 2: 💸 Total Cost */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">💸</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cost</span>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase">Expenses</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
              {formatINR(totalCost)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {result.quantity} units × {formatINR(result.costPrice)}
            </span>
          </div>
        </div>

        {/* Card 3: 📈 Total Profit / Loss */}
        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
          isProfit
            ? 'bg-emerald-50 border-emerald-200'
            : isLoss
            ? 'bg-rose-50 border-rose-200'
            : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📈</span>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isProfit ? 'text-emerald-700' : isLoss ? 'text-rose-700' : 'text-slate-600'
              }`}>
                {isLoss ? 'Total Loss' : 'Total Profit'}
              </span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              isProfit ? 'bg-emerald-600 text-white' : isLoss ? 'bg-rose-600 text-white' : 'bg-slate-600 text-white'
            }`}>
              Net Result
            </span>
          </div>
          <div>
            <span className={`text-2xl sm:text-3xl font-black tracking-tight block ${
              isProfit ? 'text-emerald-800' : isLoss ? 'text-rose-800' : 'text-slate-800'
            }`}>
              {formatINR(totalProfit, true)}
            </span>
            <span className="text-[11px] text-slate-600 font-medium mt-1 block">
              Sales ({formatINR(totalSales)}) − Cost ({formatINR(totalCost)})
            </span>
          </div>
        </div>
      </div>

      {/* 3. Secondary Unit Logic & Margin Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 🏷️ Profit per Piece */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏷️</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isLoss ? 'Loss per Piece' : 'Profit per Piece'}
              </span>
            </div>
            <div className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase tracking-wide">
              Per Unit
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-black tracking-tighter ${
              isProfit ? 'text-emerald-700' : isLoss ? 'text-rose-700' : 'text-slate-800'
            }`}>
              {formatINR(profitPerPiece, true)}
            </span>
            <span className="text-slate-400 font-medium text-sm">/ unit</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Selling Price ({formatINR(result.sellingPrice)}) − Cost Price ({formatINR(result.costPrice)})
          </p>
        </div>

        {/* 📊 Profit Percentage & Circular Gauge */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Profit Percentage
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              ROI %
            </span>
          </div>

          <div className="flex flex-1 items-center justify-around gap-4 pt-2">
            {/* SVG Circular Progress Meter */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
                <path
                  className={isProfit ? 'text-emerald-500' : isLoss ? 'text-rose-500' : 'text-slate-400'}
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${Math.min(Math.max(Math.abs(profitPercentage), 0), 100)}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
              </svg>
              <span className="absolute text-lg font-black text-slate-800">
                {profitPercentage.toFixed(1)}%
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${isProfit ? 'bg-emerald-500' : isLoss ? 'bg-rose-500' : 'bg-slate-400'}`}></div>
                <span className="text-xs text-slate-500 font-medium">Return on Cost</span>
              </div>
              <div className={`text-sm font-bold ${isProfit ? 'text-emerald-600' : isLoss ? 'text-rose-600' : 'text-slate-700'}`}>
                {isProfit ? (profitPercentage > 25 ? 'High Performance' : 'Profitable') : isLoss ? 'Loss Return' : 'Break Even'}
              </div>
              <div className="text-[11px] text-slate-400">
                Sales Margin: {formatPercent(profitMarginOnSales)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
