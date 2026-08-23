import React, { useState, useRef, useEffect } from 'react';
import { CalculationInput, ValidationErrors } from '../types';
import {
  Package,
  IndianRupee,
  Tag,
  Layers,
  RotateCcw,
  Calculator,
  AlertCircle,
  Mic,
  MicOff,
  Radio,
  FileText,
  Edit3,
  X,
} from 'lucide-react';
import { parseSpokenNumber } from '../utils/voiceParser';
import { useLanguage } from '../context/LanguageContext';

interface InputFormProps {
  input: CalculationInput;
  errors: ValidationErrors;
  onChange: (field: keyof CalculationInput, value: string | number) => void;
  onCalculate: () => void;
  onReset: () => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

type VoiceLanguage = 'en-IN' | 'hi-IN' | 'mr-IN';

export const InputForm: React.FC<InputFormProps> = ({
  input,
  errors,
  onChange,
  onCalculate,
  onReset,
  isEditing = false,
  onCancelEdit,
}) => {
  const { language, t } = useLanguage();
  const [voiceLang, setVoiceLang] = useState<VoiceLanguage>(() => {
    if (language === 'en') return 'en-IN';
    if (language === 'mr') return 'mr-IN';
    return 'hi-IN';
  });

  // Sync default voice language when global language changes
  useEffect(() => {
    if (language === 'en') setVoiceLang('en-IN');
    else if (language === 'mr') setVoiceLang('mr-IN');
    else setVoiceLang('hi-IN');
  }, [language]);

  const [listeningField, setListeningField] = useState<keyof CalculationInput | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const startListening = (field: keyof CalculationInput) => {
    if (listeningField === field) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
      setListeningField(null);
      setVoiceTranscript('');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t.voiceUnsupported);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = voiceLang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListeningField(field);
        setVoiceTranscript(t.voiceListeningPrompt);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');

        setVoiceTranscript(transcript);

        if (event.results[0].isFinal) {
          if (field === 'productName') {
            const cleanText = transcript.trim();
            if (cleanText) {
              onChange('productName', cleanText.charAt(0).toUpperCase() + cleanText.slice(1));
            }
          } else {
            const parsedNum = parseSpokenNumber(transcript);
            if (parsedNum !== null && !isNaN(parsedNum)) {
              if (field === 'quantity') {
                onChange('quantity', Math.max(1, Math.round(parsedNum)));
              } else {
                onChange(field, parsedNum);
              }
            }
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setListeningField(null);
        setVoiceTranscript('');
      };

      recognition.onend = () => {
        setListeningField(null);
        setTimeout(() => setVoiceTranscript(''), 2000);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setListeningField(null);
      setVoiceTranscript('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-slate-200/90 space-y-5">
      {/* Editing State Banner if in Edit Mode */}
      {isEditing && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-2 text-xs sm:text-sm text-amber-900">
          <div className="flex items-center gap-2 min-w-0">
            <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-bold shrink-0">{t.editingProductBanner}</span>
            <span className="font-black truncate text-amber-950">
              {input.productName || t.unnamedProduct}
            </span>
          </div>
          {onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-200/70 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
              title={t.cancelEditBtn}
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.cancelEditBtn}</span>
            </button>
          )}
        </div>
      )}

      {/* Header with Title and Voice Dialect Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-900 text-white shrink-0 shadow-2xs">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {t.productDetailsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.productDetailsSubtitle}
            </p>
          </div>
        </div>

        {/* Voice Language Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/80">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1.5 pr-1">
            {t.voiceLabel}
          </span>
          {(
            [
              { id: 'hi-IN', label: 'हिन्दी' },
              { id: 'en-IN', label: 'EN' },
              { id: 'mr-IN', label: 'मराठी' },
            ] as const
          ).map((lang) => {
            const isSelected = voiceLang === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => setVoiceLang(lang.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title={`Voice recognition in ${lang.label}`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Status Alert if Active */}
      {listeningField && (
        <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-xl flex items-center justify-between gap-2 text-xs sm:text-sm text-rose-800 animate-pulse">
          <div className="flex items-center gap-2 min-w-0">
            <Radio className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-bold shrink-0">{t.voiceListening}</span>
            <span className="italic text-rose-700 truncate">
              "{voiceTranscript}"
            </span>
          </div>
          <button
            type="button"
            onClick={() => startListening(listeningField)}
            className="text-xs font-extrabold text-rose-900 bg-rose-200/60 hover:bg-rose-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0"
          >
            {t.voiceStopBtn}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4.5">
        {/* 1. Product Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="productName"
              className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide uppercase"
            >
              {t.productNameLabel}
            </label>
            <span className="text-xs font-semibold text-slate-400">
              {t.skuHelper}
            </span>
          </div>

          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Package className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="productName"
              placeholder={t.productNamePlaceholder}
              value={input.productName}
              onChange={(e) => onChange('productName', e.target.value)}
              className={`w-full pl-10 pr-12 py-3 text-sm sm:text-base font-bold bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.productName
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:ring-rose-400'
                  : 'border-slate-200/90 focus:border-blue-600 focus:ring-blue-600/15 text-slate-900'
              }`}
            />
            {/* Mic Button */}
            <button
              id="mic-productName"
              type="button"
              onClick={() => startListening('productName')}
              className={`absolute right-1.5 p-2 rounded-lg transition-all cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center ${
                listeningField === 'productName'
                  ? 'bg-rose-500 text-white shadow-md animate-pulse'
                  : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title={`${t.voiceLabel} ${t.productNameLabel}`}
              aria-label="Voice input product name"
            >
              {listeningField === 'productName' ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.productName && (
            <p className="mt-1.5 text-xs sm:text-sm text-rose-600 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.productName}
            </p>
          )}
        </div>

        {/* 2 & 3: Cost Price and Selling Price Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 2. Cost Price per Piece */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="costPrice"
                className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide uppercase"
              >
                {t.costPriceLabel}
              </label>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">
                {t.unitBadgeCost}
              </span>
            </div>

            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                type="number"
                id="costPrice"
                min="0"
                step="any"
                placeholder={t.costPricePlaceholder}
                value={input.costPrice}
                onChange={(e) =>
                  onChange(
                    'costPrice',
                    e.target.value === '' ? '' : parseFloat(e.target.value)
                  )
                }
                className={`w-full pl-10 pr-12 py-3 text-sm sm:text-base font-bold bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.costPrice
                    ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:ring-rose-400'
                    : 'border-slate-200/90 focus:border-blue-600 focus:ring-blue-600/15 text-slate-900'
                }`}
              />
              {/* Mic Button */}
              <button
                id="mic-costPrice"
                type="button"
                onClick={() => startListening('costPrice')}
                className={`absolute right-1.5 p-2 rounded-lg transition-all cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center ${
                  listeningField === 'costPrice'
                    ? 'bg-rose-500 text-white shadow-md animate-pulse'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title={`${t.voiceLabel} ${t.costPriceLabel}`}
                aria-label="Voice input cost price"
              >
                {listeningField === 'costPrice' ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.costPrice ? (
              <p className="mt-1.5 text-xs sm:text-sm text-rose-600 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errors.costPrice}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-400 font-medium">
                {t.costPriceHint}
              </p>
            )}
          </div>

          {/* 3. Selling Price per Piece */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="sellingPrice"
                className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide uppercase"
              >
                {t.sellingPriceLabel}
              </label>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-md">
                {t.unitBadgeSelling}
              </span>
            </div>

            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="number"
                id="sellingPrice"
                min="0"
                step="any"
                placeholder={t.sellingPricePlaceholder}
                value={input.sellingPrice}
                onChange={(e) =>
                  onChange(
                    'sellingPrice',
                    e.target.value === '' ? '' : parseFloat(e.target.value)
                  )
                }
                className={`w-full pl-10 pr-12 py-3 text-sm sm:text-base font-bold bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.sellingPrice
                    ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:ring-rose-400'
                    : 'border-slate-200/90 focus:border-blue-600 focus:ring-blue-600/15 text-slate-900'
                }`}
              />
              {/* Mic Button */}
              <button
                id="mic-sellingPrice"
                type="button"
                onClick={() => startListening('sellingPrice')}
                className={`absolute right-1.5 p-2 rounded-lg transition-all cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center ${
                  listeningField === 'sellingPrice'
                    ? 'bg-rose-500 text-white shadow-md animate-pulse'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title={`${t.voiceLabel} ${t.sellingPriceLabel}`}
                aria-label="Voice input selling price"
              >
                {listeningField === 'sellingPrice' ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.sellingPrice ? (
              <p className="mt-1.5 text-xs sm:text-sm text-rose-600 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errors.sellingPrice}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-400 font-medium">
                {t.sellingPriceHint}
              </p>
            )}
          </div>
        </div>

        {/* 4. Quantity Sold / Manufactured */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="quantity"
              className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide uppercase"
            >
              {t.quantityLabel}
            </label>
            <span className="text-xs font-semibold text-slate-400">
              {t.qtyHelper}
            </span>
          </div>

          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Layers className="w-4 h-4" />
            </div>
            <input
              type="number"
              id="quantity"
              min="1"
              step="1"
              placeholder={t.quantityPlaceholder}
              value={input.quantity}
              onChange={(e) =>
                onChange(
                  'quantity',
                  e.target.value === '' ? '' : parseInt(e.target.value, 10)
                )
              }
              className={`w-full pl-10 pr-12 py-3 text-sm sm:text-base font-bold bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.quantity
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:ring-rose-400'
                  : 'border-slate-200/90 focus:border-blue-600 focus:ring-blue-600/15 text-slate-900'
              }`}
            />
            {/* Mic Button */}
            <button
              id="mic-quantity"
              type="button"
              onClick={() => startListening('quantity')}
              className={`absolute right-1.5 p-2 rounded-lg transition-all cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center ${
                listeningField === 'quantity'
                  ? 'bg-rose-500 text-white shadow-md animate-pulse'
                  : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title={`${t.voiceLabel} ${t.quantityLabel}`}
              aria-label="Voice input quantity"
            >
              {listeningField === 'quantity' ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.quantity ? (
            <p className="mt-1.5 text-xs sm:text-sm text-rose-600 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.quantity}
            </p>
          ) : (
            <p className="mt-1 text-xs text-slate-400 font-medium">
              {t.quantityHint}
            </p>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {/* Secondary Reset Button */}
          <button
            id="btn-reset-form"
            type="button"
            onClick={onReset}
            className="sm:w-1/3 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold rounded-xl border border-slate-200/80 transition-all inline-flex items-center justify-center text-xs sm:text-sm cursor-pointer active:scale-95 min-h-[48px]"
          >
            <RotateCcw className="w-4 h-4 mr-1.5 text-slate-500" />
            {t.resetBtn}
          </button>

          {/* Primary Calculate / Update CTA Button */}
          <button
            id="btn-calculate"
            type="submit"
            className="sm:flex-1 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-black rounded-xl shadow-md shadow-slate-900/10 border border-slate-800 transition-all inline-flex items-center justify-center text-sm sm:text-base cursor-pointer active:scale-95 min-h-[48px]"
          >
            {isEditing ? (
              <>
                <Edit3 className="w-5 h-5 mr-2 text-blue-400" />
                {t.updateProductBtn}
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5 mr-2 text-blue-400" />
                {t.calculateBtn}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
