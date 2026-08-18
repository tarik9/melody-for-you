"use client";

import { useState } from "react";

interface DayPoint {
  date: string;
  revenue: number;
  orders: number;
}

const WIDTH = 720;
const HEIGHT = 200;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;
const PAD_TOP = 12;
const PAD_BOTTOM = 24;

export default function RevenueChart({ data }: { data: DayPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const max = Math.max(1, ...data.map((d) => d.revenue));
  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const gap = 6;
  const barW = data.length > 0 ? (plotW - gap * (data.length - 1)) / data.length : 0;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label="Revenue by day, last 14 days">
        {/* baseline */}
        <line
          x1={PAD_LEFT}
          y1={HEIGHT - PAD_BOTTOM}
          x2={WIDTH - PAD_RIGHT}
          y2={HEIGHT - PAD_BOTTOM}
          stroke="#E5E7EB"
          strokeWidth={1}
        />

        {data.map((d, i) => {
          const barH = max > 0 ? (d.revenue / max) * plotH : 0;
          const x = PAD_LEFT + i * (barW + gap);
          const y = HEIGHT - PAD_BOTTOM - barH;
          const isHover = hover === i;
          const label = new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <g key={d.date}>
              <rect
                x={x}
                y={barH > 0 ? y : HEIGHT - PAD_BOTTOM - 2}
                width={Math.max(barW, 1)}
                height={Math.max(barH, barH > 0 ? barH : 2)}
                rx={3}
                fill={isHover ? "#5B21B6" : "#7C3AED"}
                opacity={barH === 0 ? 0.15 : 1}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="transition-colors"
              />
              {(i % 2 === 0 || data.length <= 7) && (
                <text
                  x={x + barW / 2}
                  y={HEIGHT - 6}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#9CA3AF"
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hover !== null && data[hover] && (
        <div
          className="absolute top-0 bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 pointer-events-none shadow-lg"
          style={{
            left: `${((hover + 0.5) / data.length) * 100}%`,
            transform: "translate(-50%, -110%)",
          }}
        >
          <p className="font-semibold">${data[hover].revenue.toFixed(2)}</p>
          <p className="text-gray-300">
            {data[hover].orders} order{data[hover].orders === 1 ? "" : "s"}
          </p>
        </div>
      )}
    </div>
  );
}
