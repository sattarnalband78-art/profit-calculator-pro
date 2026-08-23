import React, { useState, useMemo } from 'react';
import { CalculationResult } from '../types';
import { formatINR, formatPercent } from '../utils/formatters';
import {
  History,
  Trash2,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  X,
  IndianRupee,
  Layers,
  ArrowUpRight,
  Edit3,
  AlertTriangle,
  Tag,
  Trophy,
  Award,
  Medal,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HistoryListProps {
  history: CalculationResult[];
  onLoadResult: (result: CalculationResult) => void;
  onEditResult: (result: CalculationResult) => void;
  onDeleteResult: (id: string) => void;
  onClearHistory: () => void;
  editingId?: string | null;
}

type RankingSortMode = 'all' | 'profit' | 'roi' | 'sales';

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onLoadResult,
  onEditResult,
  onDeleteResult,
  onClearHistory,
  editingId,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<RankingSortMode>('all');
  const [itemToDelete, setItemToDelete] = useState<CalculationResult | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Sorted and filtered history based on ranking mode & search query
  const processedHistory = useMemo(() => {
    let list = [...history];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) =>
        item.productName.toLowerCase().includes(q)
      );
    }

    // Ranking sorts
    if (sortMode === 'profit') {
      list.sort((a, b) => b.totalProfit - a.totalProfit);
    } else if (sortMode === 'roi') {
      list.sort((a, b) => b.profitPercentage - a.profitPercentage);
    } else if (sortMode === 'sales') {
      list.sort((a, b) => b.totalSales - a.totalSales);
    }

    return list;
  }, [history, searchQuery, sortMode]);

  // Aggregate catalog metrics strictly from saved product records
  const catalogMetrics = useMemo(() => {
    if (!history || history.length === 0) {
      return { totalSales: 0, totalCost: 0, totalProfit: 0, avgRoi: 0 };
    }

    let totalCost = 0;
    let totalSales = 0;

    history.forEach((item) => {
      const c = Number(item.costPrice) || 0;
      const s = Number(item.sellingPrice) || 0;
      const q = Number(item.quantity) || 0;

      const itemCost = c * q;
      const itemSales = s * q;

      totalCost += itemCost;
      totalSales += itemSales;
    });

    const totalProfit = totalSales - totalCost;
    const avgRoi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    return { totalSales, totalCost, totalProfit, avgRoi };
  }, [history]);

  // Top performers lookup for podium
  const topPerformers = useMemo(() => {
    if (history.length === 0) return null;
    const topProfit = [...history].sort((a, b) => b.totalProfit - a.totalProfit)[0];
    const topRoi = [...history].sort((a, b) => b.profitPercentage - a.profitPercentage)[0];
    const topSales = [...history].sort((a, b) => b.totalSales - a.totalSales)[0];
    return { topProfit, topRoi, topSales };
  }, [history]);

  // Export CSV
  const handleExportCSV = () => {
    if (history.length === 0) return;

    const headers = [
      'Product Name',
      'Cost Price (INR)',
      'Selling Price (INR)',
      'Quantity',
      'Total Sales (INR)',
      'Total Cost (INR)',
      'Total Profit (INR)',
      'Profit %',
      'Saved Date',
    ];

    const rows = history.map((h) => [
      `"${(h.productName || 'Unnamed').replace(/"/g, '""')}"`,
      h.costPrice,
      h.sellingPrice,
      h.quantity,
      h.totalSales,
      h.totalCost,
      h.totalProfit,
      `${h.profitPercentage.toFixed(2)}%`,
      `"${new Date(h.timestamp).toLocaleDateString('en-IN')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `profit_calculator_products_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      onDeleteResult(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const confirmClearAll = () => {
    onClearHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
      {/* 1. Header with Title, Count, Search, Export and Clear */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white shrink-0 shadow-2xs">
              <History className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  {t.myProductsTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                  {history.length} {t.totalSavedBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {t.savedLogsTitle}
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Export CSV Button */}
              <button
                type="button"
                id="btn-export-csv"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer min-h-[34px]"
                title={t.exportCsvBtn}
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.exportCsvBtn}</span>
              </button>

              {/* Clear All History Button */}
              <button
                type="button"
                id="btn-clear-all-history"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200/80 transition-all cursor-pointer min-h-[34px]"
                title={t.clearHistoryBtn}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearHistoryBtn}</span>
              </button>
            </div>
          )}
        </div>

        {/* Ranking & View Filter Tabs */}
        {history.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              type="button"
              id="tab-rank-all"
              onClick={() => setSortMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                sortMode === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.rankingTabAll}
            </button>
            <button
              type="button"
              id="tab-rank-profit"
              onClick={() => setSortMode('profit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                sortMode === 'profit'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.rankingTabProfit}
            </button>
            <button
              type="button"
              id="tab-rank-roi"
              onClick={() => setSortMode('roi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                sortMode === 'roi'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.rankingTabRoi}
            </button>
            <button
              type="button"
              id="tab-rank-sales"
              onClick={() => setSortMode('sales')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                sortMode === 'sales'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.rankingTabSales}
            </button>
          </div>
        )}

        {/* Search Bar (When history has items) */}
        {history.length > 0 && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              id="search-saved-products"
              placeholder={t.searchProductsPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8.5 pr-8 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-slate-800 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Top Performers Podium (When in ranking mode or > 2 products) */}
      {sortMode !== 'all' && topPerformers && history.length >= 2 && !searchQuery && (
        <div className="bg-slate-50 border-b border-slate-200/80 p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t.topPerformerPodium}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Top Profit */}
            <div className="bg-white p-2.5 rounded-xl border border-teal-200 shadow-2xs flex items-center gap-2.5">
              <div className="p-2 bg-teal-50 rounded-lg text-teal-700">
                <Medal className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  {t.topProfitLabel}
                </span>
                <span className="font-extrabold text-slate-900 truncate block">
                  {topPerformers.topProfit.productName || t.unnamedProduct}
                </span>
                <span className="font-black text-teal-700 text-xs">
                  {formatINR(topPerformers.topProfit.totalProfit, true)}
                </span>
              </div>
            </div>

            {/* Top ROI */}
            <div className="bg-white p-2.5 rounded-xl border border-blue-200 shadow-2xs flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  {t.topRoiLabel}
                </span>
                <span className="font-extrabold text-slate-900 truncate block">
                  {topPerformers.topRoi.productName || t.unnamedProduct}
                </span>
                <span className="font-black text-blue-700 text-xs">
                  {formatPercent(topPerformers.topRoi.profitPercentage, true)}
                </span>
              </div>
            </div>

            {/* Top Sales */}
            <div className="bg-white p-2.5 rounded-xl border border-purple-200 shadow-2xs flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-700">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  {t.topSalesLabel}
                </span>
                <span className="font-extrabold text-slate-900 truncate block">
                  {topPerformers.topSales.productName || t.unnamedProduct}
                </span>
                <span className="font-black text-purple-700 text-xs">
                  {formatINR(topPerformers.topSales.totalSales)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Catalog Metrics Summary Bar (When History > 0) */}
      {history.length > 0 && (
        <div className="bg-slate-900 text-white p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="border-r border-slate-800/80 pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.catalogSales}
            </span>
            <span className="text-sm sm:text-base font-black text-slate-100 tracking-tight">
              {formatINR(catalogMetrics.totalSales)}
            </span>
          </div>

          <div className="sm:border-r border-slate-800/80 sm:pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.catalogCost}
            </span>
            <span className="text-sm sm:text-base font-black text-slate-100 tracking-tight">
              {formatINR(catalogMetrics.totalCost)}
            </span>
          </div>

          <div className="border-r border-slate-800/80 pr-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.catalogProfit}
            </span>
            <span
              className={`text-sm sm:text-base font-black tracking-tight ${
                catalogMetrics.totalProfit >= 0 ? 'text-teal-400' : 'text-rose-400'
              }`}
            >
              {formatINR(catalogMetrics.totalProfit, true)}
            </span>
          </div>

          <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.catalogRoi}
            </span>
            <span
              className={`text-sm sm:text-base font-black tracking-tight ${
                catalogMetrics.avgRoi >= 0 ? 'text-teal-400' : 'text-rose-400'
              }`}
            >
              {formatPercent(catalogMetrics.avgRoi, true)}
            </span>
          </div>
        </div>
      )}

      {/* 4. Product Cards List / Empty State */}
      <div className="p-3.5 sm:p-5">
        {history.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <History className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              {t.noHistoryTitle}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {t.noHistoryDesc}
            </p>
          </div>
        ) : processedHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            <Search className="w-6 h-6 mx-auto mb-2 text-slate-300" />
            {t.noSearchMatch} "{searchQuery}"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {processedHistory.map((item, index) => {
              const isProfit = item.isProfit;
              const isLoss = item.isLoss;
              const isCurrentlyEditing = editingId === item.id;
              const isRanked = sortMode !== 'all';
              const rankNum = index + 1;

              return (
                <div
                  key={item.id}
                  id={`product-card-${item.id}`}
                  className={`bg-white rounded-xl p-4 transition-all flex flex-col justify-between ${
                    isCurrentlyEditing
                      ? 'border-2 border-amber-400 bg-amber-50/10 shadow-sm ring-2 ring-amber-400/20'
                      : 'border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300'
                  }`}
                >
                  {/* Card Top: Product Name & Status Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {isRanked && (
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                              rankNum === 1
                                ? 'bg-amber-400 text-slate-950 shadow-2xs'
                                : rankNum === 2
                                ? 'bg-slate-300 text-slate-900'
                                : rankNum === 3
                                ? 'bg-amber-700/80 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            #{rankNum}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
                          {item.productName || t.unnamedProduct}
                        </h4>
                      </div>

                      {/* Status / ROI Badge */}
                      {isProfit && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black bg-teal-50 text-teal-800 border border-teal-200/80 shrink-0">
                          <TrendingUp className="w-3 h-3 text-teal-600" />
                          <span>{t.statusProfit}</span>
                          <span>+{item.profitPercentage.toFixed(0)}%</span>
                        </span>
                      )}
                      {isLoss && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black bg-rose-50 text-rose-800 border border-rose-200/80 shrink-0">
                          <TrendingDown className="w-3 h-3 text-rose-600" />
                          <span>{t.statusLoss}</span>
                          <span>{item.profitPercentage.toFixed(0)}%</span>
                        </span>
                      )}
                      {!isProfit && !isLoss && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                          <Minus className="w-3 h-3" />
                          <span>{t.statusBreakEven}</span>
                        </span>
                      )}
                    </div>

                    {/* Unit Economics Breakdown Pill */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 mb-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <Layers className="w-3 h-3 text-slate-400" />
                          {t.quantityLabel}:
                        </span>
                        <span className="font-bold text-slate-800">
                          {item.quantity} {t.pcsLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <IndianRupee className="w-3 h-3 text-slate-400" />
                          {t.unitBadgeCost}:
                        </span>
                        <span className="font-bold text-slate-800">
                          {formatINR(item.costPrice)} /{t.perUnit}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <Tag className="w-3 h-3 text-blue-500" />
                          {t.unitBadgeSelling}:
                        </span>
                        <span className="font-bold text-slate-800">
                          {formatINR(item.sellingPrice)} /{t.perUnit}
                        </span>
                      </div>
                    </div>

                    {/* Total Profit & Total Sales Highlights */}
                    <div className="grid grid-cols-2 gap-2 pt-1 pb-3 border-b border-slate-100 items-start">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {isLoss ? t.lossLabelShort : t.profitLabelShort}:
                        </span>
                        <span
                          className={`text-sm sm:text-base font-black tracking-tight leading-tight block ${
                            isProfit ? 'text-teal-700' : isLoss ? 'text-rose-700' : 'text-slate-800'
                          }`}
                        >
                          {formatINR(item.totalProfit, true)}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                          ({formatINR(item.profitPerPiece, true)} /{t.perUnit})
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {t.totalSalesShort}:
                        </span>
                        <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight block">
                          {formatINR(item.totalSales)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                          {t.totalCostLabel}: {formatINR(item.totalCost)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: 1-Click Action Buttons (Fill, Edit, Delete) */}
                  <div className="pt-3 flex items-center justify-between gap-1.5">
                    {/* Fill Calculator Button */}
                    <button
                      type="button"
                      id={`btn-fill-${item.id}`}
                      onClick={() => onLoadResult(item)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all cursor-pointer active:scale-95 min-h-[34px]"
                      title={t.fillCalculatorBtn}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                      <span>{t.fillCalculatorBtn}</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      id={`btn-edit-${item.id}`}
                      onClick={() => onEditResult(item)}
                      className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer active:scale-95 min-h-[34px] ${
                        isCurrentlyEditing
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                      title={t.editProductBtn}
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>{t.editProductBtn}</span>
                    </button>

                    {/* Delete Item Button */}
                    <button
                      type="button"
                      id={`btn-delete-${item.id}`}
                      onClick={() => setItemToDelete(item)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer min-w-[34px] min-h-[34px] flex items-center justify-center"
                      title={t.deleteProductBtn}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Delete Single Item Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {t.confirmDeleteTitle}
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.confirmDeleteDesc}
            </p>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 truncate">
              {itemToDelete.productName || t.unnamedProduct}
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer min-h-[40px]"
              >
                {t.cancelDialogBtn}
              </button>
              <button
                type="button"
                id="btn-confirm-delete-yes"
                onClick={confirmDeleteItem}
                className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 min-h-[40px]"
              >
                {t.confirmYes}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Clear All History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {t.confirmClearTitle}
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.confirmClearDesc}
            </p>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer min-h-[40px]"
              >
                {t.cancelDialogBtn}
              </button>
              <button
                type="button"
                id="btn-confirm-clear-all-yes"
                onClick={confirmClearAll}
                className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 min-h-[40px]"
              >
                {t.confirmClearYes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
