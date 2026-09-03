import React, { useState, useEffect } from 'react';
import { CalculationResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatINR, formatPercent } from '../utils/formatters';
import {
  generateAndDownloadPdf,
  triggerDirectPrint,
  generatePdfFilename,
} from '../utils/printReport';
import {
  Printer,
  Download,
  Check,
  X,
  ShieldCheck,
  Calendar,
  Package,
  FileText,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface PrintReportModalProps {
  result: CalculationResult;
  onClose: () => void;
  autoDownloadOnOpen?: boolean;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  result,
  onClose,
  autoDownloadOnOpen = false,
}) => {
  const { language, t } = useLanguage();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [blobDownloadUrl, setBlobDownloadUrl] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

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

  const pName = productName || t.unnamedProduct;
  const filename = generatePdfFilename(productName);

  const dateStr = result.timestamp
    ? new Date(result.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-IN');

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfError(null);
    setPdfSuccess(false);

    try {
      const res = await generateAndDownloadPdf({ result, language });
      if (res.success) {
        setPdfSuccess(true);
        if (res.blobUrl) {
          setBlobDownloadUrl(res.blobUrl);
        }
        setTimeout(() => setPdfSuccess(false), 4000);
      } else {
        setPdfError(res.error || t.pdfGenError || 'Could not generate PDF. Please try again.');
      }
    } catch {
      setPdfError(t.pdfGenError || 'Could not generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Trigger PDF generation on modal open if requested
  useEffect(() => {
    if (autoDownloadOnOpen) {
      handleDownloadPdf();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrint = () => {
    setIsPrinting(true);
    console.log('Print Debug: button clicked → print handler started → print preview/window opened → window.print() called');
    try {
      triggerDirectPrint({ result, language });
    } catch (err) {
      console.warn('triggerDirectPrint encountered an issue, falling back to window.print():', err);
      try {
        window.print();
      } catch (printErr) {
        console.error('All print strategies failed:', printErr);
      }
    } finally {
      setTimeout(() => setIsPrinting(false), 500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-modal-title"
      className="print-modal-backdrop fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="print-modal-container bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="print-modal-header bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="print-modal-title" className="text-base sm:text-lg font-black tracking-tight text-white">
                {t.previewReportTitle || 'PDF & Print Preview'}
              </h2>
              <p className="text-xs text-slate-400 font-medium truncate max-w-[240px] sm:max-w-md">
                {filename}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification Banner (if error or success) */}
        {pdfError && (
          <div className="print-modal-header bg-rose-50 border-b border-rose-200 px-5 py-3 flex items-center justify-between text-xs text-rose-800 font-bold shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{pdfError}</span>
            </div>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="text-rose-900 underline hover:no-underline font-extrabold cursor-pointer ml-2"
            >
              Retry
            </button>
          </div>
        )}

        {pdfSuccess && (
          <div className="print-modal-header bg-teal-50 border-b border-teal-200 px-5 py-3 flex items-center gap-2 text-xs text-teal-900 font-bold shrink-0">
            <Check className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{t.pdfDownloadedSuccess || '✓ PDF Downloaded'}: {filename}</span>
          </div>
        )}

        {/* Modal Printable Preview Container */}
        <div className="print-modal-content overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50">
          {/* Official Document Card */}
          <div className="printable-report-card bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
            {/* Header Document Brand */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-slate-900 gap-2">
              <div>
                <div className="text-xs font-black tracking-widest text-blue-600 uppercase">
                  NOMAN
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
                  Profit Calculator Pro
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {t.businessReportTitle || 'Business Profit Report'}
                </p>
              </div>
              <div className="text-left sm:text-right text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5 sm:justify-end">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{dateStr}</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  ID: #{result.id ? result.id.slice(-6).toUpperCase() : 'REPORT'}
                </span>
              </div>
            </div>

            {/* Product Overview Header */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 text-white shrink-0">
                  <Package className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {t.productNameLabel}
                  </span>
                  <div className="text-base sm:text-lg font-black text-slate-900">
                    {pName}
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {quantity.toLocaleString('en-IN')} {t.pcsLabel} @ {formatINR(sellingPrice)} / {t.perUnit}
                  </span>
                </div>
              </div>

              <div className="self-start sm:self-auto">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border uppercase tracking-wider ${
                    isProfit
                      ? 'bg-teal-50 text-teal-800 border-teal-200'
                      : isLoss
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {isProfit ? t.profitStatusTitle : isLoss ? t.lossStatusTitle : t.breakEvenStatusTitle}
                </span>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5">
                1. Financial Breakdown
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-2.5 sm:p-3">Particulars</th>
                      <th className="p-2.5 sm:p-3 text-right">Unit Price</th>
                      <th className="p-2.5 sm:p-3 text-right">Qty</th>
                      <th className="p-2.5 sm:p-3 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold">
                        {t.totalSalesLabel} ({t.sellingPriceLabel})
                      </td>
                      <td className="p-2.5 sm:p-3 text-right font-semibold">
                        {formatINR(sellingPrice)}
                      </td>
                      <td className="p-2.5 sm:p-3 text-right">
                        {quantity.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 sm:p-3 text-right font-black text-slate-900">
                        {formatINR(totalSales)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold">
                        {t.totalCostLabel} ({t.costPriceLabel})
                      </td>
                      <td className="p-2.5 sm:p-3 text-right font-semibold">
                        {formatINR(costPrice)}
                      </td>
                      <td className="p-2.5 sm:p-3 text-right">
                        {quantity.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 sm:p-3 text-right font-black text-slate-900">
                        {formatINR(totalCost)}
                      </td>
                    </tr>
                    <tr
                      className={
                        isProfit
                          ? 'bg-teal-50/70 text-teal-950 font-black'
                          : isLoss
                          ? 'bg-rose-50/70 text-rose-950 font-black'
                          : 'bg-slate-100 font-black'
                      }
                    >
                      <td className="p-3 sm:p-3.5 font-extrabold text-sm sm:text-base">
                        {isLoss ? t.netLossLabel : t.netProfitLabel}
                      </td>
                      <td className="p-3 sm:p-3.5 text-right font-bold">
                        {formatINR(profitPerPiece, true)}
                      </td>
                      <td className="p-3 sm:p-3.5 text-right">
                        {quantity.toLocaleString('en-IN')}
                      </td>
                      <td
                        className={`p-3 sm:p-3.5 text-right font-black text-base sm:text-lg ${
                          isProfit ? 'text-teal-700' : isLoss ? 'text-rose-700' : 'text-slate-900'
                        }`}
                      >
                        {formatINR(totalProfit, true)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Performance Indicators Grid */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5">
                2. Key Performance Indicators
              </h4>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {t.profitPerPieceLabel}
                  </span>
                  <span
                    className={`text-sm sm:text-base font-black block mt-1 ${
                      isProfit ? 'text-teal-700' : isLoss ? 'text-rose-700' : 'text-slate-900'
                    }`}
                  >
                    {formatINR(profitPerPiece, true)}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {t.roiLabel}
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-900 block mt-1">
                    {formatPercent(profitPercentage, true)}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {t.marginLabel}
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-900 block mt-1">
                    {formatPercent(profitMarginOnSales, true)}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Verification Footer */}
            <div className="pt-3 border-t border-slate-200 flex flex-col xs:flex-row items-center justify-between gap-1.5 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1 text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Verified Calculation
              </span>
              <div className="text-[11px] font-semibold text-slate-800 tracking-wide">
                Powered by NOMAN
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="print-modal-footer bg-white border-t border-slate-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Print Dialog Button */}
            <button
              type="button"
              id="btn-modal-print-dialog"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer min-h-[44px]"
              title={t.openPrintDialogBtn || 'Print'}
            >
              <Printer className="w-4 h-4 mr-1.5 text-slate-600" />
              <span>{isPrinting ? (t.printingStatus || 'Printing...') : (t.openPrintDialogBtn || 'Print')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer min-h-[44px]"
            >
              {t.cancelEditBtn || 'Close'}
            </button>

            {/* Primary Action: Download PDF / Save PDF */}
            <button
              id="btn-modal-download-pdf"
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md transition-all cursor-pointer min-h-[44px] active:scale-95 disabled:opacity-75"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  <span>{t.generatingPdf || 'Generating PDF...'}</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-white" />
                  <span>{t.pdfDownloadedSuccess || '✓ PDF Downloaded'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-1.5" />
                  <span>{t.downloadPdfBtn || 'Download PDF'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
