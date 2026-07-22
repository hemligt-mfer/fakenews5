"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
import { formatPrice } from "@/lib/format-price";

const chartConfig = {
  income: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type WeeklyRevenue = {
  week: string;
  income: number;
};

export function ChartLineLinear({ data }: { data: WeeklyRevenue[] }) {
  const total = data.reduce((sum, d) => sum + d.income, 0);
  return (
    <Card className="flex w-full shadow">
      <CardHeader>
        <CardTitle>Subscription revenue</CardTitle>
        <CardDescription>June</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `W${value}`}
            />
            <YAxis
              tickFormatter={(value) => formatPrice(value)}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <ChartTooltip
              cursor={false}
              formatter={(value) => formatPrice(value as number)}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="income"
              type="linear"
              stroke="var(--color-income)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
        <div className="flex gap-2 leading-none font-medium">
          Total: {formatPrice(total)} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total subscription revenue
        </div>
      </CardFooter>
    </Card>
  );
}
