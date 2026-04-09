"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
import { useTheme } from "@/context/ThemeContext";
import { ChartContainer } from "./ChartContainer";

interface IPData {
  ip: string;
  attacks: number;
  country: string;
}

interface TopIPsProps {
  data: IPData[];
}

function TopIPsTooltip({
  active,
  payload,
}: TooltipContentProps) {
  const { isDarkMode } = useTheme();
  if (active && payload && payload.length && payload[0]) {
    const payloadData = payload[0];
    const tooltipValue = Array.isArray(payloadData.value)
      ? payloadData.value[0]
      : payloadData.value;
    const source = payloadData.payload as IPData | undefined;
    return (
      <div
        className={
          isDarkMode
            ? "rounded-lg border border-gray-600 bg-gray-800 p-3"
            : "rounded-lg border border-gray-200 bg-white p-3 shadow-md"
        }
      >
        <p className={`text-xs font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {source?.ip || "Unknown"}
        </p>
        <p className={`mt-1 text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {`Attacks: ${Number(tooltipValue ?? 0)}`}
        </p>
        <p className={`mt-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {source?.country || "Unknown"}
        </p>
      </div>
    );
  }
  return null;
}

export const TopIPs: React.FC<TopIPsProps> = ({ data }) => {
  const { isDarkMode } = useTheme();

  const axisStroke = isDarkMode ? "#94a3b8" : "#64748b";
  const tickFill = isDarkMode ? "#94a3b8" : "#475569";

  return (
    <ChartContainer height="300px">
      <ResponsiveContainer
        width="100%"
        height={300}
        minWidth={0}
        initialDimension={{ width: 400, height: 300 }}
        debounce={50}
      >
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "rgba(148,163,184,0.2)" : "rgba(100,116,139,0.25)"}
          />
          <XAxis
            type="number"
            stroke={axisStroke}
            tick={{ fill: tickFill, fontSize: 11 }}
            domain={[0, "dataMax + 5"]}
          />
          <YAxis
            type="category"
            dataKey="ip"
            stroke={axisStroke}
            tick={{ fill: tickFill, fontSize: 10 }}
            width={88}
          />
          <Tooltip content={TopIPsTooltip} />
          <Bar dataKey="attacks" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TopIPs;
