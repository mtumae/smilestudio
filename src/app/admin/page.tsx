"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import Home from "../page"
import { Label, Pie, PieChart } from "recharts"
import Footer from "../footer/page"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "~/components/ui/table"
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
import { Button } from "~/components/ui/button"
import NavBar from "~/components/ui/navigation"

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
    <div className="">
    <NavBar></NavBar>
    <div className="grid grid-auto-fit flex-wrap gap-4 m-5">
        <Card>
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


        <Card >
            <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Started on 1/01/2025</CardDescription></CardHeader>
        <CardContent className="grid grid-cols-2 gap-10">

            <div className="justify-center">
                <h3 className="text-3xl font-bold">1200</h3>
                <p className="">Customers</p>
            </div>

            <div>
                <h3 className="text-3xl font-bold">June</h3>
                <p className="">Best month</p>
            </div>

            <div>
                <h3 className="text-3xl font-bold">200 000</h3>
                <p className="">Profit</p>
            </div>

            <div>
                <h3 className="text-3xl font-bold">June</h3>
                <p className="">Best month</p>
            </div>


        </CardContent>
      
        </Card>
     

        <Card>
            <CardHeader>
                <CardTitle></CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
            <TableCaption>Recent appointments.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">1</TableHead>
                <TableHead>2</TableHead>
                <TableHead>3</TableHead>
                <TableHead className="text-right">4</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                <TableCell className="font-medium">...</TableCell>
                <TableCell>...</TableCell>
                <TableCell>...</TableCell>
                <TableCell className="text-right">...</TableCell>
                </TableRow>
            </TableBody>
            </Table>
            </CardContent>
        </Card>
    </div>
    <Footer></Footer>
    </div>
  )
}

