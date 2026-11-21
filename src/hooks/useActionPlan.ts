import { useState, useEffect, useCallback } from 'react';
import { GenAIActionPlan } from '../types/plan';
import { HouseholdProfile } from '../types/profile';
import { CityData } from '../types/aqi';
import { generateAntiSmogActionPlan } from '../services/geminiService';

export function useActionPlan(profile: HouseholdProfile, cityData: CityData) {
  const [plan, setPlan] = useState<GenAIActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const generated = await generateAntiSmogActionPlan(profile, cityData, forceRefresh);
      setPlan(generated);
    } catch (err: unknown) {
      console.error('Error generating action plan:', err);
      setError('Unable to load plan. Falling back to default guidance.');
    } finally {
      setIsLoading(false);
    }
  }, [profile, cityData]);

  useEffect(() => {
    fetchPlan(false);
  }, [fetchPlan]);

  return {
    plan,
    isLoading,
    error,
    refreshPlan: () => fetchPlan(true),
  };
}
