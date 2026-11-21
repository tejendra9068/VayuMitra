import React, { useState } from 'react';
import { CityData } from '../types/aqi';
import { CalculatedImpact } from '../types/impact';
import { Share2, Check, Copy, MessageSquare } from 'lucide-react';

interface CommunityCardProps {
  currentCity: CityData;
  metrics: CalculatedImpact;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ currentCity, metrics }) => {
  const [copied, setCopied] = useState(false);

  const shareText = `🚨 *VayuMitra Winter Smog Action Alert – ${currentCity.name}*
Current AQI: *${currentCity.aqi}* (${currentCity.category}) | PM2.5: *${currentCity.pollutants.pm25} µg/m³*
Smog Severity: *${currentCity.smogSeverityIndex}/10* (Thermal Inversion Active)

🛡️ *Action Advisory For Our Society / Residential Colony:*
1. 🪟 *Midday Airing Window:* Ventilate apartments only between 1:00 PM – 3:30 PM. Keep all doors & windows latched at 6-9 AM & 8-11 PM during peak inversion smog.
2. 🧹 *Ban Dry Sweeping:* Request housekeeping to only damp mop corridors with microfiber cloths to prevent resuspending toxic soot into toddler breathing zones.
3. 🚸 *School Routine:* Request schools hold morning assembly indoors; avoid children running outdoor PT before 10 AM.
4. 🚫 *Zero Leaf / Scrap Burning:* Urge security guards and caretakers to use electric radiant warmers instead of burning scrap wood/leaves.
5. 😷 *Commute Shield:* Wear N95/FFP2 masks during outdoor travel; cloth masks do NOT filter micro-PM2.5 soot.

🌱 *Our Collective Potential:*
Adopting these 5 community habits reduces household particulate exposure by ~${metrics.totalPM25ReductionUgM3} µg/m³ daily and prevents ${metrics.totalCO2PreventedKgMonth} kg CO₂/month!

_Shared via VayuMitra GenAI Urban Air Quality Assistant_`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section 
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4"
      aria-labelledby="community-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-700" aria-hidden="true" />
            <h2 id="community-heading" className="text-lg font-bold text-slate-900">
              Community Smog Alert & Shareable RWA Card
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            1-click formatted summary for Apartment Society WhatsApp groups, Resident Welfare Associations (RWAs), and school parent groups.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
            copied
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          }`}
          aria-label="Copy community alert to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Copied to Clipboard!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy for WhatsApp / RWA
            </>
          )}
        </button>
      </div>

      {/* Visual Preview Box */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto selection:bg-emerald-200">
        {shareText}
      </div>

      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5 text-slate-400" />
        Encourages collective behavioral change to stop leaf burning, car idling at gates, and school smog exposure.
      </div>
    </section>
  );
};
