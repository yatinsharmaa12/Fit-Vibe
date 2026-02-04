"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

export const description = "A daily progress bar chart"

const chartData = [
    { day: "Mon", calories: 350, tokens: 12 },
    { day: "Tue", calories: 420, tokens: 15 },
    { day: "Wed", calories: 280, tokens: 10 },
    { day: "Thu", calories: 450, tokens: 18 },
    { day: "Fri", calories: 390, tokens: 14 },
    { day: "Sat", calories: 520, tokens: 20 },
    { day: "Sun", calories: 480, tokens: 16 },
]

const chartConfig = {
    calories: {
        label: "Calories",
        color: "hsl(var(--chart-1))",
    },
    tokens: {
        label: "Tokens",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function DailyProgressChart() {
    return (
        <Card className="bg-zinc-900 border-white/10 text-white">
            <CardHeader>
                <CardTitle>Daily Progress</CardTitle>
                <CardDescription className="text-gray-400">Calories burned over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} strokeOpacity={0.1} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            stroke="#888888"
                        />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="calories" fill="var(--color-calories)" radius={4} fillOpacity={0.9} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <div className="flex-col gap-2 text-sm px-6 pb-4 hidden">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing daily calories burned for the current week
                </div>
            </div>
        </Card>
    )
}
