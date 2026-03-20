'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROVINCE_MAP } from '@/app/lib/data/province';

type CanadaMapProps = {
  onProvinceHover?: (province: string | null) => void;
};

export default function CanadaMap({ onProvinceHover }: CanadaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    fetch('/canada-map.svg')
      .then((res) => res.text())
      .then((svgText) => {
        container.innerHTML = svgText;

        const svg = container.querySelector('svg');
        if (!svg) return;

        svg.style.width = '100%';
        svg.style.height = 'auto';

        const provinceCodes = Object.keys(PROVINCE_MAP);

        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'Interactive map of Canada provinces and territories');

        provinceCodes.forEach((code) => {
          const group = svg.querySelector(`#${code}`);
          if (!group) return;

          const el = group as SVGGElement;
          const name = PROVINCE_MAP[code];

          el.setAttribute('tabindex', '0');
          el.setAttribute('role', 'button');
          el.setAttribute('aria-label', `${name} — click to view details`);
          el.style.cursor = 'pointer';
          el.style.transition = 'fill 0.2s ease';
          el.style.outline = 'none';

          const highlight = () => {
            el.style.fill = '#4a90c4';
            setHoveredProvince(name);
            onProvinceHover?.(name);
          };

          const unhighlight = () => {
            el.style.fill = '';
            setHoveredProvince(null);
            onProvinceHover?.(null);
          };

          el.addEventListener('mouseenter', highlight);
          el.addEventListener('mouseleave', unhighlight);
          el.addEventListener('focus', highlight);
          el.addEventListener('blur', unhighlight);

          el.addEventListener('click', () => {
            router.push(`/province/${code}`);
          });

          el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              router.push(`/province/${code}`);
            }
          });
        });
      });
  }, [router, onProvinceHover]);

  return (
    <div>
      <div
        ref={containerRef}
        className="mx-auto max-w-2xl"
      />
      <p className="mt-2 text-center text-sm text-muted font-bold h-5">
        {hoveredProvince ?? 'Hover over a province to see its name'}
      </p>
    </div>
  );
}
