import React from 'react';
import { ImpactHabitItem, CalculatedImpact } from '../types/impact';
import { ShieldCheck, Heart, Wind, Trees, Check, RotateCcw, Sparkles } from 'lucide-react';

interface ImpactSimulatorProps {
  allHabits: ImpactHabitItem[];
  selectedHabitIds: string[];
  onToggleHabit: (habitId: string) => void;
  onSelectAll: () => void;
  onResetAll: () => void;
  metrics: CalculatedImpact;
  householdSize: number;
}

export const ImpactSimulator: React.FC<ImpactSimulatorProps> = ({
  allHabits,
  selectedHabitIds,
  onToggleHabit,
  onSelectAll,
  onResetAll,
  metrics,
  householdSize,
}) => {
  return (
    <section 
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6"
      aria-labelledby="impact-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="impact-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" aria-hidden="true" />
              Impact Explainer & Habit Simulator
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
              Interactive
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Check off habits your family adopts to see real-time personal PM2.5 avoidance and CO2 emission cuts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            aria-label="Select all habits"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={onResetAll}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition flex items-center gap-1"
            aria-label="Reset habit selections"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* Quantified Impact Dashboard Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: PM2.5 Exposure Avoided */}
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
          <span className="text-[11px] font-bold text-emerald-900 block flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-emerald-700" /> PM2.5 Intake Avoided
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
              {metrics.totalPM25ReductionUgM3}
            </span>
            <span className="text-xs font-semibold text-emerald-800">µg/m³ / day</span>
          </div>
          <p className="text-[10px] text-emerald-800 mt-1">
            Family of {householdSize} particle burden reduction
          </p>
        </div>

        {/* Metric 2: CO2 Emissions Prevented */}
        <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl">
          <span className="text-[11px] font-bold text-teal-900 block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" /> CO₂ Prevented
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-950">
              {metrics.totalCO2PreventedKgMonth}
            </span>
            <span className="text-xs font-semibold text-teal-800">kg / month</span>
          </div>
          <p className="text-[10px] text-teal-800 mt-1">
            Direct fossil fuel & biomass emissions avoided
          </p>
        </div>

        {/* Metric 3: Equivalent Clean Room Air Hours */}
        <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-2xl">
          <span className="text-[11px] font-bold text-sky-900 block flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-sky-700" /> Clean Air Hours
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-950">
              {metrics.cleanAirEquivalenceHours}
            </span>
            <span className="text-xs font-semibold text-sky-800">hours / day</span>
          </div>
          <p className="text-[10px] text-sky-800 mt-1">
            Lungs clearance buffer against inflammation
          </p>
        </div>

        {/* Metric 4: Urban Tree Absorption Equivalent */}
        <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl">
          <span className="text-[11px] font-bold text-amber-900 block flex items-center gap-1">
            <Trees className="w-3.5 h-3.5 text-amber-700" /> Tree Equivalent
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-950">
              {metrics.treesPlantedEquivalent}
            </span>
            <span className="text-xs font-semibold text-amber-800">tree-months</span>
          </div>
          <p className="text-[10px] text-amber-800 mt-1">
            Carbon offset equivalent in urban trees
          </p>
        </div>
      </div>

      {/* Empathetic Family Takeaway Card */}
      <div 
        className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 space-y-1"
        role="status"
        aria-live="polite"
      >
        <span className="font-bold text-slate-900 flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
          Why This Matters For Your Household:
        </span>
        <p className="leading-relaxed text-slate-700">
          {metrics.keyFamilyTakeaway}
        </p>
      </div>

      {/* Interactive Habit Checklist */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Actionable Family & Community Habits ({metrics.activeHabitCount} of {allHabits.length} Active)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allHabits.map((habit) => {
            const isChecked = selectedHabitIds.includes(habit.id);
            return (
              <div
                key={habit.id}
                onClick={() => onToggleHabit(habit.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 select-none ${
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-500/50 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    onToggleHabit(habit.id);
                  }
                }}
              >
                {/* Custom Checkbox */}
                <div 
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isChecked 
                      ? 'bg-emerald-700 text-white' 
                      : 'border-2 border-slate-300 bg-white'
                  }`}
                  aria-hidden="true"
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900">{habit.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {habit.description}
                  </p>
                  
                  {/* Health rationale */}
                  <p className="text-[11px] text-emerald-800 font-medium pt-1">
                    ✓ {habit.familyHealthBenefit}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500 pt-1">
                    <span className="text-emerald-700">
                      -{habit.pm25SavedDailyUgM3} µg/m³ PM2.5
                    </span>
                    {habit.co2SavedMonthlyKg > 0 && (
                      <span className="text-teal-700">
                        -{habit.co2SavedMonthlyKg} kg CO₂/mo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
