"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

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
import { format } from "date-fns";

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-1)",
  },
  subscribers: {
    label: "Subscribers",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function ChartPieUserSub({
  users,
  subscribers,
  latestSub,
  notSub,
}: {
  users: number;
  subscribers: number;
  latestSub: Date;
  notSub: number
}) {
  const chartData = [
    { category: "Users", value: notSub, fill: "var(--color-users)" },
    {
      category: "subscribers",
      value: subscribers,
      fill: "var(--color-subscribers)",
    },
  ];


  return (
    <Card className="flex flex-col shadow">
      <CardHeader className="items-center pb-0">
        <CardTitle>User vs Subscribers</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-62.5 w-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              outerRadius={110}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {users}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Latest subscriber {format(latestSub, "yyyy-MM-dd HH:mm")}
        </div>
      </CardFooter>
    </Card>
  );
}
