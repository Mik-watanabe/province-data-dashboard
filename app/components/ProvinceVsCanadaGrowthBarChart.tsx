"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ProvinceVsCanadaGrowthBarChartProps = {
  provinceName: string;
  provincePopulationLatest: number;
  canadaPopulationLatest: number;
  provinceHpiLatest: number | null;
  canadaHpiLatest: number | null;
};

export default function ProvinceVsCanadaGrowthBarChart({
  provinceName,
  provincePopulationLatest,
  canadaPopulationLatest,
  provinceHpiLatest,
  canadaHpiLatest,
}: ProvinceVsCanadaGrowthBarChartProps) {
  const populationData = [
    {
      name: provinceName,
      value: provincePopulationLatest,
    },
    { name: "Canada", value: canadaPopulationLatest },
  ];

  const hpiData = [
    {
      name: provinceName,
      value: provinceHpiLatest,
    },
    { name: "Canada", value: canadaHpiLatest },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold text-muted">
          Population (Latest)
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={populationData}
            margin={{ top: 8, right: 20, bottom: 8, left: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" fontSize={12} stroke="#6b7280" />
            <YAxis
              fontSize={12}
              stroke="#6b7280"
              width={44}
              tickFormatter={(value: number) => {
                if (value >= 1_000_000)
                  return `${(value / 1_000_000).toFixed(1)}M`;
                if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
                return String(Math.round(value));
              }}
            />
            <Tooltip
              formatter={(value, name) => [
                typeof value === "number" ? value.toLocaleString() : String(value ?? ""),
                "Population",
              ]}
            />
            <Bar
              dataKey="value"
              fill="#4a90c4"
              radius={[4, 4, 0, 0]}
              minPointSize={6}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {provinceHpiLatest && (
        <div>
          <p className="mb-1 text-xs font-semibold text-muted">
            Housing Price Index (Latest)
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={hpiData}
              margin={{ top: 8, right: 20, bottom: 8, left: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={12} stroke="#6b7280" />
              <YAxis fontSize={12} stroke="#6b7280" width={44} />
              <Tooltip
                formatter={(value) => [
                  typeof value === "number" ? value.toFixed(1) : String(value ?? ""),
                  "HPI",
                ]}
              />
              <Bar dataKey="value" fill="#e04040" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
