import React from 'react';
import { Wind, ShieldCheck, Key, Wrench, AlertTriangle, Sparkles } from 'lucide-react';
import { getActiveApiKey } from '../services/geminiService';
import { CityData } from '../types/aqi';

interface HeaderProps {
  currentCity: CityData;
  onOpenApiKeyModal: () => void;
  onOpenDIYGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentCity, onOpenApiKeyModal, onOpenDIYGuide }) => {
  const hasLiveKey = Boolean(getActiveApiKey());
  const isSevere = currentCity.aqi > 300;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Dynamic Emergency Smog Alert Ticker */}
      {isSevere && (
        <div 
          className="bg-red-800 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between shadow-inner"
          role="alert"
          aria-live="polite"
        >
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-center sm:text-left">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" aria-hidden="true" />
            <span>
              <strong>Severe Winter Inversion Advisory:</strong> Ground-level smog in {currentCity.name} is at {currentCity.aqi} AQI. Vulnerable family members must avoid outdoor exertion.
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Wind className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Vayu<span className="text-emerald-700">Mitra</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  GenAI Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Urban Air Quality & Anti-Smog Shield for Families & Communities
              </p>
            </div>
          </div>

          {/* Action buttons & Model Status */}
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main Navigation">
            {/* Status indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs">
              {hasLiveKey ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                  <span className="text-slate-800 font-medium">Gemini 1.5 Flash (Live)</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span className="text-slate-700 font-medium">Offline Intelligence Mode</span>
                </>
              )}
            </div>

            {/* DIY Filter Guide Button */}
            <button
              onClick={onOpenDIYGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors focus:ring-2 focus:ring-amber-500"
              aria-label="Open DIY Air Filter Guide"
            >
              <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">DIY Air Filter</span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors focus:ring-2 focus:ring-emerald-600"
              aria-label="Configure Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
              <span className="hidden sm:inline">{hasLiveKey ? 'API Key Active' : 'AI Config'}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
