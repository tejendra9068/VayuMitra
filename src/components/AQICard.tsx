import React, { useState } from 'react';
import { CityData } from '../types/aqi';
import { getAQIColorConfig, getHealthAdvisory } from '../utils/aqiCalculator';
import { HourlyForecastChart } from './HourlyForecastChart';
import { MapPin, Search, AlertOctagon, Droplets, Thermometer, ShieldAlert } from 'lucide-react';

interface AQICardProps {
  currentCity: CityData;
  allCities: CityData[];
  onSelectCity: (cityId: string) => void;
  onAddCustomCity: (cityName: string) => void;
  hasVulnerableMembers: boolean;
}

export const AQICard: React.FC<AQICardProps> = ({
  currentCity,
  allCities,
  onSelectCity,
  onAddCustomCity,
  hasVulnerableMembers,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const colorConfig = getAQIColorConfig(currentCity.category);
  const healthAdvisory = getHealthAdvisory(currentCity.category, hasVulnerableMembers);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim().length >= 2) {
      onAddCustomCity(customInput.trim());
      setCustomInput('');
      setIsSearching(false);
    }
  };

  // Circular gauge mathematics
  const radius = 64;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Map AQI (0 to 500) to gauge percent
  const aqiRatio = Math.min(Math.max(currentCity.aqi / 500, 0), 1);
  const strokeDashoffset = circumference - aqiRatio * (circumference * 0.75); // 270 degree sweep

  return (
    <section 
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      aria-labelledby="aqi-heading"
    >
      {/* Header bar with City Switcher */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
            <div>
              <h2 id="aqi-heading" className="text-lg font-bold text-white flex items-center gap-2">
                {currentCity.name}
              </h2>
              <p className="text-xs text-slate-300">
                {currentCity.source} • {currentCity.lastUpdated}
              </p>
            </div>
          </div>

          {/* Quick city selector & Custom City toggle */}
          <div className="flex items-center gap-2">
            {!isSearching ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={currentCity.id}
                  onChange={(e) => onSelectCity(e.target.value)}
                  className="bg-slate-800 text-white text-xs border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium cursor-pointer"
                  aria-label="Select City"
                >
                  {allCities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name} (AQI {city.aqi})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsSearching(true)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs flex items-center gap-1 transition"
                  aria-label="Search custom city"
                  title="Search custom city"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add City</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5 w-full sm:w-auto">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter city (e.g. Pune, Varanasi)..."
                  className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 w-44"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                >
                  Go
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearching(false)}
                  className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main AQI Meter & Status */}
      <div className="p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Circular SVG Gauge */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg
                height={radius * 2}
                width={radius * 2}
                className="transform -rotate-135 overflow-visible"
                aria-hidden="true"
              >
                {/* Background Track */}
                <circle
                  stroke="#e2e8f0"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference * 0.75} ${circumference}`}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  strokeLinecap="round"
                />
                {/* Value Progress Arc */}
                <circle
                  stroke={colorConfig.gaugeColor}
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference * 0.75} ${circumference}`}
                  style={{ strokeDashoffset }}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Central Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {currentCity.aqi}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Air Quality Index
                </span>
                <span 
                  className={`mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${colorConfig.badgeBg} ${colorConfig.badgeText} shadow-sm`}
                >
                  {currentCity.category}
                </span>
              </div>
            </div>

            {/* Smog Severity Index Bar */}
            <div className="w-full mt-4 pt-3 border-t border-slate-200">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Smog Severity Index (SSI)
                </span>
                <span className="font-extrabold text-slate-900">{currentCity.smogSeverityIndex} / 10</span>
              </div>
              <div 
                className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden" 
                role="progressbar" 
                aria-valuenow={currentCity.smogSeverityIndex} 
                aria-valuemin={1} 
                aria-valuemax={10}
                aria-label="Smog Severity Index"
              >
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    currentCity.smogSeverityIndex >= 8 ? 'bg-red-700' :
                    currentCity.smogSeverityIndex >= 5 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${(currentCity.smogSeverityIndex / 10) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                {currentCity.smogSeverityIndex >= 8 
                  ? 'Dangerous thermal inversion layer trapping particulate soup' 
                  : 'Moderate airborne concentration with morning ground haze'}
              </p>
            </div>
          </div>

          {/* Pollutant Matrix Breakdown */}
          <div className="md:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-slate-800">
              {/* PM2.5 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block">PM2.5 (Fine Soot)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold text-slate-900">{currentCity.pollutants.pm25}</span>
                  <span className="text-[10px] text-slate-500">µg/m³</span>
                </div>
                <span className="text-[10px] text-red-600 font-medium">
                  {Math.round(currentCity.pollutants.pm25 / 15)}x WHO Limit
                </span>
              </div>

              {/* PM10 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block">PM10 (Coarse Dust)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold text-slate-900">{currentCity.pollutants.pm10}</span>
                  <span className="text-[10px] text-slate-500">µg/m³</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {Math.round(currentCity.pollutants.pm10 / 45)}x WHO Limit
                </span>
              </div>

              {/* NO2 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block">NO₂ (Vehicle Gas)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold text-slate-900">{currentCity.pollutants.no2}</span>
                  <span className="text-[10px] text-slate-500">ppb</span>
                </div>
                <span className="text-[10px] text-amber-600 font-medium">Traffic Inversion</span>
              </div>

              {/* Carbon Monoxide */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block">CO (Incomplete Burn)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold text-slate-900">{currentCity.pollutants.co}</span>
                  <span className="text-[10px] text-slate-500">ppm</span>
                </div>
                <span className="text-[10px] text-slate-500">Stubble & Exhaust</span>
              </div>

              {/* Temperature */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-sky-600" /> Temperature
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold text-slate-900">{currentCity.pollutants.temp}</span>
                  <span className="text-[10px] text-slate-500">°C</span>
                </div>
                <span className="text-[10px] text-sky-700">Winter Boundary Drop</span>
              </div>

              {/* Humidity */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-cyan-600" /> Humidity
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold text-slate-900">{currentCity.pollutants.humidity}</span>
                  <span className="text-[10px] text-slate-500">%</span>
                </div>
                <span className="text-[10px] text-cyan-700 font-medium">Dense Fog Trapping</span>
              </div>
            </div>

            {/* Health Advisory Banner */}
            <div 
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${colorConfig.bgLight} ${colorConfig.borderColor}`}
              role="alert"
            >
              <div className="flex items-start gap-2.5">
                <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5 text-slate-800" />
                <div>
                  <strong className="font-bold text-slate-900 block mb-0.5">
                    Community Health Advisory
                  </strong>
                  <p className="text-slate-700">{healthAdvisory}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 24-Hour Diurnal Inversion Curve Chart */}
        <HourlyForecastChart forecast={currentCity.hourlyForecast} />
      </div>
    </section>
  );
};
