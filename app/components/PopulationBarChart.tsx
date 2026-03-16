'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type PopulationBarChartProps = {
  data: { province: string; population: number }[];
  highlightedProvince?: string | null;
};

function formatPopulation(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

const DEFAULT_FILL = '#94b8d7';
const HIGHLIGHT_FILL = '#4a90c4';

export default function PopulationBarChart({ data, highlightedProvince }: PopulationBarChartProps) {
  const [localHover, setLocalHover] = useState<string | null>(null);
  const active = localHover ?? highlightedProvince ?? null;

  const chartData = data.map((d) => ({
    name: d.province,
    population: d.population,
  }));

  return (
    <ResponsiveContainer width="100%" height={480}>
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, bottom: 5, left: 10 }}
        style={{ cursor: 'default', outline: 'none' }}
        onMouseLeave={() => setLocalHover(null)}
      >
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
          tickFormatter={formatPopulation}
          fontSize={12}
          stroke="#6b7280"
          width={50}
        />
        <Tooltip
          formatter={(value: unknown) => [
            typeof value === 'number' ? value.toLocaleString() : String(value ?? ''),
            'Population',
          ]}
          labelFormatter={(label: unknown) => String(label ?? '')}
        />
        <Bar
          dataKey="population"
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
          onMouseEnter={(_, index) => setLocalHover(chartData[index].name)}
        >
          {chartData.map((entry) => {
            const isHighlighted = active === entry.name;
            const isDimmed = active && !isHighlighted;
            return (
              <Cell
                key={entry.name}
                fill={isHighlighted ? HIGHLIGHT_FILL : DEFAULT_FILL}
                fillOpacity={isDimmed ? 0.3 : 1}
                style={{ cursor: 'pointer' }}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
