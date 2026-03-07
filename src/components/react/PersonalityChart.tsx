"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { use, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A radar chart";

const chartData = [
  { traits: "Self-Learning", Score: 80 },
  { traits: "Creativity", Score: 50 },
  { traits: "Execution", Score: 80 },
  { traits: "Leadership", Score: 45 },
  { traits: "Responsible", Score: 70 },
  { traits: "Teamwork", Score: 55 },
];

const chartConfig = {
  Score: {
    label: "Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function PersonalityChart() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card>
      <CardContent className="flex flex-row items-start gap-4">
        <div className="w-full">
          <ChartContainer
            config={chartConfig}
            className="mx-auto max-h-[250px] w-full"
          >
            <RadarChart data={chartData}>
              <PolarAngleAxis dataKey="traits" />
              <PolarGrid />
              <Radar
                dataKey="Score"
                fill="var(--color-Score)"
                fillOpacity={isHovered ? 0.3 : 0.2}
                stroke="var(--color-Score)"
                strokeWidth={2}
                strokeOpacity={isHovered ? 1 : 0.7}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            </RadarChart>
          </ChartContainer>
        </div>
        {/* <div></div> */}
      </CardContent>
    </Card>
  );
}
