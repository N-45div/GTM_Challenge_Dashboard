"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { DailySubscriberGrowth } from "@/lib/types"

interface DailySubscribersChartProps {
  data: DailySubscriberGrowth[]
}

export function DailySubscribersChart({ data }: DailySubscribersChartProps) {
  // Filter out any data points with invalid or empty dates before formatting
  const validData = data.filter((item) => item.date && !isNaN(new Date(item.date).getTime()))

  // Format dates for display on the X-axis
  const formattedData = validData.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Subscriber Growth</CardTitle>
        <CardDescription>New subscribers over the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            newSubscribers: {
              label: "New Subscribers",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={30} // Adjust to prevent overlapping labels
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, "dataMax + 5"]} // Ensure Y-axis starts at 0 and has some padding
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Line
                dataKey="newSubscribers"
                type="monotone"
                stroke="var(--color-newSubscribers)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
