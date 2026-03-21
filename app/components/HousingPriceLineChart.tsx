"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ProvinceTimeSeries } from "@/app/lib/data/housingPriceIndex";

const COLORS = [
  "#e04040", // red
  "#4a90c4", // blue
  "#2eaa50", // green
  "#f5a623", // orange
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
  "#78716c", // stone
  "#0ea5e9", // sky
  "#a3522a", // brown
];

type HousingPriceLineChartProps = {
  data: ProvinceTimeSeries[];
};

export default function HousingPriceLineChart({
  data,
}: HousingPriceLineChartProps) {
  const years = data[0]?.series.map((s) => s.year) ?? [];

  const chartData = years.map((year) => {
    const point: Record<string, number> = { year };
    data.forEach((p) => {
      const match = p.series.find((s) => s.year === year);
      if (match) point[p.province] = match.index;
    });
    return point;
  });

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="overflow-x-auto flex-1 ">
        <div className="min-w-[720px]">
          <ResponsiveContainer width="100%" height={480}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, bottom: 5, left: 10 }}
            >
              <XAxis
                dataKey="year"
                fontSize={12}
                stroke="#6b7280"
                tickFormatter={(y: number) => String(y)}
              />
              <YAxis
                fontSize={12}
                stroke="#6b7280"
                width={45}
                domain={["auto", "auto"]}
              />
              <Tooltip
                formatter={(value, name) => [
                  typeof value === "number" ? value.toFixed(1) : String(value ?? ""),
                  String(name),
                ]}
                labelFormatter={(label) =>
                  typeof label === "number" ? `Dec ${label.toString()}` : String(label ?? "")
                }
              />
              <ReferenceLine y={100} stroke="#9ca3af" strokeDasharray="4 4" />
              {data.map((p, i) => (
                <Line
                  key={p.province}
                  type="monotone"
                  dataKey={p.province}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:w-44 shrink-0 pt-2">
        <p className="mb-2 text-lg font-semibold text-muted">
          Growth since 2012
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 lg:grid-cols-1 lg:gap-x-0">
          {data.map((p, i) => (
            <div
              key={p.province}
              className="flex items-center justify-between text-base"
            >
              <span className="flex items-center gap-1.5 truncate">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="truncate">{p.province}</span>
              </span>
              <span
                className="ml-2 font-mono font-semibold shrink-0"
                style={{ color: p.growthRate >= 0 ? "#2eaa50" : "#e04040" }}
              >
                {p.growthRate >= 0 ? "+" : ""}
                {p.growthRate}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
