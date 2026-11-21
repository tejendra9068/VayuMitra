import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../components/Header';
import { AQICard } from '../components/AQICard';
import { ProfileOnboarding } from '../components/ProfileOnboarding';
import { ActionPlanView } from '../components/ActionPlanView';
import { ImpactSimulator } from '../components/ImpactSimulator';
import { CommunityCard } from '../components/CommunityCard';
import { HIGH_SMOG_CITIES, getPrecomputedActionPlan, IMPACT_HABITS_LIST } from '../services/mockData';
import { calculateImpactMetrics } from '../utils/impactCalculator';
import { HouseholdProfile } from '../types/profile';

describe('Core UI Components & Accessibility', () => {
  const mockCity = HIGH_SMOG_CITIES[0]; // Delhi NCR (AQI 432, Severe)
  const mockProfile: HouseholdProfile = {
    cityId: mockCity.id,
    householdSize: 4,
    vulnerableMembers: {
      childrenUnder5: 1,
      elderlyOver65: 1,
      asthmaOrCardiac: 1,
    },
    primaryCommute: 'metro_public',
    homeSetup: 'no_purifier',
    hasVentilationExhaust: true,
  };

  it('Header displays Emergency Smog Ticker when AQI is Severe (>300)', () => {
    const onKeyMock = vi.fn();
    const onDIYMock = vi.fn();

    render(
      <Header
        currentCity={mockCity}
        onOpenApiKeyModal={onKeyMock}
        onOpenDIYGuide={onDIYMock}
      />
    );

    expect(screen.getByText(/Severe Winter Inversion Advisory/i)).toBeInTheDocument();
    expect(screen.getByText(/Vayu/i)).toBeInTheDocument();

    const diyButton = screen.getByRole('button', { name: /Open DIY Air Filter Guide/i });
    fireEvent.click(diyButton);
    expect(onDIYMock).toHaveBeenCalledTimes(1);
  });

  it('AQICard renders circular gauge, smog index, and triggers city change', () => {
    const onSelectCity = vi.fn();
    const onAddCustom = vi.fn();

    render(
      <AQICard
        currentCity={mockCity}
        allCities={HIGH_SMOG_CITIES}
        onSelectCity={onSelectCity}
        onAddCustomCity={onAddCustom}
        hasVulnerableMembers={true}
      />
    );

    expect(screen.getByText('432')).toBeInTheDocument();
    expect(screen.getByText('Severe')).toBeInTheDocument();
    expect(screen.getByText(/Smog Severity Index/i)).toBeInTheDocument();

    // Select dropdown
    const select = screen.getByLabelText(/Select City/i);
    fireEvent.change(select, { target: { value: HIGH_SMOG_CITIES[1].id } });
    expect(onSelectCity).toHaveBeenCalledWith(HIGH_SMOG_CITIES[1].id);
  });

  it('ProfileOnboarding allows incrementing/decrementing vulnerable members', () => {
    const onChangeProfile = vi.fn();

    render(
      <ProfileOnboarding
        profile={mockProfile}
        onChangeProfile={onChangeProfile}
      />
    );

    expect(screen.getByText(/Family & Lifestyle Profile/i)).toBeInTheDocument();

    const increaseKidsBtn = screen.getByRole('button', { name: /Increase children under 5 count/i });
    fireEvent.click(increaseKidsBtn);
    expect(onChangeProfile).toHaveBeenCalled();
  });

  it('ActionPlanView renders time-slotted routines and supports tab navigation', () => {
    const mockPlan = getPrecomputedActionPlan(mockProfile, mockCity);
    const onRefresh = vi.fn();
    const onDIY = vi.fn();

    render(
      <ActionPlanView
        plan={mockPlan}
        isLoading={false}
        onRefresh={onRefresh}
        onOpenDIYGuide={onDIY}
      />
    );

    expect(screen.getByText(/GenAI Personalized Action Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Routines/i)).toBeInTheDocument();

    // Switch to Indoor IAQ Hacks tab
    const hacksTab = screen.getByRole('button', { name: /Indoor IAQ Hacks/i });
    fireEvent.click(hacksTab);
    expect(screen.getByText(/Microfiber Damp Mopping Over Dry Broom Sweeping/i)).toBeInTheDocument();
  });

  it('ImpactSimulator toggles habits and displays dynamic metrics', () => {
    const onToggle = vi.fn();
    const onSelectAll = vi.fn();
    const onReset = vi.fn();
    const metrics = calculateImpactMetrics(['habit-wet-mop'], IMPACT_HABITS_LIST, 4);

    render(
      <ImpactSimulator
        allHabits={IMPACT_HABITS_LIST}
        selectedHabitIds={['habit-wet-mop']}
        onToggleHabit={onToggle}
        onSelectAll={onSelectAll}
        onResetAll={onReset}
        metrics={metrics}
        householdSize={4}
      />
    );

    expect(screen.getByText(/Impact Explainer & Habit Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/PM2.5 Intake Avoided/i)).toBeInTheDocument();

    const selectAllBtn = screen.getByRole('button', { name: /Select all habits/i });
    fireEvent.click(selectAllBtn);
    expect(onSelectAll).toHaveBeenCalledTimes(1);
  });

  it('CommunityCard generates share text and copies to clipboard', async () => {
    const metrics = calculateImpactMetrics(['habit-wet-mop'], IMPACT_HABITS_LIST, 4);

    render(
      <CommunityCard
        currentCity={mockCity}
        metrics={metrics}
      />
    );

    const copyBtn = screen.getByRole('button', { name: /Copy community alert to clipboard/i });
    fireEvent.click(copyBtn);
    expect(await screen.findByText(/Copied to Clipboard!/i)).toBeInTheDocument();
  });
});
