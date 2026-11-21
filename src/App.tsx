import React, { useState } from 'react';
import { useAQI } from './hooks/useAQI';
import { useActionPlan } from './hooks/useActionPlan';
import { useImpactTracker } from './hooks/useImpactTracker';
import { HouseholdProfile } from './types/profile';
import { Header } from './components/Header';
import { AQICard } from './components/AQICard';
import { ProfileOnboarding } from './components/ProfileOnboarding';
import { ActionPlanView } from './components/ActionPlanView';
import { ImpactSimulator } from './components/ImpactSimulator';
import { CommunityCard } from './components/CommunityCard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { DIYAirFilterModal } from './components/DIYAirFilterModal';
import { Wind } from 'lucide-react';

export const App: React.FC = () => {
  // AQI and City State
  const {
    allCities,
    currentCity,
    setSelectedCityId,
    addCustomCity,
  } = useAQI('delhi-anand-vihar');

  // Household Profile State
  const [profile, setProfile] = useState<HouseholdProfile>({
    cityId: currentCity.id,
    householdSize: 4,
    vulnerableMembers: {
      childrenUnder5: 1,
      elderlyOver65: 1,
      asthmaOrCardiac: 1,
    },
    primaryCommute: 'metro_public',
    homeSetup: 'no_purifier',
    hasVentilationExhaust: true,
    lifestyleNotes: 'Apartment on 3rd floor facing road',
  });

  // GenAI Action Plan Hook
  const { plan, isLoading, refreshPlan } = useActionPlan(profile, currentCity);

  // Impact Tracker Hook
  const {
    allHabits,
    selectedHabitIds,
    toggleHabit,
    selectAll,
    resetAll,
    metrics,
  } = useImpactTracker(profile.householdSize);

  // Modal States
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isDIYModalOpen, setIsDIYModalOpen] = useState(false);

  const hasVulnerable = 
    profile.vulnerableMembers.childrenUnder5 > 0 ||
    profile.vulnerableMembers.elderlyOver65 > 0 ||
    profile.vulnerableMembers.asthmaOrCardiac > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header & Smog Alert Ticker */}
      <Header
        currentCity={currentCity}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenDIYGuide={() => setIsDIYModalOpen(true)}
      />

      {/* Main Accessible Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Intro Mission Statement */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/60 border border-emerald-500/40 text-emerald-200">
              <Wind className="w-3.5 h-3.5" /> Winter Smog Resilience Initiative
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Protect Your Family From Winter Smog Inversion
            </h1>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed pt-1">
              VayuMitra analyzes meteorological temperature inversion traps, calculates personal PM2.5 exposure cuts, and delivers customized low-cost indoor hacks and community action plans for urban families.
            </p>
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Section 1: Live Air Quality & Smog Inversion Curve */}
        <AQICard
          currentCity={currentCity}
          allCities={allCities}
          onSelectCity={setSelectedCityId}
          onAddCustomCity={addCustomCity}
          hasVulnerableMembers={hasVulnerable}
        />

        {/* Section 2: Family & Lifestyle Profile */}
        <ProfileOnboarding
          profile={profile}
          onChangeProfile={setProfile}
        />

        {/* Section 3: GenAI Personalized Action Plan */}
        <ActionPlanView
          plan={plan}
          isLoading={isLoading}
          onRefresh={refreshPlan}
          onOpenDIYGuide={() => setIsDIYModalOpen(true)}
        />

        {/* Section 4: Interactive Impact Explainer Simulator */}
        <ImpactSimulator
          allHabits={allHabits}
          selectedHabitIds={selectedHabitIds}
          onToggleHabit={toggleHabit}
          onSelectAll={selectAll}
          onResetAll={resetAll}
          metrics={metrics}
          householdSize={profile.householdSize}
        />

        {/* Section 5: Community & RWA Shareable Alert */}
        <CommunityCard
          currentCity={currentCity}
          metrics={metrics}
        />
      </main>

      {/* Accessible Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
              V
            </div>
            <span className="font-bold text-slate-800">VayuMitra</span>
            <span>– GenAI Urban Air Quality & Anti-Smog Assistant</span>
          </div>

          <p className="text-center sm:text-right">
            Designed to protect children, elderly, and respiratory patients during severe winter air episodes.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={refreshPlan}
      />

      <DIYAirFilterModal
        isOpen={isDIYModalOpen}
        onClose={() => setIsDIYModalOpen(false)}
      />
    </div>
  );
};

export default App;
