// added by hawon

"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts/umd/Recharts"
import { format, parseISO } from "date-fns"
import type { ScoreData } from "@/lib/types"

interface ScoreGraphProps {
  data: ScoreData[]
}

export default function ScoreGraph({ data }: ScoreGraphProps) {
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), "MMM dd"),
  }))

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="formattedDate" tickLine={false} stroke="#F0F0F0"/>
          <YAxis domain={[0, 100]} tickMargin={10} tickLine={false} tickCount={6} stroke="#F0F0F0"/>
          <Tooltip
            formatter={(value: any) => [`${value} points`, "Score"]}
            labelFormatter={(label: any) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              color: "#000000",
              borderRadius: "12px",
            }}
            itemStyle={{
              color: "#000000", 
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            //stroke="hsl(var(--primary))"
            stroke="#FFFFFF"
            strokeWidth={2}
            dot={{ fill: "#FFFFFF", r: 4 }}
            activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

