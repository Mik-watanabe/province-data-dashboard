import SummaryCard from '@/app/components/SummaryCard';
import {
  getLatestYearCanadaPopulation,
  getFastestGrowthProvince,
  getProvincesLatestYear,
} from '@/app/lib/data/population';

export default function Home() {
  const { population, year } = getLatestYearCanadaPopulation();
  const { province: fastestProvince, growthRate } = getFastestGrowthProvince();
  const provinces = getProvincesLatestYear();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">
          <span className="text-accent">🍁</span> CanadaStats
        </h1>
        <p className="mt-1 text-muted">
          Population & housing data across Canada
        </p>
      </header>

      <section className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard
          title="Total Population"
          value={population.toLocaleString()}
          subtitle={`Q4 ${year}`}
        />
        <SummaryCard
          title="Fastest Growth"
          value={fastestProvince}
          subtitle={`+${growthRate}% since 2012`}
        />
        <SummaryCard title="Average Housing Price" value="" comingSoon />
        <SummaryCard title="Housing Trend" value="" comingSoon />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Province & Territory Population ({year})
        </h2>
        <div className="overflow-x-auto rounded-lg border border-card-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-card-border bg-card-bg">
              <tr>
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">Province / Territory</th>
                <th className="px-4 py-3 text-right font-medium">Population</th>
              </tr>
            </thead>
            <tbody>
              {provinces.map((d, i) => (
                <tr
                  key={d.province}
                  className="border-b border-card-border last:border-b-0 hover:bg-card-bg"
                >
                  <td className="px-4 py-3 text-muted">{i + 1}</td>
                  <td className="px-4 py-3">{d.province}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {d.population.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
