import { useState, useMemo, useCallback } from 'react';
import { IMPACT_HABITS_LIST } from '../services/mockData';
import { calculateImpactMetrics } from '../utils/impactCalculator';
import { CalculatedImpact } from '../types/impact';
import { getCachedData, setCachedData } from '../utils/cache';

const CACHE_KEY = 'user_selected_habits';

export function useImpactTracker(householdSize: number = 4) {
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>(() => {
    const cached = getCachedData<string[]>(CACHE_KEY);
    // Default to 2 high-impact habits pre-selected for great onboarding engagement
    return cached || ['habit-wet-mop', 'habit-ventilation-timing'];
  });

  const toggleHabit = useCallback((habitId: string) => {
    setSelectedHabitIds(prev => {
      const next = prev.includes(habitId) 
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId];
      setCachedData(CACHE_KEY, next);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    const allIds = IMPACT_HABITS_LIST.map(h => h.id);
    setSelectedHabitIds(allIds);
    setCachedData(CACHE_KEY, allIds);
  }, []);

  const resetAll = useCallback(() => {
    setSelectedHabitIds([]);
    setCachedData(CACHE_KEY, []);
  }, []);

  const metrics: CalculatedImpact = useMemo(() => {
    return calculateImpactMetrics(selectedHabitIds, IMPACT_HABITS_LIST, householdSize);
  }, [selectedHabitIds, householdSize]);

  return {
    allHabits: IMPACT_HABITS_LIST,
    selectedHabitIds,
    toggleHabit,
    selectAll,
    resetAll,
    metrics,
  };
}
