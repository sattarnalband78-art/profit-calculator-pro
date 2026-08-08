import React, { useState, useEffect, useMemo } from 'react';
import { CalculationInput, CalculationResult, ValidationErrors } from './types';
import { calculateProfitMetrics } from './utils/formatters';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsGrid } from './components/ResultsGrid';
import { TargetPriceCalculator } from './components/TargetPriceCalculator';
import { HistoryList } from './components/HistoryList';
import { HelpCircle, Calculator, ShieldCheck, Sparkles } from 'lucide-react';

const INITIAL_INPUT: CalculationInput = {
  productName: 'Handcrafted Leather Wallet',
  costPrice: 250,
  sellingPrice: 599,
  quantity: 40,
};

export default function App() {
  const [input, setInput] = useState<CalculationInput>(INITIAL_INPUT);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [history, setHistory] = useState<CalculationResult[]>(() => {
    try {
      const saved = localStorage.getItem('profit_calculator_history');
      if (saved) {
        return JSON.parse(saved);
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
      newErrors.productName = 'Product name is required';
    }

    if (currentInput.costPrice === '' || isNaN(Number(currentInput.costPrice))) {
      newErrors.costPrice = 'Cost price is required';
    } else if (Number(currentInput.costPrice) < 0) {
      newErrors.costPrice = 'Cost price cannot be negative';
    }

    if (currentInput.sellingPrice === '' || isNaN(Number(currentInput.sellingPrice))) {
      newErrors.sellingPrice = 'Selling price is required';
    } else if (Number(currentInput.sellingPrice) < 0) {
      newErrors.sellingPrice = 'Selling price cannot be negative';
    }

    if (currentInput.quantity === '' || isNaN(Number(currentInput.quantity))) {
      newErrors.quantity = 'Quantity sold is required';
    } else if (Number(currentInput.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    return newErrors;
  };

  // Automatic Calculation Result Computation
  const currentResult = useMemo<CalculationResult | null>(() => {
    const costNum = Number(input.costPrice);
    const sellingNum = Number(input.sellingPrice);
    const qtyNum = Number(input.quantity);

    if (
      input.costPrice === '' ||
      input.sellingPrice === '' ||
      input.quantity === '' ||
      isNaN(costNum) ||
      isNaN(sellingNum) ||
      isNaN(qtyNum) ||
      costNum < 0 ||
      sellingNum < 0 ||
      qtyNum <= 0
    ) {
      return null;
    }

    const metrics = calculateProfitMetrics(costNum, sellingNum, qtyNum);

    return {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date(),
      productName: input.productName || 'Unnamed Product',
      costPrice: costNum,
      sellingPrice: sellingNum,
      quantity: qtyNum,
      ...metrics,
    };
  }, [input]);

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

  // Handle Manual Calculate Button
  const handleCalculate = () => {
    const validationErrors = validate(input);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && currentResult) {
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
  };

  // Select Preset
  const handleSelectPreset = (name: string, cost: number, selling: number, qty: number) => {
    setInput({
      productName: name,
      costPrice: cost,
      sellingPrice: selling,
      quantity: qty,
    });
    setErrors({});
  };

  // Load Sample Data
  const handleLoadSample = () => {
    setInput({
      productName: 'Organic Green Tea (100g)',
      costPrice: 120,
      sellingPrice: 299,
      quantity: 150,
    });
    setErrors({});
  };

  // Save current result to history
  const handleSaveResult = () => {
    if (!currentResult) return;
    // Check if already in history by same parameters
    const exists = history.some(
      (h) =>
        h.productName === currentResult.productName &&
        h.costPrice === currentResult.costPrice &&
        h.sellingPrice === currentResult.sellingPrice &&
        h.quantity === currentResult.quantity
    );

    if (!exists) {
      setHistory([currentResult, ...history]);
    }
  };

  const isCurrentResultSaved = useMemo(() => {
    if (!currentResult) return false;
    return history.some(
      (h) =>
        h.productName === currentResult.productName &&
        h.costPrice === currentResult.costPrice &&
        h.sellingPrice === currentResult.sellingPrice &&
        h.quantity === currentResult.quantity
    );
  }, [currentResult, history]);

  // Load item from history back into form
  const handleLoadFromHistory = (item: CalculationResult) => {
    setInput({
      productName: item.productName,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      quantity: item.quantity,
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(history.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleApplyTargetPrice = (suggestedPrice: number) => {
    setInput((prev) => ({ ...prev, sellingPrice: suggestedPrice }));
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* App Header */}
      <Header
        onLoadSample={handleLoadSample}
        onResetAll={handleReset}
        hasHistory={history.length > 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Form (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <InputForm
              input={input}
              errors={errors}
              onChange={handleInputChange}
              onCalculate={handleCalculate}
              onReset={handleReset}
              onSelectPreset={handleSelectPreset}
            />

            {/* Target Price Calculator Tool */}
            <TargetPriceCalculator onApplySellingPrice={handleApplyTargetPrice} />
          </div>

          {/* Right Column: Calculation Results (7 cols on desktop) */}
          <div id="results-section" className="lg:col-span-7 space-y-6">
            <ResultsGrid
              result={currentResult}
              onSaveResult={handleSaveResult}
              isSaved={isCurrentResultSaved}
            />

            {/* Saved History List */}
            <HistoryList
              history={history}
              onLoadResult={handleLoadFromHistory}
              onDeleteResult={handleDeleteHistoryItem}
              onClearHistory={handleClearHistory}
            />
          </div>
        </div>

        {/* Feature Cards / Info Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/80">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Instant Calculations</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Automatically calculates total cost, total sales revenue, net profit/loss & margin percentage.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Indian Rupee Formatting</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Formatted in standard Lakh & Crore Indian numbering system (₹) with precise decimal accuracy.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Offline & Fast</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Runs entirely in browser without login, saving history securely in local memory.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 px-4 sm:px-8 py-3.5 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 uppercase tracking-widest font-bold">
          <span>Profit Calculator Pro • Financial Analytics Engine</span>
          <span>Designed for Small Businesses & Retail (₹ INR)</span>
        </div>
      </footer>
    </div>
  );
}
