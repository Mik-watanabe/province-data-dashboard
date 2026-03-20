'use client';

import { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from 'recharts';

type CorrelationPoint = {
  province: string;
  popGrowth: number;
  hpiGrowth: number;
};

type CorrelationScatterChartProps = {
  data: CorrelationPoint[];
  highlightedProvince?: string | null;
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: CorrelationPoint }[] }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-card-border bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold">{d.province}</p>
      <p>Pop. Growth: <span className="font-mono">{d.popGrowth >= 0 ? '+' : ''}{d.popGrowth}%</span></p>
      <p>HPI Growth: <span className="font-mono">{d.hpiGrowth >= 0 ? '+' : ''}{d.hpiGrowth}%</span></p>
    </div>
  );
}

const ABBREVIATIONS: Record<string, string> = {
  'British Columbia': 'BC',
  'Alberta': 'AB',
  'Saskatchewan': 'SK',
  'Manitoba': 'MB',
  'Ontario': 'ON',
  'Quebec': 'QC',
  'New Brunswick': 'NB',
  'Nova Scotia': 'NS',
  'Prince Edward Island': 'PE',
  'Newfoundland and Labrador': 'NL',
};

function getAbbreviation(name: string): string {
  return ABBREVIATIONS[name] ?? name.slice(0, 2).toUpperCase();
}

const DEFAULT_FILL = '#94b8d7';
const HIGHLIGHT_FILL = '#4a90c4';

function CustomDot(props: {
  cx?: number;
  cy?: number;
  payload?: CorrelationPoint;
  active?: string | null;
  onHover?: (name: string | null) => void;
}) {
  const { cx, cy, payload, active: activeProv, onHover } = props;
  if (cx === undefined || cy === undefined || !payload) return null;

  const abbrev = getAbbreviation(payload.province);
  const isHighlighted = activeProv === payload.province;
  const isDimmed = activeProv && !isHighlighted;

  const r = isHighlighted ? 9 : 6;
  const fill = isHighlighted ? HIGHLIGHT_FILL : DEFAULT_FILL;
  const opacity = isDimmed ? 0.3 : 0.9;

  return (
    <g
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover?.(payload.province)}
      onMouseLeave={() => onHover?.(null)}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        fillOpacity={opacity}
        stroke="none"
      />
      <text
        x={cx}
        y={cy - r - 4}
        textAnchor="middle"
        fontSize={isHighlighted ? 12 : 10}
        fontWeight={isHighlighted ? 700 : 400}
        fill={isHighlighted ? HIGHLIGHT_FILL : '#374151'}
      >
        {abbrev}
      </text>
    </g>
  );
}

export default function CorrelationScatterChart({ data, highlightedProvince }: CorrelationScatterChartProps) {
  const [localHover, setLocalHover] = useState<string | null>(null);
  const active = localHover ?? highlightedProvince ?? null;

  return (
    <ResponsiveContainer width="100%" height={420}>
      <ScatterChart
        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
        style={{ cursor: 'default', outline: 'none' }}
        onMouseLeave={() => setLocalHover(null)}
      >
        <XAxis
          type="number"
          dataKey="popGrowth"
          fontSize={12}
          stroke="#6b7280"
          tickFormatter={(v: number) => `${v}%`}
        >
          <Label value="Population Growth (%)" position="bottom" offset={0} fontSize={12} fill="#6b7280" />
        </XAxis>
        <YAxis
          type="number"
          dataKey="hpiGrowth"
          fontSize={12}
          stroke="#6b7280"
          width={55}
          tickFormatter={(v: number) => `${v}%`}
        >
          <Label value="HPI Growth (%)" angle={-90} position="left" offset={0} fontSize={12} fill="#6b7280" />
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#d1d5db" strokeDasharray="3 3" />
        <ReferenceLine x={0} stroke="#d1d5db" strokeDasharray="3 3" />
        <Scatter
          data={data}
          shape={(props: unknown) => (
            <CustomDot {...(props as Record<string, unknown>)} active={active} onHover={setLocalHover} />
          )}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
