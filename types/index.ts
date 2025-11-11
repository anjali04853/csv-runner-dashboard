// types/index.ts

/**
 * Represents a single running record from the CSV
 */
export interface RunRecord {
  date: Date;
  person: string;
  milesRun: number;
  // Keep original row index for error reporting
  rowIndex: number;
}

/**
 * Raw CSV row before validation
 */
export interface RawCSVRow {
  date?: string;
  person?: string;
  'miles run'?: string;
  [key: string]: string | undefined;
}

/**
 * Validation error with context
 */
export interface ValidationError {
  row: number;
  field: string;
  value: string;
  message: string;
  type: 'missing' | 'invalid' | 'type_error';
}

/**
 * Result of CSV parsing operation
 */
export interface ParseResult {
  success: boolean;
  data: RunRecord[];
  errors: ValidationError[];
  warnings: string[];
}

/**
 * Calculated metrics for a dataset
 */
export interface Metrics {
  totalMiles: number;
  averageMiles: number;
  minMiles: number;
  maxMiles: number;
  totalRuns: number;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

/**
 * Per-person statistics
 */
export interface PersonStats {
  person: string;
  metrics: Metrics;
  records: RunRecord[];
  percentageOfTotal: number;
}

/**
 * Aggregated data for visualization
 */
export interface ChartDataPoint {
  date: string; // formatted date
  [person: string]: string | number; // dynamic person names
}

/**
 * Overall summary for dashboard
 */
export interface DashboardSummary {
  overallMetrics: Metrics;
  personStats: PersonStats[];
  chartData: ChartDataPoint[];
  uniquePeople: string[];
  totalRecords: number;
}