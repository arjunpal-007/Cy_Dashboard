"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
import type { PieLabelRenderProps } from "recharts/types/polar/Pie";
import { useTheme } from "@/context/ThemeContext";
import { ChartContainer } from "./ChartContainer";

interface ThreatData {
  name: string;
  value: number;
  color: string;
}

interface ThreatDistributionProps {
  data: ThreatData[];
}

function ThreatDistributionTooltip({
  active,
  payload,
}: TooltipContentProps) {
  const { isDarkMode } = useTheme();
  if (active && payload && payload.length && payload[0]) {
    const payloadData = payload[0];
    const tooltipValue = Array.isArray(payloadData.value)
      ? payloadData.value[0]
      : payloadData.value;
    return (
      <div
        className={
          isDarkMode
            ? "rounded-lg border border-gray-600 bg-gray-800 p-3"
            : "rounded-lg border border-gray-200 bg-white p-3 shadow-md"
        }
      >
        <p className={`text-xs font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {String(payloadData.name ?? "Unknown")}
        </p>
        <p className={`mt-1 text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {`${Number(tooltipValue ?? 0)}%`}
        </p>
      </div>
    );
  }
  return null;
}

function ThreatPiePercentLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) {
  const { isDarkMode } = useTheme();
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    innerRadius === undefined ||
    outerRadius === undefined ||
    percent === undefined
  ) {
    return null;
  }
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill={isDarkMode ? "#f8fafc" : "#0f172a"}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export const ThreatDistribution: React.FC<ThreatDistributionProps> = ({ data }) => {
  const { isDarkMode } = useTheme();

  return (
    <ChartContainer height="300px">
      <ResponsiveContainer
        width="100%"
        height={300}
        minWidth={0}
        initialDimension={{ width: 400, height: 300 }}
        debounce={50}
      >
        <PieChart margin={{ top: 12, right: 8, bottom: 4, left: 8 }}>
          <Pie
            data={data}
            cx="50%"
            cy="46%"
            labelLine={false}
            label ={ThreatPiePercentLabel}
            outerRadius="72%"
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={ThreatDistributionTooltip} />
          <Legend
            verticalAlign="bottom"
            height={52}
            wrapperStyle={{
              color: isDarkMode ? "#e2e8f0" : "#475569",
              fontSize: "11px",
              paddingTop: "6px",
            }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ThreatDistribution;
