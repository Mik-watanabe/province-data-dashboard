import populationData from '@/app/data/processed/province_population.json';
import { ProvincePopulation, ProvincePopulationData } from '@/app/scripts/types';

export function getAllPopulation(): ProvincePopulationData {
  return populationData as ProvincePopulationData;
}

export function getPopulationByYear(year: number): ProvincePopulationData {
  return getAllPopulation().filter((d) => d.year === year);
}

export function getAvailableYears(): number[] {
  const years = new Set(getAllPopulation().map((d) => d.year));
  return [...years].sort();
}

export function getLatestYearCanadaPopulation(): {
  population: number;
  year: number;
} {
  const years = getAvailableYears();
  const latestYear = years[years.length - 1];
  const canada = getAllPopulation().find(
    (d) => d.province === 'Canada' && d.year === latestYear,
  );

  return {
    population: canada?.population ?? 0,
    year: latestYear,
  };
}

export function getFastestGrowthProvince(): {
  province: string;
  growthRate: number;
} {
  const all = getAllPopulation().filter((d) => d.province !== 'Canada');
  const years = getAvailableYears();
  const firstYear = years[0];
  const lastYear = years[years.length - 1];

  const byProvince = new Map<string, { first: number; last: number }>();

  all.forEach((d) => {
    if (d.year === firstYear || d.year === lastYear) {
      const entry = byProvince.get(d.province) ?? { first: 0, last: 0 };
      if (d.year === firstYear) entry.first = d.population;
      if (d.year === lastYear) entry.last = d.population;
      byProvince.set(d.province, entry);
    }
  });

  let bestProvince = '';
  let bestRate = -Infinity;

  byProvince.forEach(({ first, last }, province) => {
    if (first === 0) return;
    const rate = ((last - first) / first) * 100;
    if (rate > bestRate) {
      bestRate = rate;
      bestProvince = province;
    }
  });

  return { province: bestProvince, growthRate: Math.round(bestRate * 10) / 10 };
}

export function getProvincesLatestYear(): ProvincePopulationData {
  const years = getAvailableYears();
  const latestYear = years[years.length - 1];
  return getAllPopulation()
    .filter((d) => d.year === latestYear && d.province !== 'Canada')
    .sort((a, b) => b.population - a.population);
}

export function getPopulationByProvince(provinceName: string): ProvincePopulationData {
    return getAllPopulation()
      .filter((d) => d.province === provinceName)
      .sort((a, b) => a.year - b.year);
}

export function getPopulationGrowthRates(): Map<string, number> {
  const all = getAllPopulation().filter((d) => d.province !== 'Canada');
  const years = getAvailableYears();
  const firstYear = years[0];
  const lastYear = years[years.length - 1];

  const rates = new Map<string, number>();

  const byProvince = new Map<string, { first: number; last: number }>();
  all.forEach((d) => {
    if (d.year === firstYear || d.year === lastYear) {
      const entry = byProvince.get(d.province) ?? { first: 0, last: 0 };
      if (d.year === firstYear) entry.first = d.population;
      if (d.year === lastYear) entry.last = d.population;
      byProvince.set(d.province, entry);
    }
  });

  byProvince.forEach(({ first, last }, province) => {
    if (first === 0) return;
    rates.set(province, Math.round(((last - first) / first) * 1000) / 10);
  });

  return rates;
}