import React, { useState } from 'react';
import { GenAIActionPlan } from '../types/plan';
import { 
  Clock, ShieldAlert, Sparkles, RefreshCw, Home, 
  Leaf, AlertTriangle, ArrowRight, Check, HelpCircle
} from 'lucide-react';

interface ActionPlanViewProps {
  plan: GenAIActionPlan | null;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenDIYGuide: () => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  plan,
  isLoading,
  onRefresh,
  onOpenDIYGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'routines' | 'hacks' | 'swaps' | 'emergency'>('routines');

  if (isLoading) {
    return (
      <section 
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center"
        aria-busy="true"
        aria-label="Generating personalized action plan"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Generating Tailored Anti-Smog Action Plan...
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Analyzing ground-level inversion curves, household vulnerability profiles, and low-cost indoor particulate mitigation science.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!plan) return null;

  return (
    <section 
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      aria-labelledby="plan-heading"
    >
      {/* Plan Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 id="plan-heading" className="text-lg font-bold text-white tracking-tight">
              GenAI Personalized Action Plan
            </h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              plan.isDemoFallback ? 'bg-slate-700 text-slate-300' : 'bg-emerald-800 text-emerald-200'
            }`}>
              {plan.isDemoFallback ? 'Offline Intelligence' : 'Gemini 1.5 Flash Live'}
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {plan.smogSummary}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
            aria-label="Regenerate action plan"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Vulnerability Banner if present */}
      {plan.vulnerabilityWarning && (
        <div 
          className="p-3.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-start gap-2.5"
          role="note"
        >
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Family Shield Advisory:</strong> {plan.vulnerabilityWarning}
          </p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2" aria-label="Action Plan Sections">
          {[
            { id: 'routines', label: 'Daily Routines', icon: Clock, count: plan.lowEmissionRoutines.length },
            { id: 'hacks', label: 'Indoor IAQ Hacks', icon: Home, count: plan.indoorAirHacks.length },
            { id: 'swaps', label: 'Sustainable Swaps', icon: Leaf, count: plan.sustainableSwaps.length },
            { id: 'emergency', label: 'Emergency Checklist', icon: AlertTriangle, count: plan.emergencyChecklist.length },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-emerald-100 text-emerald-800 font-extrabold' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="p-5 sm:p-6">
        {/* Tab 1: Low-Emission Daily Routines */}
        {activeTab === 'routines' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 mb-2">
              Time-slotted routines synchronized with atmospheric boundary layer dynamics.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.lowEmissionRoutines.map((routine, idx) => {
                const isHighRisk = routine.smogInversionRisk === 'High';
                const isLowRisk = routine.smogInversionRisk === 'Low';

                return (
                  <article 
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {routine.timeWindow}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isHighRisk ? 'bg-red-100 text-red-800 border border-red-200' :
                        isLowRisk ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {routine.smogInversionRisk} Inversion
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {routine.title}
                    </h4>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {routine.recommendation}
                    </p>

                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600">
                      <strong className="text-slate-800 block mb-0.5 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-slate-400" />
                        Scientific Rationale:
                      </strong>
                      {routine.rationale}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Indoor IAQ Hacks */}
        {activeTab === 'hacks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Budget-friendly indoor hacks tailored to your home filtration setup.</span>
              <button 
                onClick={onOpenDIYGuide}
                className="text-emerald-700 hover:text-emerald-800 font-bold underline text-xs"
              >
                View DIY Filter Blueprints
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.indoorAirHacks.map((hack) => (
                <article 
                  key={hack.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full uppercase">
                      {hack.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      Cost: {hack.costLevel}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      {hack.title}
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {hack.instruction}
                    </p>
                  </div>

                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-lg text-emerald-900 text-xs">
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>Scientific Impact</span>
                      <span className="text-emerald-800">~{hack.estimatedPM25DropPercent}% PM2.5 Reduction</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-normal">
                      {hack.scientificBenefit}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Sustainable Swaps */}
        {activeTab === 'swaps' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 mb-2">
              Everyday lifestyle alternatives that reduce both your family’s exposure and your community’s emissions.
            </div>

            <div className="space-y-3">
              {plan.sustainableSwaps.map((swap) => (
                <article 
                  key={swap.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 line-through">{swap.habit}</span>
                        <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {swap.ecoAlternative}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        <strong>Neighborhood Health Benefit:</strong> {swap.neighborhoodBenefit}
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center shrink-0 sm:w-40">
                      <span className="text-lg font-extrabold text-emerald-800 block">
                        -{swap.monthlyCO2ReductionKg} kg
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        CO₂ / Month Prevented
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Emergency Checklist */}
        {activeTab === 'emergency' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 mb-2">
              Critical medical, structural, and physiological checklist for severe winter smog episodes.
            </div>

            <div className="space-y-2">
              {plan.emergencyChecklist.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs text-slate-800"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
