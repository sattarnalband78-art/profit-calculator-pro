import React, { useState, useEffect, useMemo } from 'react';
import { CalculationInput, CalculationResult, ValidationErrors } from './types';
import { calculateProfitMetrics } from './utils/formatters';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsGrid } from './components/ResultsGrid';
import { SmartBusinessInsights } from './components/SmartBusinessInsights';
import { AiProfitAdvisor } from './components/AiProfitAdvisor';
import { MoreBusinessTools } from './components/MoreBusinessTools';
import { HistoryList } from './components/HistoryList';
import { Calculator, ShieldCheck, Sparkles } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const INITIAL_INPUT: CalculationInput = {
  productName: 'Gulab Jamun',
  costPrice: 10,
  sellingPrice: 20,
  quantity: 100,
};

function CalculatorApp() {
  const { t } = useLanguage();
  const [input, setInput] = useState<CalculationInput>(INITIAL_INPUT);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const [history, setHistory] = useState<CalculationResult[]>(() => {
    try {
      const saved = localStorage.getItem('profit_calculator_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any, index: number) => {
            const costPrice = Number(item.costPrice) || 0;
            const sellingPrice = Number(item.sellingPrice) || 0;
            const quantity = Number(item.quantity) || 1;
            const metrics = calculateProfitMetrics(costPrice, sellingPrice, quantity);
            return {
              id: item.id || `prod-${Date.now()}-${index}`,
              timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
              productName:
                typeof item.productName === 'string' && item.productName.trim() !== ''
                  ? item.productName.trim()
                  : 'Unnamed Product',
              costPrice,
              sellingPrice,
              quantity,
              ...metrics,
            };
          });
        }
      }
    } catch {
      // Ignore fallback
    }
    return [];
  });

  // Save history to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('profit_calculator_history', JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  // Validation Routine
  const validate = (currentInput: CalculationInput): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!currentInput.productName || currentInput.productName.trim() === '') {
      newErrors.productName = t.errProductNameReq;
    }

    if (currentInput.costPrice === '' || isNaN(Number(currentInput.costPrice))) {
      newErrors.costPrice = t.errCostPriceReq;
    } else if (Number(currentInput.costPrice) < 0) {
      newErrors.costPrice = t.errCostPriceNeg;
    }

    if (currentInput.sellingPrice === '' || isNaN(Number(currentInput.sellingPrice))) {
      newErrors.sellingPrice = t.errSellingPriceReq;
    } else if (Number(currentInput.sellingPrice) < 0) {
      newErrors.sellingPrice = t.errSellingPriceNeg;
    }

    if (currentInput.quantity === '' || isNaN(Number(currentInput.quantity))) {
      newErrors.quantity = t.errQuantityReq;
    } else if (Number(currentInput.quantity) <= 0) {
      newErrors.quantity = t.errQuantityMin;
    }

    return newErrors;
  };

  const [lastValidResult, setLastValidResult] = useState<CalculationResult | null>(null);

  // Automatic Calculation Result Computation
  useEffect(() => {
    const costNum = Number(input.costPrice);
    const sellingNum = Number(input.sellingPrice);
    const qtyNum = Number(input.quantity);

    const allEmpty =
      input.productName === '' &&
      input.costPrice === '' &&
      input.sellingPrice === '' &&
      input.quantity === '';

    if (allEmpty) {
      setLastValidResult(null);
      return;
    }

    if (
      input.costPrice !== '' &&
      input.sellingPrice !== '' &&
      input.quantity !== '' &&
      !isNaN(costNum) &&
      !isNaN(sellingNum) &&
      !isNaN(qtyNum) &&
      costNum >= 0 &&
      sellingNum >= 0 &&
      qtyNum > 0
    ) {
      const metrics = calculateProfitMetrics(costNum, sellingNum, qtyNum);
      setLastValidResult({
        id: editingId || `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date(),
        productName: input.productName || t.unnamedProduct,
        costPrice: costNum,
        sellingPrice: sellingNum,
        quantity: qtyNum,
        ...metrics,
      });
    }
  }, [input, editingId]);

  // Handle Input Changes
  const handleInputChange = (field: keyof CalculationInput, value: string | number) => {
    const updated = { ...input, [field]: value };
    setInput(updated);

    // Clear field-specific error if now valid
    if (errors[field]) {
      const newErr = { ...errors };
      delete newErr[field];
      setErrors(newErr);
    }
  };

  // Handle Manual Calculate Button or Update Action
  const handleCalculate = () => {
    const validationErrors = validate(input);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && lastValidResult) {
      // If editing an existing item in history, update it in history directly
      if (editingId) {
        setHistory((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...lastValidResult,
                  id: editingId,
                  timestamp: new Date(),
                }
              : item
          )
        );
        setEditingId(null);
      }

      // Scroll smoothly to results card on mobile screens
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Handle Reset Button
  const handleReset = () => {
    setInput({
      productName: '',
      costPrice: '',
      sellingPrice: '',
      quantity: '',
    });
    setErrors({});
    setEditingId(null);
    setLastValidResult(null);
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Load Sample Data
  const handleLoadSample = () => {
    setInput({
      productName: 'Gulab Jamun',
      costPrice: 10,
      sellingPrice: 20,
      quantity: 100,
    });
    setErrors({});
    setEditingId(null);
  };

  // Apply suggested selling price from TargetPriceCalculator or SmartPricingSimulator
  const handleApplySellingPrice = (suggestedPrice: number) => {
    setInput((prev) => ({ ...prev, sellingPrice: suggestedPrice }));
  };

  // Apply target quantity from TargetProfitCalculator
  const handleApplyQuantity = (requiredQty: number) => {
    setInput((prev) => ({ ...prev, quantity: requiredQty }));
  };

  // Apply simulated scenario from WhatIfSimulator
  const handleApplyScenario = (cost: number, sell: number, qty: number) => {
    setInput((prev) => ({
      ...prev,
      costPrice: cost,
      sellingPrice: sell,
      quantity: qty,
    }));
  };

  // Save current result to history
  const handleSaveResult = () => {
    if (!lastValidResult) return;

    if (editingId) {
      setHistory((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...lastValidResult, id: editingId, timestamp: new Date() }
            : item
        )
      );
      setEditingId(null);
      return;
    }

    const isDuplicate = history.some(
      (h) =>
        h.productName.trim().toLowerCase() === lastValidResult.productName.trim().toLowerCase() &&
        Number(h.costPrice) === Number(lastValidResult.costPrice) &&
        Number(h.sellingPrice) === Number(lastValidResult.sellingPrice) &&
        Number(h.quantity) === Number(lastValidResult.quantity)
    );

    if (!isDuplicate) {
      const newSavedProduct: CalculationResult = {
        ...lastValidResult,
        id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date(),
      };
      setHistory((prev) => [newSavedProduct, ...prev]);
    }
  };

  const isCurrentResultSaved = useMemo(() => {
    if (!lastValidResult) return false;
    return history.some(
      (h) =>
        (editingId && h.id === editingId) ||
        (h.productName.trim().toLowerCase() === lastValidResult.productName.trim().toLowerCase() &&
          Number(h.costPrice) === Number(lastValidResult.costPrice) &&
          Number(h.sellingPrice) === Number(lastValidResult.sellingPrice) &&
          Number(h.quantity) === Number(lastValidResult.quantity))
    );
  }, [lastValidResult, history, editingId]);

  // Load item from history into form (Fill Calculator)
  const handleLoadFromHistory = (item: CalculationResult) => {
    setInput({
      productName: item.productName,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      quantity: item.quantity,
    });
    setErrors({});
    setEditingId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Edit item from history (Sets editing mode)
  const handleEditFromHistory = (item: CalculationResult) => {
    setInput({
      productName: item.productName,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      quantity: item.quantity,
    });
    setErrors({});
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* App Header */}
      <Header
        onLoadSample={handleLoadSample}
        onResetAll={handleReset}
        hasHistory={history.length > 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 1. SIMPLE HOME SCREEN (Focused 4 inputs + prominent Calculate Profit button) */}
        <section aria-label="Main Profit Calculator Form" className="no-print">
          <InputForm
            input={input}
            errors={errors}
            onChange={handleInputChange}
            onCalculate={handleCalculate}
            onReset={handleReset}
            isEditing={!!editingId}
            onCancelEdit={handleCancelEdit}
          />
        </section>

        {/* 2. PREMIUM PROFIT RESULT DISPLAY */}
        <section id="results-section" aria-label="Profit Calculation Results">
          <ResultsGrid
            result={lastValidResult}
            onSaveResult={handleSaveResult}
            isSaved={isCurrentResultSaved}
          />
        </section>

        {/* 3. SMART BUSINESS INSIGHTS (Target Profit, Best Price, What-If, Profit Boosters) */}
        {lastValidResult && (
          <section aria-label="Smart Business Insights">
            <SmartBusinessInsights
              result={lastValidResult}
              input={input}
              onApplySellingPrice={handleApplySellingPrice}
              onApplyQuantity={handleApplyQuantity}
              onApplyScenario={handleApplyScenario}
            />
          </section>
        )}

        {/* 4. AI BUSINESS ADVISOR (💡 My Business Advice) */}
        {lastValidResult && (
          <section aria-label="My Business Advice" className="no-print">
            <AiProfitAdvisor result={lastValidResult} />
          </section>
        )}

        {/* 5. MORE BUSINESS TOOLS (Consolidated Deep-Dive Calculators) */}
        <section aria-label="More Business Tools">
          <MoreBusinessTools
            input={input}
            onApplySellingPrice={handleApplySellingPrice}
            onApplyQuantity={handleApplyQuantity}
            onApplyScenario={handleApplyScenario}
          />
        </section>

        {/* 6. MY PRODUCTS / CATALOG */}
        <section aria-label="Saved Products Catalog" className="no-print">
          <HistoryList
            history={history}
            onLoadResult={handleLoadFromHistory}
            onEditResult={handleEditFromHistory}
            onDeleteResult={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
            editingId={editingId}
          />
        </section>

        {/* Feature Highlights Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-slate-200/80 no-print">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 shrink-0 border border-blue-100">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.instantCalcTitle}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {t.instantCalcDesc}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 shrink-0 border border-blue-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.inrFormatTitle}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {t.inrFormatDesc}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 shrink-0 border border-blue-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.offlineFastTitle}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {t.offlineFastDesc}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* App Footer */}
      <footer className="bg-white border-t border-slate-200 px-4 sm:px-8 py-5 mt-8 no-print">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-1 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-normal">Powered by</span>
            <span className="text-xs font-bold tracking-wider text-slate-900 uppercase">NOMAN</span>
          </div>
          <p className="text-[11px] text-slate-400 font-normal">{t.footerDesigned}</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CalculatorApp />
    </LanguageProvider>
  );
}
