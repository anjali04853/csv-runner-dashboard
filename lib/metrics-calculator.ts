// lib/metrics-calculator.ts

import { RunRecord, Metrics, PersonStats, DashboardSummary, ChartDataPoint } from '@/types';
import { format } from 'date-fns';

/**
 * Calculates metrics for a set of records
 */
export function calculateMetrics(records: RunRecord[]): Metrics {
  if (records.length === 0) {
    return {
      totalMiles: 0,
      averageMiles: 0,
      minMiles: 0,
      maxMiles: 0,
      totalRuns: 0,
      dateRange: { start: null, end: null }
    };
  }

  const miles = records.map(r => r.milesRun);
  const dates = records.map(r => r.date);

  return {
    totalMiles: miles.reduce((sum, m) => sum + m, 0),
    averageMiles: miles.reduce((sum, m) => sum + m, 0) / miles.length,
    minMiles: Math.min(...miles),
    maxMiles: Math.max(...miles),
    totalRuns: records.length,
    dateRange: {
      start: new Date(Math.min(...dates.map(d => d.getTime()))),
      end: new Date(Math.max(...dates.map(d => d.getTime())))
    }
  };
}

/**
 * Groups records by person and calculates per-person stats
 */
export function calculatePersonStats(records: RunRecord[]): PersonStats[] {
  // Group records by person
  const recordsByPerson = records.reduce((acc, record) => {
    if (!acc[record.person]) {
      acc[record.person] = [];
    }
    acc[record.person].push(record);
    return acc;
  }, {} as Record<string, RunRecord[]>);

  const totalMiles = records.reduce((sum, r) => sum + r.milesRun, 0);

  // Calculate stats for each person
  const personStats: PersonStats[] = Object.entries(recordsByPerson).map(
    ([person, personRecords]) => {
      const metrics = calculateMetrics(personRecords);
      return {
        person,
        metrics,
        records: personRecords,
        percentageOfTotal: totalMiles > 0 
          ? (metrics.totalMiles / totalMiles) * 100 
          : 0
      };
    }
  );

  // Sort by total miles (descending)
  return personStats.sort((a, b) => b.metrics.totalMiles - a.metrics.totalMiles);
}

/**
 * Prepares data for time-series charts
 * Aggregates miles by date and person
 */
export function prepareChartData(records: RunRecord[]): ChartDataPoint[] {
  // Group by date
  const dataByDate = records.reduce((acc, record) => {
    const dateKey = format(record.date, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        displayDate: format(record.date, 'MMM dd, yyyy')
      };
    }
    
    // Accumulate miles for each person on this date
    if (!acc[dateKey][record.person]) {
      acc[dateKey][record.person] = 0;
    }
    acc[dateKey][record.person] += record.milesRun;
    
    return acc;
  }, {} as Record<string, any>);

  // Convert to array and sort by date
  return Object.values(dataByDate).sort((a, b) => 
    a.date.localeCompare(b.date)
  );
}

/**
 * Generates complete dashboard summary
 */
export function generateDashboardSummary(records: RunRecord[]): DashboardSummary {
  const overallMetrics = calculateMetrics(records);
  const personStats = calculatePersonStats(records);
  const chartData = prepareChartData(records);
  const uniquePeople = [...new Set(records.map(r => r.person))];

  return {
    overallMetrics,
    personStats,
    chartData,
    uniquePeople,
    totalRecords: records.length
  };
}

/**
 * Formats a number with proper decimal places
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

/**
 * Formats miles with unit
 */
export function formatMiles(miles: number): string {
  return `${formatNumber(miles, 2)} mi`;
}

/**
 * Gets a color for a person (consistent across charts)
 */
export function getPersonColor(index: number): string {
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ];
  return colors[index % colors.length];
}