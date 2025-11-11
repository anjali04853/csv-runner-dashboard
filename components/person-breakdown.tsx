// components/person-breakdown.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PersonStats } from '@/types';
import { formatMiles, formatNumber, getPersonColor } from '@/lib/metrics-calculator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { User, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface PersonBreakdownProps {
  personStats: PersonStats[];
}

export function PersonBreakdown({ personStats }: PersonBreakdownProps) {
  const [selectedPerson, setSelectedPerson] = useState<string>(
    personStats[0]?.person || ''
  );

  const selectedStats = personStats.find(p => p.person === selectedPerson);

  // Prepare data for comparison bar chart
  const comparisonData = personStats.map((p, idx) => ({
    person: p.person,
    totalMiles: p.metrics.totalMiles,
    averageMiles: p.metrics.averageMiles,
    color: getPersonColor(idx)
  }));

  // Prepare data for pie chart
  const pieData = personStats.map((p, idx) => ({
    name: p.person,
    value: p.metrics.totalMiles,
    color: getPersonColor(idx)
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Per-Person Breakdown</h2>
        <p className="text-muted-foreground mt-1">
          Individual statistics and comparisons
        </p>
      </div>

      {/* Comparison Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Total Miles Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Distance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="person" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${value.toFixed(2)} mi`}
                />
                <Bar dataKey="totalMiles" radius={[8, 8, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(2)} mi`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Individual Person Details */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPerson} onValueChange={setSelectedPerson}>
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${personStats.length}, minmax(0, 1fr))` }}>
              {personStats.map((p, idx) => (
                <TabsTrigger key={p.person} value={p.person} className="gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getPersonColor(idx) }}
                  />
                  {p.person}
                </TabsTrigger>
              ))}
            </TabsList>

            {personStats.map((person) => (
              <TabsContent key={person.person} value={person.person} className="space-y-4">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Runs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {person.metrics.totalRuns}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Distance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatMiles(person.metrics.totalMiles)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatNumber(person.percentageOfTotal, 1)}% of total
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Average Run
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatMiles(person.metrics.averageMiles)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Range
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm font-bold">
                        {formatMiles(person.metrics.minMiles)} - {formatMiles(person.metrics.maxMiles)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Runs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Runs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {person.records
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .slice(0, 5)
                        .map((record, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-primary/10 p-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {formatMiles(record.milesRun)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(record.date, 'MMMM dd, yyyy')}
                                </p>
                              </div>
                            </div>
                            {record.milesRun === person.metrics.maxMiles && (
                              <Badge variant="secondary">Best</Badge>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}