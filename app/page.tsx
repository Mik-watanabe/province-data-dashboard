import SummaryCard from '@/app/components/SummaryCard';
import InteractiveSection from '@/app/components/InteractiveSection';
import HousingPriceLineChart from '@/app/components/HousingPriceLineChart';
import {
  getLatestYearCanadaPopulation,
  getFastestGrowthProvince,
  getProvincesLatestYear,
  getPopulationGrowthRates,
} from '@/app/lib/data/population';
import {
  getLatestYearCanadaIndex,
  getHighestGrowthProvince,
  getLowestGrowthProvince,
  getProvincesTimeSeries,
} from '@/app/lib/data/housingPriceIndex';
import CardTitle from '@/app/components/CardTitle';

export default function Home() {
  const { population, year } = getLatestYearCanadaPopulation();
  const { province: fastestProvince, growthRate } = getFastestGrowthProvince();
  const provinces = getProvincesLatestYear();

  const { index: canadaIndex, year: housingYear } = getLatestYearCanadaIndex();
  const { province: highestHousingProvince, growthRate: highestHousingRate } =
    getHighestGrowthProvince();
  const { province: lowestHousingProvince, growthRate: lowestHousingRate } =
    getLowestGrowthProvince();
  const housingTimeSeries = getProvincesTimeSeries();

  const popGrowthRates = getPopulationGrowthRates();

  const housingByProvince = new Map(
    housingTimeSeries.map((h) => [h.province, h]),
  );

  const correlationData = housingTimeSeries
    .filter((h) => popGrowthRates.has(h.province))
    .map((h) => ({
      province: h.province,
      popGrowth: popGrowthRates.get(h.province)!,
      hpiGrowth: h.growthRate,
    }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-5">
      {/* Summary cards */}
      <h1 className='pb-5 text-2xl lg:text-4xl font-bold'>
        Population & Housing Price Index Trends
      </h1>
      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryCard
          title="Total Population"
          value={population.toLocaleString()}
          subtitle={`Q4 ${year}`}
        />
        <SummaryCard
          title="Highest Population Growth"
          value={fastestProvince}
          subtitle={`+${growthRate}% since 2012`}
        />
        <SummaryCard
          title="Housing Price Index"
          value={canadaIndex.toFixed(1)}
          subtitle={`Canada, Dec ${housingYear} (2016=100)`}
        />
        <SummaryCard
          title="Highest Housing Growth"
          value={highestHousingProvince}
          subtitle={`+${highestHousingRate}% since 2012`}
        />
      </section>

      {/* Map + Charts (hover linked) */}
      <InteractiveSection
        provinces={provinces}
        correlationData={correlationData}
        year={year}
      />

      {/* Row 2: Housing price line chart (full width) */}
      <section className="mb-6">
        <div className="rounded border border-card-border bg-card-bg p-4">
          <CardTitle>Housing Price Index Trend (2012–{housingYear})</CardTitle>
          <p className="mb-3 text-base text-muted">
            Base: Dec 2016 = 100 — Dashed line marks baseline. Right panel shows total change since 2012.
          </p>
          <HousingPriceLineChart data={housingTimeSeries} />
        </div>
      </section>

      {/* Row 3: Overview table (full width) */}
      <section>
        <CardTitle>Province Population & Housing Price Index Overview ({year})</CardTitle>
        <div className="overflow-x-auto rounded border border-card-border bg-card-bg">
          <table className="w-full text-left text-base">
            <thead className="border-b border-card-border bg-card-bg">
              <tr>
                <th className="px-3 py-3 font-medium">#</th>
                <th className="px-3 py-3 font-medium">Province / Territory</th>
                <th className="px-3 py-3 text-right font-medium">Population</th>
                <th className="px-3 py-3 text-right font-medium">Pop. Growth</th>
                <th className="px-3 py-3 text-right font-medium">HPI</th>
                <th className="px-3 py-3 text-right font-medium">HPI Growth</th>
              </tr>
            </thead>
            <tbody>
              {provinces.map((d, i) => {
                const popGrowth = popGrowthRates.get(d.province);
                const housing = housingByProvince.get(d.province);
                const latestIndex = housing?.series[housing.series.length - 1]?.index;

                return (
                  <tr
                    key={d.province}
                    className="border-b border-card-border last:border-b-0 hover:bg-card-bg"
                  >
                    <td className="px-3 py-3 text-muted">{i + 1}</td>
                    <td className="px-3 py-3">{d.province}</td>
                    <td className="px-3 py-3 text-right font-mono">
                      {d.population.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right font-mono">
                      {popGrowth !== undefined ? (
                        <span style={{ color: popGrowth >= 0 ? '#2eaa50' : '#e04040' }}>
                          {popGrowth >= 0 ? '+' : ''}{popGrowth}%
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right font-mono">
                      {latestIndex !== undefined ? (
                        latestIndex.toFixed(1)
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right font-mono">
                      {housing ? (
                        <span style={{ color: housing.growthRate >= 0 ? '#2eaa50' : '#e04040' }}>
                          {housing.growthRate >= 0 ? '+' : ''}{housing.growthRate}%
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
