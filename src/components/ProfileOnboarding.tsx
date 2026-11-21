import React from 'react';
import { HouseholdProfile, CommuteMode, HomeFilterSetup } from '../types/profile';
import { Users, Baby, HeartPulse, UserCheck, Car, Bike, Train, Zap, Home, Wind } from 'lucide-react';

interface ProfileOnboardingProps {
  profile: HouseholdProfile;
  onChangeProfile: (updated: HouseholdProfile) => void;
}

export const ProfileOnboarding: React.FC<ProfileOnboardingProps> = ({ profile, onChangeProfile }) => {
  const updateVulnerable = (field: keyof HouseholdProfile['vulnerableMembers'], delta: number) => {
    const current = profile.vulnerableMembers[field];
    const next = Math.max(0, Math.min(10, current + delta));
    onChangeProfile({
      ...profile,
      vulnerableMembers: {
        ...profile.vulnerableMembers,
        [field]: next,
      },
    });
  };

  const updateHouseholdSize = (delta: number) => {
    const next = Math.max(1, Math.min(20, profile.householdSize + delta));
    onChangeProfile({
      ...profile,
      householdSize: next,
    });
  };

  const setCommute = (mode: CommuteMode) => {
    onChangeProfile({ ...profile, primaryCommute: mode });
  };

  const setHomeSetup = (setup: HomeFilterSetup) => {
    onChangeProfile({ ...profile, homeSetup: setup });
  };

  return (
    <section 
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6"
      aria-labelledby="profile-heading"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 id="profile-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" aria-hidden="true" />
            Family & Lifestyle Profile
          </h2>
          <p className="text-xs text-slate-500">
            Tailors daily routines, morning inversion safeguards, and DIY indoor hacks to your family members.
          </p>
        </div>
        <span className="hidden sm:inline-flex px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
          Auto-Syncs with AI
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Household Size & Vulnerable Members */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            Household Members & Vulnerability
          </h3>

          {/* Household Size */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">Total Family Members</span>
              <span className="text-[11px] text-slate-500">Living in the residence</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateHouseholdSize(-1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 focus:ring-2 focus:ring-emerald-500"
                aria-label="Decrease household size"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-bold text-slate-900">{profile.householdSize}</span>
              <button
                type="button"
                onClick={() => updateHouseholdSize(1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 focus:ring-2 focus:ring-emerald-500"
                aria-label="Increase household size"
              >
                +
              </button>
            </div>
          </div>

          {/* Toddlers Under 5 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Baby className="w-4 h-4 text-sky-600" aria-hidden="true" />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Toddlers / Kids (&lt;5 yrs)</span>
                <span className="text-[11px] text-slate-500">Narrow airways, fast breath</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateVulnerable('childrenUnder5', -1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 focus:ring-2 focus:ring-emerald-500"
                aria-label="Decrease children under 5 count"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-bold text-slate-900">
                {profile.vulnerableMembers.childrenUnder5}
              </span>
              <button
                type="button"
                onClick={() => updateVulnerable('childrenUnder5', 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 focus:ring-2 focus:ring-emerald-500"
                aria-label="Increase children under 5 count"
              >
                +
              </button>
            </div>
          </div>

          {/* Seniors Over 65 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-600" aria-hidden="true" />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Elderly (&gt;65 yrs)</span>
                <span className="text-[11px] text-slate-500">Cardiovascular sensitivity</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateVulnerable('elderlyOver65', -1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 focus:ring-2 focus:ring-emerald-500"
                aria-label="Decrease elderly over 65 count"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-bold text-slate-900">
                {profile.vulnerableMembers.elderlyOver65}
              </span>
              <button
                type="button"
                onClick={() => updateVulnerable('elderlyOver65', 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 focus:ring-2 focus:ring-emerald-500"
                aria-label="Increase elderly over 65 count"
              >
                +
              </button>
            </div>
          </div>

          {/* Asthma or Cardiac */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-600" aria-hidden="true" />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Asthma / Bronchial</span>
                <span className="text-[11px] text-slate-500">Prone to wheezing & cough</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateVulnerable('asthmaOrCardiac', -1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 focus:ring-2 focus:ring-emerald-500"
                aria-label="Decrease asthma or cardiac count"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-bold text-slate-900">
                {profile.vulnerableMembers.asthmaOrCardiac}
              </span>
              <button
                type="button"
                onClick={() => updateVulnerable('asthmaOrCardiac', 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 focus:ring-2 focus:ring-emerald-500"
                aria-label="Increase asthma or cardiac count"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Primary Commute Mode */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Primary Daily Commute
          </h3>
          <div className="space-y-2">
            {[
              { id: 'petrol_car', label: 'Petrol / Diesel Car', icon: Car, desc: 'Highest exposure in traffic idling' },
              { id: 'two_wheeler', label: 'Two-Wheeler / Bike', icon: Bike, desc: 'Direct face-level exhaust inhalation' },
              { id: 'metro_public', label: 'Metro Train / Public Bus', icon: Train, desc: 'Shared low-emission transit' },
              { id: 'electric', label: 'EV / Electric Cab', icon: Zap, desc: 'Zero tailpipe community impact' },
              { id: 'wfh', label: 'Work From Home / Remote', icon: Home, desc: 'Zero commute exposure' },
            ].map(item => {
              const Icon = item.icon;
              const isSelected = profile.primaryCommute === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCommute(item.id as CommuteMode)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 ${
                    isSelected 
                      ? 'bg-emerald-50/80 border-emerald-600 ring-1 ring-emerald-600' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                    <span className="text-[11px] text-slate-500">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Home Setup & Air Filtration */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Home Setup & Filtration
          </h3>
          <div className="space-y-2.5">
            {[
              { 
                id: 'commercial_purifier', 
                label: 'Commercial HEPA Purifier', 
                badge: 'Active Purifier',
                desc: 'Dedicated commercial unit with HEPA filter' 
              },
              { 
                id: 'diy_filter', 
                label: 'DIY Fan Filter / Budget Rig', 
                badge: 'Budget Hack',
                desc: 'Table fan fitted with MERV-13 filter ($15 solution)' 
              },
              { 
                id: 'no_purifier', 
                label: 'No Purifier (Natural / DIY Hacks Needed)', 
                badge: 'Zero Equipment',
                desc: 'Needs low-cost damp mopping & ventilation hacks' 
              },
            ].map(item => {
              const isSelected = profile.homeSetup === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setHomeSetup(item.id as HomeFilterSetup)}
                  className={`w-full text-left p-3.5 rounded-xl border transition ${
                    isSelected 
                      ? 'bg-emerald-50/80 border-emerald-600 ring-1 ring-emerald-600' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-semibold">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </button>
              );
            })}

            {/* Kitchen Exhaust Toggle */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between mt-2">
              <div>
                <span className="text-xs font-semibold text-slate-800 block flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-emerald-600" />
                  Kitchen Chimney / Exhaust Fan
                </span>
                <span className="text-[11px] text-slate-500">Vents intense cooking particulate spikes</span>
              </div>
              <input
                type="checkbox"
                checked={profile.hasVentilationExhaust}
                onChange={(e) => onChangeProfile({ ...profile, hasVentilationExhaust: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                aria-label="Has kitchen chimney or exhaust fan"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
