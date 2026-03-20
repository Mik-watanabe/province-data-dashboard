"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { ProvinceTimeSeries } from "../lib/data/housingPriceIndex";
import GrowthRate from "./GrowthRate";

const HousingPriceIndexLineChart = ({ data }: { data: ProvinceTimeSeries }) => {
  console.log(data);
  const chartData = data.series.map((s) => ({
    year: s.year,
    index: s.index,
  }));
  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      <div className="overflow-x-auto flex-1">
        <div className="min-w-[720px]">
          <ResponsiveContainer width="100%" height={480}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, bottom: 5, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
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
                formatter={(value: number, name: string) => [
                  value.toFixed(1),
                  name,
                ]}
                labelFormatter={(label: number) => `${label}`}
              />
              <ReferenceLine y={100} stroke="#9ca3af" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="index"
                stroke="#e04040"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:w-44 shrink-0 pt-2">
        <GrowthRate rate={data.growthRate} />
      </div>
    </div>
  );
};

export default HousingPriceIndexLineChart;
