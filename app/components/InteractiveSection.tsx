'use client';

import { useCallback, useState } from 'react';
import CanadaMap from './CanadaMap';
import PopulationBarChart from './PopulationBarChart';
import CorrelationScatterChart from './CorrelationScatterChart';

type InteractiveSectionProps = {
  provinces: { province: string; population: number }[];
  correlationData: { province: string; popGrowth: number; hpiGrowth: number }[];
  year: number;
};

export default function InteractiveSection({
  provinces,
  correlationData,
  year,
}: InteractiveSectionProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const handleHover = useCallback((name: string | null) => setHoveredProvince(name), []);

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <CanadaMap onProvinceHover={handleHover} />
      </div>

      <div className="lg:col-span-7 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded border border-card-border bg-card-bg p-3">
          <h2 className="mb-1 text-sm font-semibold">
            Population by Province ({year})
          </h2>
          <PopulationBarChart data={provinces} highlightedProvince={hoveredProvince} />
        </div>
        <div className="rounded border border-card-border bg-card-bg p-3">
          <h2 className="mb-1 text-sm font-semibold">
            Population vs Housing Growth
          </h2>
          <p className="mb-1 text-[10px] text-muted">
            Each dot = one province. Since 2012.
          </p>
          <CorrelationScatterChart data={correlationData} highlightedProvince={hoveredProvince} />
        </div>
      </div>
    </section>
  );
}
