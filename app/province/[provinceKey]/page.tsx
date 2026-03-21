// "use client";
import { notFound } from "next/navigation";
import { PROVINCE_MAP } from "@/app/lib/data/province";
import SummaryCard from "@/app/components/SummaryCard";
import {
  getPopulationByProvince,
  getProvincesLatestYear as getPopulationLatestByProvince,
} from "@/app/lib/data/population";
import {
  getTimeSeriesByProvince,
  getProvincesLatestYear as getHousingIndexLatestByProvince,
} from "@/app/lib/data/housingPriceIndex";
import PopulationLineChart from "@/app/components/PopulationLineChart";
import HousingPriceIndexLineChart from "@/app/components/HousingPriceIndexLineChart";
import ProvinceVsCanadaGrowthBarChart from "@/app/components/ProvinceVsCanadaGrowthBarChart";
import CanadaMap from "@/app/components/CanadaMap";
import CardTitle from "@/app/components/CardTitle";

const ProvinceDetailPage = async ({
  params,
}: {
  params: Promise<{ provinceKey: string }>;
}) => {
  const { provinceKey } = await params;
  const provinceName = PROVINCE_MAP[provinceKey as keyof typeof PROVINCE_MAP];
  if (!provinceName) {
    notFound();
  }

  const provincePopulationData = getPopulationByProvince(provinceName);
  const canadaPopulationData = getPopulationByProvince("Canada");
  const provinceTimeSeries = getTimeSeriesByProvince(provinceName);
  const canadaTimeSeries = getTimeSeriesByProvince("Canada");

  const latestAllPopulationData = getPopulationLatestByProvince();
  const hpiLatestData = getHousingIndexLatestByProvince();
  const provincePopulationLatest =
    provincePopulationData.at(-1)?.population ?? 0;
  const canadaPopulationLatest = canadaPopulationData.at(-1)?.population ?? 0;
  const hasProvinceHpi = provinceTimeSeries.series.length > 0;
  const hasCanadaHpi = canadaTimeSeries.series.length > 0;
  const provinceHpiLatest = hasProvinceHpi
    ? (provinceTimeSeries.series.at(-1)?.index ?? null)
    : null;
  const canadaHpiLatest = hasCanadaHpi
    ? (canadaTimeSeries.series.at(-1)?.index ?? null)
    : null;

  const populationRank =
    latestAllPopulationData.findIndex((d) => d.province === provinceName) + 1;
  const hpiRank =
    hpiLatestData.findIndex((d) => d.province === provinceName) + 1;

  return (
    <main className="mx-auto max-w-7xl px-4 py-5">
      <h1 className="text-2xl font-bold">{`${provinceName} Data Insights`}</h1>
      {/* Row 1: zoomed map + latest value tiles */}
      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-12 mt-4">
        <div className="lg:col-span-8 rounded border border-card-border bg-card-bg p-4">
          <CardTitle>Explore province map</CardTitle>
          <p className="mb-2 text-base text-muted">
            Zoomed around the selected province. Drag the empty space to move
            around, click any province to open it.
          </p>
          <CanadaMap
            highlightedProvinceCode={provinceKey}
            maxWidthClassName="max-w-full"
          />
        </div>
        <div className="lg:col-span-4 grid grid-cols-1 gap-4">
          <SummaryCard
            title={`Latest Total ${provinceName} Population`}
            value={
              provincePopulationData.at(-1)?.population.toLocaleString() ??
              "N/A"
            }
            subtitle={`2025`}
          />
          <SummaryCard
            title={`Latest ${provinceName} Housing Price Index`}
            value={
              provinceTimeSeries.series.at(-1)?.index !== undefined
                ? provinceTimeSeries.series.at(-1)!.index.toFixed(1)
                : "N/A"
            }
            subtitle={
              hasProvinceHpi
                ? `+${provinceTimeSeries.growthRate}% since 2012`
                : "HPI data unavailable"
            }
          />
        </div>
      </section>
      {/* Row 2: population growth*/}
      <section className="mb-6">
        <div className="rounded border border-card-border bg-card-bg p-4">
          <CardTitle>Population Growth in {provinceName}</CardTitle>
          <PopulationLineChart data={provincePopulationData} />
        </div>
      </section>
      {/* Row 3: housing price index growth*/}
      <section className="mb-6">
        <div className="rounded border border-card-border bg-card-bg p-4">
          <CardTitle>
            Housing Price Index Growth in {provinceName}{" "}
            {hasProvinceHpi
              ? `(2012–${provinceTimeSeries.series.at(-1)?.year})`
              : "(No data)"}
          </CardTitle>
          {hasProvinceHpi ? (
            <>
              <p className="mb-3 text-base text-muted">
                Base: Dec 2016 = 100 — Dashed line marks baseline. Right panel
                shows total change since 2012.
              </p>
              <HousingPriceIndexLineChart data={provinceTimeSeries} />
            </>
          ) : (
            <p className="text-base text-muted">
              Housing Price Index data is not available for this province.
            </p>
          )}
        </div>
      </section>
      {/* Row 4: ranking tiles + latest values comparison */}
      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded border border-card-border bg-card-bg p-4">
            <CardTitle>Population Rank in Canada</CardTitle>
            <p className="font-mono text-3xl font-bold text-[#4a90c4]">
              #{populationRank > 0 ? populationRank : "N/A"}
            </p>
            <p className="mt-2 text-base text-muted">
              Based on latest provincial population values.
            </p>
          </div>
          {hasProvinceHpi && (
            <div className="rounded border border-card-border bg-card-bg p-4">
              <CardTitle>Housing Index Rank in Canada</CardTitle>
              <p className="font-mono text-3xl font-bold text-[#e04040]">
                #{hpiRank}
              </p>
              <p className="mt-2 text-base text-muted">
                Based on latest provincial housing price index values.
              </p>
            </div>
          )}
        </div>
        <div className="rounded border border-card-border bg-card-bg p-4">
          <CardTitle>Latest Values: {provinceName} vs Canada</CardTitle>
          <p className="mb-3 text-base text-muted">
            {`Latest population ${hasProvinceHpi && "and housing price index (HPI)"} comparison`}
          </p>
          <ProvinceVsCanadaGrowthBarChart
            provinceName={provinceName}
            provincePopulationLatest={provincePopulationLatest}
            canadaPopulationLatest={canadaPopulationLatest}
            provinceHpiLatest={provinceHpiLatest}
            canadaHpiLatest={canadaHpiLatest}
          />
        </div>
      </section>
    </main>
  );
};

export default ProvinceDetailPage;
