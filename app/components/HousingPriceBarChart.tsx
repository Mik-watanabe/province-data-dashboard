'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

type HousingPriceBarChartProps = {
  data: { province: string; index: number }[];
};

export default function HousingPriceBarChart({ data }: HousingPriceBarChartProps) {
  const chartData = data.map((d) => ({
    name: d.province,
    index: d.index,
  }));

  return (
    <ResponsiveContainer width="100%" height={480}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 5, left: 10 }}>
        <XAxis
          dataKey="name"
          fontSize={10}
          stroke="#6b7280"
          interval={0}
          angle={-45}
          textAnchor="end"
          height={120}
        />
        <YAxis
          fontSize={12}
          stroke="#6b7280"
          width={50}
          domain={[0, 'auto']}
        />
        <Tooltip
          formatter={(value: number) => [value.toFixed(1), 'Index']}
          labelFormatter={(label: string) => label}
        />
        <ReferenceLine
          y={100}
          stroke="#9ca3af"
          strokeDasharray="4 4"
          label={{ value: '2016 base', position: 'right', fontSize: 10, fill: '#9ca3af' }}
        />
        <Bar dataKey="index" radius={[4, 4, 0, 0]}>
          {chartData.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.index >= 100 ? '#4a90c4' : '#e06666'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
