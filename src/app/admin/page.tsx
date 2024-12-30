"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import Home from "../page"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"

const barchartData = [
  { month: "January", appointments: 186 },
  { month: "February", appointments: 305 },
  { month: "March", appointments: 237 },
  { month: "April", appointments: 73 },
  { month: "May", appointments: 209 },
  { month: "June", appointments: 214 },
  { month: "July", appointments: 98 },
  { month: "August", appointments: 294 },
  { month: "September", appointments: 154 },
  { month: "October", appointments: 310 },
  { month: "November", appointments: 84 },
  { month: "December", appointments: 2 },

]
const piechartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },

]


const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  visitors: {
    label: "Visitors",
  },

  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },

} satisfies ChartConfig

export default function Admin() {
    const totalVisitors = React.useMemo(() => {
        return piechartData.reduce((acc, curr) => acc + curr.visitors, 0)
      }, [])
    return (
    <div>
        <Home></Home>
    <div className="grid grid-cols-2 gap-4 m-10">
        <Card className="col-span-1 row-span-1">
        <CardHeader>
            <CardTitle>Bar Chart</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={barchartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="appointments" fill="#57fff0" radius={8} />
            </BarChart>
            </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
            Customers per month
            </div>
        </CardFooter>
        </Card>

        <Card className="">
        <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
        <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}/>
            <Pie
              data={piechartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={90}
              strokeWidth={1}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold">
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground">
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="justify-center">
            <div className="flex gap-2 font-medium leading-none">
            Total amount of customers
            </div>
      </CardFooter>
    </Card>
    </div>
    </div>
  )
}

