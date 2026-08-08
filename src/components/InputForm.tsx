import React from 'react';
import { CalculationInput, ValidationErrors } from '../types';
import { Package, IndianRupee, Tag, Layers, RotateCcw, Calculator, AlertCircle } from 'lucide-react';

interface InputFormProps {
  input: CalculationInput;
  errors: ValidationErrors;
  onChange: (field: keyof CalculationInput, value: string | number) => void;
  onCalculate: () => void;
  onReset: () => void;
  onSelectPreset: (presetName: string, cost: number, selling: number, qty: number) => void;
}

const PRESETS = [
  { name: 'Cotton T-Shirt', cost: 180, selling: 450, qty: 50 },
  { name: 'Wireless Earbuds', cost: 650, selling: 1299, qty: 25 },
  { name: 'Artisan Coffee Box', cost: 320, selling: 590, qty: 100 },
  { name: 'Handmade Wallet', cost: 400, selling: 850, qty: 30 },
];

export const InputForm: React.FC<InputFormProps> = ({
  input,
  errors,
  onChange,
  onCalculate,
  onReset,
  onSelectPreset,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Product Details
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter piece cost, selling price and quantity sold
          </p>
        </div>

        {/* Quick Presets */}
        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1">Quick Demo:</span>
          {PRESETS.slice(0, 2).map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => onSelectPreset(p.name, p.cost, p.selling, p.qty)}
              className="text-[11px] font-medium px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors cursor-pointer"
            >
              + {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Pills for Mobile */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <span className="text-xs text-slate-400 font-medium shrink-0">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => onSelectPreset(p.name, p.cost, p.selling, p.qty)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            {p.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Product Name */}
        <div>
          <label htmlFor="productName" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
            Product Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Package className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="productName"
              placeholder="e.g. Wireless Headphones"
              value={input.productName}
              onChange={(e) => onChange('productName', e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all text-sm ${
                errors.productName
                  ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:ring-rose-500'
                  : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900'
              }`}
            />
          </div>
          {errors.productName && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.productName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 2. Cost Price per Piece */}
          <div>
            <label htmlFor="costPrice" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Cost (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4 text-rose-500" />
              </div>
              <input
                type="number"
                id="costPrice"
                min="0"
                step="any"
                placeholder="0.00"
                value={input.costPrice}
                onChange={(e) => onChange('costPrice', e.target.value === '' ? '' : parseFloat(e.target.value))}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all text-sm font-semibold ${
                  errors.costPrice
                    ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900'
                }`}
              />
            </div>
            {errors.costPrice ? (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.costPrice}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">Cost price per piece</p>
            )}
          </div>

          {/* 3. Selling Price per Piece */}
          <div>
            <label htmlFor="sellingPrice" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Selling (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4 text-emerald-600" />
              </div>
              <input
                type="number"
                id="sellingPrice"
                min="0"
                step="any"
                placeholder="0.00"
                value={input.sellingPrice}
                onChange={(e) => onChange('sellingPrice', e.target.value === '' ? '' : parseFloat(e.target.value))}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all text-sm font-semibold ${
                  errors.sellingPrice
                    ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900'
                }`}
              />
            </div>
            {errors.sellingPrice ? (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.sellingPrice}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">Selling price per piece</p>
            )}
          </div>
        </div>

        {/* 4. Quantity Sold */}
        <div>
          <label htmlFor="quantity" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
            Quantity Sold
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Layers className="w-4 h-4 text-slate-500" />
            </div>
            <input
              type="number"
              id="quantity"
              min="1"
              step="1"
              placeholder="0"
              value={input.quantity}
              onChange={(e) => onChange('quantity', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all text-sm font-semibold ${
                errors.quantity
                  ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:ring-rose-500'
                  : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900'
              }`}
            />
          </div>
          {errors.quantity ? (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.quantity}
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-slate-400">Total units sold</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition-colors inline-flex items-center justify-center text-sm cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4 mr-1.5 text-slate-500" />
            Reset
          </button>

          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-200 transition-colors inline-flex items-center justify-center text-sm cursor-pointer active:scale-95"
          >
            <Calculator className="w-4 h-4 mr-1.5" />
            Calculate
          </button>
        </div>
      </form>
    </div>
  );
};
