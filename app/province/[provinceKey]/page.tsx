"use client";
import { useParams, notFound } from "next/navigation";
import { PROVINCE_MAP } from "@/app/lib/data/province";
import SummaryCard from "@/app/components/SummaryCard";
import { getPopulationByProvince } from "@/app/lib/data/population";
import { getTimeSeriesByProvince } from "@/app/lib/data/housingPriceIndex";
import PopulationLineChart from "@/app/components/PopulationLineChart";

const provinceDetailPage = () => {
  const { provinceKey } = useParams<{ provinceKey: string }>();
  const provinceName = PROVINCE_MAP[provinceKey as keyof typeof PROVINCE_MAP];
  if (!provinceName) {
    notFound();
  }

  const populationData = getPopulationByProvince(provinceName);
  const provinceTimeSeries = getTimeSeriesByProvince(provinceName);
  console.log(provinceTimeSeries);

  return (
    <main className="mx-auto max-w-7xl px-4 py-5">
      <h1 className="text-2xl font-bold">{`${provinceName} Data Insights`}</h1>
      {/* Row 1: summary cards of this province*/}
      <section className="mb-6">
        <div>map</div>
        <div>
          <SummaryCard
            title={`Latest Total ${provinceName} Population`}
            value={populationData.at(-1)?.population.toLocaleString() ?? "N/A"}
            subtitle={`2025`}
          />
          <SummaryCard
            title={`Latest ${provinceName} Housing Price Index`}
            value={provinceTimeSeries.series.at(-1)?.index.toFixed(1) ?? "N/A"}
            subtitle={`+${provinceTimeSeries.growthRate}% since 2012`}
          />
          {/* population rank / entire */}
        </div>
      </section>
      {/* Row 2: population growth*/}
      <section className="mb-6">
        <div className="rounded border border-card-border bg-card-bg p-4">
          <h2 className="mb-2 text-lg font-semibold">
            Population Growth in {provinceName}
          </h2>
          <PopulationLineChart data={populationData} />

          {/* <HousingPriceLineChart data={housingTimeSeries} /> */}
        </div>
      </section>
      {/* large size of the province map and it enable to hover and move to the other province */}
      {/* population growth rate of this province */}
      {/* change housing price index of this province */}
    </main>
  );
};

export default provinceDetailPage;
