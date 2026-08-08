import React from 'react';
import { CalculationResult } from '../types';
import { formatINR, formatPercent } from '../utils/formatters';
import { History, Trash2, ArrowUpRight, ArrowDownRight, Layers, Download, RefreshCw } from 'lucide-react';

interface HistoryListProps {
  history: CalculationResult[];
  onLoadResult: (result: CalculationResult) => void;
  onDeleteResult: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onLoadResult,
  onDeleteResult,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return null;
  }

  // Calculate totals across saved products
  const portfolioSales = history.reduce((acc, curr) => acc + curr.totalSales, 0);
  const portfolioCost = history.reduce((acc, curr) => acc + curr.totalCost, 0);
  const portfolioProfit = portfolioSales - portfolioCost;
  const portfolioReturn = portfolioCost > 0 ? (portfolioProfit / portfolioCost) * 100 : 0;

  const handleExportCSV = () => {
    const headers = ['Product Name', 'Cost Price (₹)', 'Selling Price (₹)', 'Quantity', 'Total Sales (₹)', 'Total Cost (₹)', 'Total Profit (₹)', 'Profit %'];
    const rows = history.map((item) => [
      `"${item.productName.replace(/"/g, '""')}"`,
      item.costPrice,
      item.sellingPrice,
      item.quantity,
      item.totalSales,
      item.totalCost,
      item.totalProfit,
      `${item.profitPercentage.toFixed(2)}%`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `profit_calculator_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Saved Product Log ({history.length})
            </h3>
            <p className="text-xs text-slate-500">Compare products and view catalog total metrics</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-slate-500" /> Export CSV
          </button>
          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear All
          </button>
        </div>
      </div>

      {/* Portfolio Overall Summary Card */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Combined Catalog Summary
          </span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-2xl font-black text-emerald-400">
              {formatINR(portfolioProfit, true)}
            </span>
            <span className="text-xs font-semibold text-slate-300">
              ({formatPercent(portfolioReturn, true)} ROI)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Total Revenue</span>
            <span className="font-bold text-slate-100">{formatINR(portfolioSales)}</span>
          </div>
          <div className="h-6 w-px bg-slate-700"></div>
          <div>
            <span className="text-slate-400 block text-[10px]">Total Cost</span>
            <span className="font-bold text-slate-100">{formatINR(portfolioCost)}</span>
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
        {history.map((item) => (
          <div
            key={item.id}
            className="py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 hover:bg-slate-50/80 p-2 rounded-xl transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 truncate">
                  {item.productName || 'Unnamed Item'}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.isProfit
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.isLoss
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {formatPercent(item.profitPercentage, true)}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span>Qty: {item.quantity}</span>
                <span>•</span>
                <span>Cost: {formatINR(item.costPrice)}</span>
                <span>•</span>
                <span>Sell: {formatINR(item.sellingPrice)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div
                  className={`text-sm font-extrabold ${
                    item.isProfit
                      ? 'text-emerald-600'
                      : item.isLoss
                      ? 'text-rose-600'
                      : 'text-slate-700'
                  }`}
                >
                  {formatINR(item.totalProfit, true)}
                </div>
                <div className="text-[10px] text-slate-400">
                  Sales: {formatINR(item.totalSales)}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onLoadResult(item)}
                  title="Load item into calculator"
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteResult(item.id)}
                  title="Delete item"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
