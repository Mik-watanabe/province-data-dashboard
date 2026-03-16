import housingPriceIndexData from '@/app/data/processed/housing_price_index.json';
import { HousingPriceIndexData } from '@/app/scripts/types';

const BASE_YEAR = 2012;

export function getAllHousingPriceIndex(): HousingPriceIndexData {
  return housingPriceIndexData as HousingPriceIndexData;
}

export function getAvailableYears(): number[] {
  const years = new Set(getAllHousingPriceIndex().map((d) => d.year));
  return [...years].sort();
}

export function getLatestYear(): number {
  const years = getAvailableYears();
  return years[years.length - 1];
}

export function getLatestYearCanadaIndex(): {
  index: number;
  year: number;
} {
  const year = getLatestYear();
  const record = getAllHousingPriceIndex().find(
    (d) => d.province === 'Canada' && d.year === year,
  );
  return { index: record?.index ?? 0, year };
}

export function getProvincesLatestYear(): HousingPriceIndexData {
  const year = getLatestYear();
  return getAllHousingPriceIndex()
    .filter((d) => d.province !== 'Canada' && d.year === year)
    .sort((a, b) => b.index - a.index);
}

function getGrowthProvince(
  type: 'highest' | 'lowest',
): { province: string; growthRate: number } {
  const data = getAllHousingPriceIndex();
  const latest = getLatestYear();

  const provinces = [
    ...new Set(
      data.filter((d) => d.province !== 'Canada').map((d) => d.province),
    ),
  ];

  let bestGrowth = type === 'highest' ? -Infinity : Infinity;
  let bestProvince = '';

  for (const province of provinces) {
    const latestIndex = data.find(
      (d) => d.province === province && d.year === latest,
    )?.index;
    const baseIndex = data.find(
      (d) => d.province === province && d.year === BASE_YEAR,
    )?.index;

    if (!latestIndex || !baseIndex || baseIndex === 0) continue;

    const rate = ((latestIndex / baseIndex) - 1) * 100;
    const shouldReplace =
      type === 'highest' ? rate > bestGrowth : rate < bestGrowth;

    if (shouldReplace) {
      bestGrowth = rate;
      bestProvince = province;
    }
  }

  return {
    province: bestProvince,
    growthRate: Math.round(bestGrowth * 10) / 10,
  };
}

export function getHighestGrowthProvince() {
  return getGrowthProvince('highest');
}

export function getLowestGrowthProvince() {
  return getGrowthProvince('lowest');
}

export type ProvinceTimeSeries = {
  province: string;
  series: { year: number; index: number }[];
  growthRate: number;
};

export function getProvincesTimeSeries(): ProvinceTimeSeries[] {
  const data = getAllHousingPriceIndex();
  const years = getAvailableYears().filter((y) => y >= BASE_YEAR);

  const provinces = [
    ...new Set(
      data.filter((d) => d.province !== 'Canada').map((d) => d.province),
    ),
  ];

  return provinces
    .map((province) => {
      const series = years
        .map((year) => {
          const record = data.find(
            (d) => d.province === province && d.year === year,
          );
          return record ? { year, index: record.index } : null;
        })
        .filter((d): d is { year: number; index: number } => d !== null);

      const first = series[0]?.index ?? 0;
      const last = series[series.length - 1]?.index ?? 0;
      const growthRate =
        first > 0 ? Math.round(((last / first) - 1) * 1000) / 10 : 0;

      return { province, series, growthRate };
    })
    .sort((a, b) => b.growthRate - a.growthRate);
}
