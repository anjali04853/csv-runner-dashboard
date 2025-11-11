// app/page.tsx
'use client';

import { useState } from 'react';
import { CSVUploader } from '@/components/csv-uploader';
import { ErrorDisplay } from '@/components/error-display';
import { DashboardOverview } from '@/components/dashboard-overview';
import { OverallChart } from '@/components/charts/overall-chart';
import { PersonBreakdown } from '@/components/person-breakdown';
import { Button } from '@/components/ui/button';
import { ParseResult, DashboardSummary } from '@/types';
import { generateDashboardSummary } from '@/lib/metrics-calculator';
import { RotateCcw, Download } from 'lucide-react';

export default function Home() {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [showWarnings, setShowWarnings] = useState(true);

  const handleDataParsed = (result: ParseResult) => {
    setParseResult(result);
    setShowWarnings(true);
    
    if (result.success && result.data.length > 0) {
      const summary = generateDashboardSummary(result.data);
      setDashboardData(summary);
    } else {
      setDashboardData(null);
    }
  };

  const handleReset = () => {
    setParseResult(null);
    setDashboardData(null);
    setShowWarnings(true);
  };

  const downloadSampleCSV = () => {
    const sampleData = `date,person,miles run
2024-01-01,Alice,5.2
2024-01-02,Bob,3.8
2024-01-02,Alice,4.5
2024-01-03,Charlie,6.1
2024-01-03,Bob,4.2
2024-01-04,Alice,5.8
2024-01-05,Charlie,7.3
2024-01-05,Bob,3.5
2024-01-06,Alice,4.9`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-running-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                CSV Runner Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Upload and analyze running data with visualizations
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSampleCSV}
              >
                <Download className="mr-2 h-4 w-4" />
                Sample CSV
              </Button>
              {dashboardData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Upload New
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Upload Section */}
          {!dashboardData && (
            <div className="max-w-2xl mx-auto">
              <CSVUploader onDataParsed={handleDataParsed} />
            </div>
          )}

          {/* Errors and Warnings */}
          {parseResult && (
            <ErrorDisplay
              errors={parseResult.errors}
              warnings={showWarnings ? parseResult.warnings : []}
              onDismiss={() => setShowWarnings(false)}
            />
          )}

          {/* Dashboard Content */}
          {dashboardData && parseResult?.success && (
            <div className="space-y-8">
              {/* Overview Section */}
              <DashboardOverview
                metrics={dashboardData.overallMetrics}
                totalPeople={dashboardData.uniquePeople.length}
              />

              {/* Overall Chart */}
              <OverallChart
                data={dashboardData.chartData}
                people={dashboardData.uniquePeople}
              />

              {/* Person Breakdown */}
              <PersonBreakdown personStats={dashboardData.personStats} />
            </div>
          )}

          {/* Empty State */}
          {parseResult?.success && parseResult.data.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No valid data found. Please upload a CSV with the correct format.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built with Next.js, TypeScript, and shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
}