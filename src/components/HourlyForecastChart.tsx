import React from 'react';
import { HourlyForecastItem } from '../types/aqi';
import { Sun, AlertCircle } from 'lucide-react';

interface HourlyForecastChartProps {
  forecast: HourlyForecastItem[];
}

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  const maxAqi = Math.max(...forecast.map(f => f.aqi), 500);
  const chartHeight = 120;
  const chartWidth = 560;
  const paddingX = 30;
  const stepX = (chartWidth - paddingX * 2) / (forecast.length - 1);

  // Calculate SVG polyline points
  const points = forecast.map((item, index) => {
    const x = paddingX + index * stepX;
    // Inverted y: high AQI is closer to top (y = 15), low AQI closer to bottom (y = 95)
    const y = chartHeight - 20 - ((item.aqi / maxAqi) * (chartHeight - 40));
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            Diurnal Smog Inversion Curve (24-Hour)
          </h3>
          <p className="text-[11px] text-slate-500">
            Cold air traps emissions early morning and late night; midday sun lifts the smog layer.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-red-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Inversion Peak
          </span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Golden Window
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-1" tabIndex={0} aria-label="Hourly AQI Trend Chart">
        <div className="min-w-[500px]">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full h-32 overflow-visible"
            role="img"
            aria-label="24-hour diurnal air quality curve showing high smog at 6-9 AM and lower levels at 1-3 PM"
          >
            {/* Background Grid Lines */}
            <line x1={paddingX} y1="20" x2={chartWidth - paddingX} y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={paddingX} y1="55" x2={chartWidth - paddingX} y2="55" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={paddingX} y1="90" x2={chartWidth - paddingX} y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

            {/* Midday Golden Safe Window Highlight Zone */}
            <rect 
              x={paddingX + stepX * 4} 
              y="10" 
              width={stepX * 2} 
              height={chartHeight - 30} 
              fill="#10b981" 
              opacity="0.12" 
              rx="6"
            />
            <text 
              x={paddingX + stepX * 5} 
              y="22" 
              textAnchor="middle" 
              fill="#047857" 
              fontSize="9" 
              fontWeight="bold"
            >
              Golden Window
            </text>

            {/* Inversion Peak Alert Bands */}
            <rect 
              x={paddingX} 
              y="10" 
              width={stepX * 2.5} 
              height={chartHeight - 30} 
              fill="#ef4444" 
              opacity="0.08" 
              rx="6"
            />

            {/* Trend Polyline */}
            <polyline
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Forecast Data Points */}
            {forecast.map((item, index) => {
              const x = paddingX + index * stepX;
              const y = chartHeight - 20 - ((item.aqi / maxAqi) * (chartHeight - 40));
              const isGolden = item.hour.includes('02:00 PM');
              const isPeak = item.isInversionPeak;

              const circleFill = isGolden ? '#059669' : isPeak ? '#dc2626' : '#f59e0b';

              return (
                <g key={item.hour} className="group cursor-pointer">
                  <circle
                    cx={x}
                    cy={y}
                    r={isGolden ? 5 : 4}
                    fill={circleFill}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* AQI label above point */}
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    fill="#1e293b"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {item.aqi}
                  </text>
                  {/* Hour label below */}
                  <text
                    x={x}
                    y={chartHeight - 2}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="8.5"
                  >
                    {item.hour.replace(':00', '')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <strong>Best Ventilation Window:</strong> 1:00 PM – 3:30 PM (Midday convective mixing)
        </span>
        <span className="flex items-center gap-1.5 text-red-700">
          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
          <strong>Hazardous Inversion:</strong> 6:00 AM – 9:00 AM (Keep windows latched)
        </span>
      </div>
    </div>
  );
};
