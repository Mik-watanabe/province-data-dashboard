"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ProvincePopulationData } from "@/app/scripts/types";
import GrowthRate from "./GrowthRate";
import { getPopulationGrowthRateByProvince } from "../lib/data/population";

type PopulationLineChartProps = {
  data: ProvincePopulationData;
};

function formatPopulation(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}
const PopulationLineChart = ({ data }: PopulationLineChartProps) => {

    const growthRate = getPopulationGrowthRateByProvince(data[0].province);
    const chartData = [...data]
    .sort((a, b) => a.year - b.year)
    .map((d) => ({
      year: d.year,
      population: d.population,
    }));

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      <div className="overflow-x-auto flex-1">
        <div className="min-w-[720px]">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis
                dataKey="population"
                tickFormatter={formatPopulation}
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                width={56}
              />
              <Tooltip
                labelFormatter={(label) => `${label}`}
                formatter={(value) => [
                  typeof value === "number" ? value.toFixed(1) : String(value ?? ""),
                  "Population",
                ]}
              />
              <Line
                type="monotone"
                dataKey="population"
                stroke="#4a90c4"
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:w-44 shrink-0 pt-2">
        <GrowthRate rate={growthRate} />
      </div>
    </div>
  );
};

export default PopulationLineChart;
