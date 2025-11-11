// components/charts/overall-chart.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartDataPoint } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPersonColor } from '@/lib/metrics-calculator';

interface OverallChartProps {
  data: ChartDataPoint[];
  people: string[];
}

export function OverallChart({ data, people }: OverallChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Running Trends</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          No data to display
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Running Trends Over Time</CardTitle>
        <CardDescription>
          Miles run by each person across all dates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="displayDate" 
              className="text-xs"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              className="text-xs"
              label={{ value: 'Miles', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value.toFixed(2)} mi`, '']}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            {people.map((person, index) => (
              <Line
                key={person}
                type="monotone"
                dataKey={person}
                stroke={getPersonColor(index)}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}