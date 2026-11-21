import React, { useState, useEffect } from 'react';
import { getActiveApiKey, saveActiveApiKey } from '../services/geminiService';
import { Key, X, Check, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [currentKeySet, setCurrentKeySet] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const active = getActiveApiKey();
      setApiKeyInput(active);
      setCurrentKeySet(Boolean(active && active.length > 5));
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveActiveApiKey(apiKeyInput);
    setCurrentKeySet(Boolean(apiKeyInput.trim().length > 5));
    setSavedSuccess(true);
    onKeyUpdated();
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleClear = () => {
    saveActiveApiKey('');
    setApiKeyInput('');
    setCurrentKeySet(false);
    onKeyUpdated();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Key className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="api-modal-title" className="text-lg font-bold text-slate-900">
                Gemini API Configuration
              </h2>
              <p className="text-xs text-slate-500">Live AI Inference or Zero-Config Offline Fallback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Close API configuration modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 text-sm text-slate-600 space-y-3">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              <strong>Offline Mode Built-in:</strong> VayuMitra functions seamlessly with realistic pre-computed AI action plans even without an API key! Adding an API key activates live Google Gemini 1.5 Flash structured queries.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label htmlFor="gemini-key-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Google Gemini API Key
              </label>
              <input
                id="gemini-key-input"
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                autoComplete="off"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Your key is stored securely in your browser session only. It is never transmitted to any third-party server.
              </span>
            </div>

            {savedSuccess && (
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <Check className="w-4 h-4" /> Key updated successfully! Reloading plan...
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {currentKeySet ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium underline"
                >
                  Clear & Revert to Offline Mode
                </button>
              ) : (
                <span className="text-xs text-slate-400">Currently using Offline Fallback</span>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
