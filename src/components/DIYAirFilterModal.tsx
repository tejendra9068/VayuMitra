import React from 'react';
import { X, Wrench, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface DIYAirFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DIYAirFilterModal: React.FC<DIYAirFilterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diy-filter-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
              <Wrench className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id="diy-filter-title" className="text-xl font-bold text-slate-900">
                DIY Corsi-Rosenthal Box-Fan HEPA Purifier
              </h2>
              <p className="text-xs text-slate-500">Low-cost indoor defense for families during severe smog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Close DIY purifier guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-4 text-slate-700 text-sm">
          {/* Cost Comparison Pill */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
              <span className="text-slate-500 block font-medium">Commercial HEPA Purifier</span>
              <span className="text-base font-bold text-slate-800">$120 – $250</span>
              <span className="text-[11px] text-slate-400 block">CADR ~150 m³/h</span>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-300 shadow-sm">
              <span className="text-emerald-700 block font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> VayuMitra DIY Fan Rig
              </span>
              <span className="text-base font-bold text-emerald-800">$14 – $18 (₹1,200)</span>
              <span className="text-[11px] text-emerald-600 block">CADR ~180-240 m³/h (Scientific Grade)</span>
            </div>
          </div>

          <article className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Required Materials (Available at Hardware / Online Stores)
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <strong>1x 12-inch or 16-inch Box Fan or High-speed Table Fan</strong>
                <p className="text-slate-500 text-[11px]">Any standard domestic fan with square or flat shroud.</p>
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <strong>1x MERV-13 or HEPA HVAC Pleated Filter (16x16 or 20x20 in)</strong>
                <p className="text-slate-500 text-[11px]">Captures up to 85% of fine soot down to 0.3 microns.</p>
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <strong>1x Roll of Heavy Duct Tape or Painter’s Masking Tape</strong>
                <p className="text-slate-500 text-[11px]">To create an airtight perimeter seal around filter edges.</p>
              </li>
              <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <strong>Cardboard Shroud Ring (Optional)</strong>
                <p className="text-slate-500 text-[11px]">Covers fan corners to eliminate air backflow.</p>
              </li>
            </ul>
          </article>

          <article className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">4-Step Assembly Protocol</h3>
            <ol className="space-y-2 text-xs list-decimal list-inside text-slate-600">
              <li className="pl-1">
                <strong>Identify Airflow Direction:</strong> Locate the airflow arrow printed on the filter rim. The arrow MUST point towards the front of the fan (in the same direction air blows).
              </li>
              <li className="pl-1">
                <strong>Airtight Perimeter Sealing:</strong> Place the filter flat against the back intake grid of the fan. Use duct tape to seal all 4 outer edges so no unfiltered air leaks through cracks.
              </li>
              <li className="pl-1">
                <strong>Elevation:</strong> Place the fan elevated on a stool or bedside table, at least 1 foot away from walls to maximize intake air circulation.
              </li>
              <li className="pl-1">
                <strong>Operation:</strong> Run on medium speed in a closed bedroom for 30 minutes before sleep. Reduces room PM2.5 by up to 70% within 45 minutes!
              </li>
            </ol>
          </article>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2.5 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Safety Note:</strong> Never leave homemade electrical appliances unattended near curtains or toddlers. Use modern fans with thermal fuse protection. Inspect filters weekly and replace every 6-8 weeks during smog season.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
          >
            Got it, Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
