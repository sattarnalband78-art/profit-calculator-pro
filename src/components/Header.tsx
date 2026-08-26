import React from 'react';
import { Calculator, Sparkles, RefreshCw, Globe, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AppLanguage } from '../utils/translations';

interface HeaderProps {
  onLoadSample: () => void;
  onResetAll: () => void;
  hasHistory: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onLoadSample, onResetAll }) => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { id: AppLanguage; label: string; flag: string }[] = [
    { id: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'mr', label: 'मराठी', flag: '🇮🇳' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-md no-print text-white">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-br from-blue-500 via-amber-400 to-indigo-600 shadow-lg shadow-slate-950/50 flex items-center justify-center shrink-0">
            <img
              src="/noman-logo.svg"
              alt="NOMAN Logo"
              className="w-10 h-10 rounded-[14px] object-cover bg-slate-950 shadow-inner"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 flex-wrap">
                <span className="text-blue-400 font-extrabold tracking-wide">NOMAN</span>
                <span className="text-slate-500 font-normal select-none">•</span>
                <span className="text-white">{t.appTitle}</span>
                <span className="text-blue-400 font-extrabold bg-blue-950/90 px-2 py-0.5 rounded-md border border-blue-500/40 text-xs uppercase tracking-wider">
                  {t.appTitlePro}
                </span>
              </h1>
              <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-400" /> {t.currencyBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block font-medium mt-0.5">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* Language Switcher - Clean Segmented Control */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
            <Globe className="w-4 h-4 text-slate-400 ml-1.5 mr-1 shrink-0" />
            <div className="flex items-center gap-1">
              {languages.map((lang) => {
                const isActive = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    id={`btn-lang-${lang.id}`}
                    type="button"
                    onClick={() => setLanguage(lang.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs font-black'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                    }`}
                    title={`Switch language to ${lang.label}`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Load Sample Data CTA */}
          <button
            id="btn-sample-data"
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-xl transition-all cursor-pointer active:scale-95 whitespace-nowrap min-h-[38px]"
            title={t.sampleDataBtn}
          >
            <Sparkles className="w-4 h-4 mr-1.5 text-blue-400 shrink-0" />
            <span className="hidden xs:inline">{t.sampleDataBtn}</span>
            <span className="xs:hidden">Sample</span>
          </button>

          {/* Reset All Form Button */}
          <button
            id="btn-clear-all"
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-semibold text-slate-400 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/80 rounded-xl transition-all cursor-pointer active:scale-95 whitespace-nowrap min-h-[38px]"
            title={t.clearBtn}
          >
            <RefreshCw className="w-4 h-4 sm:mr-1.5 text-slate-400 shrink-0" />
            <span className="hidden sm:inline">{t.clearBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
