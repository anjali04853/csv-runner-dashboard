// components/dashboard-overview.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Metrics } from '@/types';
import { formatMiles, formatNumber } from '@/lib/metrics-calculator';
import { TrendingUp, Activity, Award, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DashboardOverviewProps {
  metrics: Metrics;
  totalPeople: number;
}

export function DashboardOverview({ metrics, totalPeople }: DashboardOverviewProps) {
  const metricCards = [
    {
      title: 'Total Distance',
      value: formatMiles(metrics.totalMiles),
      icon: TrendingUp,
      description: `Across ${metrics.totalRuns} runs`,
      color: 'text-blue-600'
    },
    {
      title: 'Average Distance',
      value: formatMiles(metrics.averageMiles),
      icon: Activity,
      description: 'Per run',
      color: 'text-green-600'
    },
    {
      title: 'Longest Run',
      value: formatMiles(metrics.maxMiles),
      icon: Award,
      description: `Shortest: ${formatMiles(metrics.minMiles)}`,
      color: 'text-purple-600'
    },
    {
      title: 'Active Period',
      value: metrics.dateRange.start && metrics.dateRange.end
        ? `${Math.ceil((metrics.dateRange.end.getTime() - metrics.dateRange.start.getTime()) / (1000 * 60 * 60 * 24))} days`
        : 'N/A',
      icon: Calendar,
      description: metrics.dateRange.start && metrics.dateRange.end
        ? `${format(metrics.dateRange.start, 'MMM dd')} - ${format(metrics.dateRange.end, 'MMM dd, yyyy')}`
        : '',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">
            Tracking {totalPeople} {totalPeople === 1 ? 'runner' : 'runners'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`rounded-full bg-muted p-2 ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}