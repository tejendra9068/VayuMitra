import { useState, useMemo, useCallback } from 'react';
import { CityData } from '../types/aqi';
import { HIGH_SMOG_CITIES, createCustomCityData } from '../services/mockData';
import { sanitizeCityName } from '../utils/sanitizer';
import { getCachedData, setCachedData } from '../utils/cache';

export function useAQI(initialCityId: string = 'delhi-anand-vihar') {
  const [selectedCityId, setSelectedCityId] = useState<string>(initialCityId);
  const [customCityQuery, setCustomCityQuery] = useState<string>('');
  const [customCities, setCustomCities] = useState<CityData[]>(() => {
    return getCachedData<CityData[]>('custom_cities') || [];
  });

  const allCities = useMemo(() => {
    return [...HIGH_SMOG_CITIES, ...customCities];
  }, [customCities]);

  const currentCity = useMemo(() => {
    const found = allCities.find(c => c.id === selectedCityId);
    return found || HIGH_SMOG_CITIES[0];
  }, [allCities, selectedCityId]);

  const addCustomCity = useCallback((name: string): CityData => {
    const cleanName = sanitizeCityName(name);
    if (!cleanName || cleanName.length < 2) return currentCity;

    const existing = allCities.find(c => c.name.toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      setSelectedCityId(existing.id);
      return existing;
    }

    const newCity = createCustomCityData(cleanName);
    const updated = [newCity, ...customCities];
    setCustomCities(updated);
    setCachedData('custom_cities', updated);
    setSelectedCityId(newCity.id);
    return newCity;
  }, [allCities, customCities, currentCity]);

  return {
    allCities,
    currentCity,
    selectedCityId,
    setSelectedCityId,
    customCityQuery,
    setCustomCityQuery,
    addCustomCity,
  };
}
