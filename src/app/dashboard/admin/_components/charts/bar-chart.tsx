"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"


interface Props {
  chartData: { country: string; users: number }[]
}

const chartConfig = {
  users: {
    label: "users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function CountryChart({chartData} : Props) {
  return (
    <Card className="flex flex-col mt-5 shadow">
      <CardHeader>
        <CardTitle>Users / Countries</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="country"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="users" fill="var(--color-users)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
        <div className="leading-none text-muted-foreground">
          Number of users in each country
        </div>
      </CardFooter>
    </Card>
  )
}
