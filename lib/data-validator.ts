// lib/data-validator.ts

import { RawCSVRow, RunRecord, ValidationError } from '@/types';
import { parse, isValid, parseISO } from 'date-fns';

/**
 * Validates CSV headers against expected format
 * Returns normalized header names and errors
 */
export function validateHeaders(headers: string[]): {
  isValid: boolean;
  errors: string[];
  normalizedHeaders: Record<string, string>;
} {
  const requiredHeaders = ['date', 'person', 'miles run'];
  const normalizedHeaders: Record<string, string> = {};
  const errors: string[] = [];

  // Normalize headers (trim, lowercase)
  const normalizedInputHeaders = headers.map(h => 
    h.trim().toLowerCase()
  );

  // Check for required headers
  requiredHeaders.forEach(required => {
    const found = normalizedInputHeaders.find(h => 
      h === required || h === required.replace(' ', '_')
    );
    
    if (!found) {
      errors.push(`Missing required header: "${required}"`);
    } else {
      // Map original header to normalized version
      const originalHeader = headers[normalizedInputHeaders.indexOf(found)];
      normalizedHeaders[required] = originalHeader;
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    normalizedHeaders
  };
}

/**
 * Attempts to parse a date string with multiple formats
 */
function parseDate(dateStr: string): Date | null {
  const formats = [
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'dd/MM/yyyy',
    'yyyy/MM/dd',
    'M/d/yyyy',
    'd/M/yyyy'
  ];

  // Try ISO format first
  const isoDate = parseISO(dateStr);
  if (isValid(isoDate)) return isoDate;

  // Try common formats
  for (const format of formats) {
    const parsed = parse(dateStr, format, new Date());
    if (isValid(parsed)) return parsed;
  }

  return null;
}

/**
 * Validates a single row of data
 */
export function validateRow(
  row: RawCSVRow,
  rowIndex: number,
  headerMap: Record<string, string>
): { record: RunRecord | null; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  
  // Extract values using header mapping
  const dateStr = row[headerMap['date']]?.trim();
  const person = row[headerMap['person']]?.trim();
  const milesStr = row[headerMap['miles run']]?.trim();

  // Validate date
  if (!dateStr) {
    errors.push({
      row: rowIndex,
      field: 'date',
      value: '',
      message: 'Date is required',
      type: 'missing'
    });
  }

  let parsedDate: Date | null = null;
  if (dateStr) {
    parsedDate = parseDate(dateStr);
    if (!parsedDate) {
      errors.push({
        row: rowIndex,
        field: 'date',
        value: dateStr,
        message: 'Invalid date format. Expected: YYYY-MM-DD or MM/DD/YYYY',
        type: 'invalid'
      });
    }
  }

  // Validate person
  if (!person) {
    errors.push({
      row: rowIndex,
      field: 'person',
      value: '',
      message: 'Person name is required',
      type: 'missing'
    });
  }

  // Validate miles
  if (!milesStr) {
    errors.push({
      row: rowIndex,
      field: 'miles run',
      value: '',
      message: 'Miles run is required',
      type: 'missing'
    });
  }

  let miles: number | null = null;
  if (milesStr) {
    miles = parseFloat(milesStr);
    if (isNaN(miles)) {
      errors.push({
        row: rowIndex,
        field: 'miles run',
        value: milesStr,
        message: 'Miles must be a valid number',
        type: 'type_error'
      });
    } else if (miles < 0) {
      errors.push({
        row: rowIndex,
        field: 'miles run',
        value: milesStr,
        message: 'Miles cannot be negative',
        type: 'invalid'
      });
    } else if (miles > 200) {
      // Sanity check - warn about unrealistic values
      errors.push({
        row: rowIndex,
        field: 'miles run',
        value: milesStr,
        message: 'Miles seems unusually high (>200). Please verify.',
        type: 'invalid'
      });
    }
  }

  // If all validations passed, create record
  if (errors.length === 0 && parsedDate && person && miles !== null) {
    return {
      record: {
        date: parsedDate,
        person,
        milesRun: miles,
        rowIndex
      },
      errors: []
    };
  }

  return { record: null, errors };
}

/**
 * Checks for data quality issues and returns warnings
 */
export function generateWarnings(records: RunRecord[]): string[] {
  const warnings: string[] = [];

  if (records.length === 0) {
    warnings.push('No valid records found in CSV');
    return warnings;
  }

  // Check for duplicate entries (same person, same date)
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  
  records.forEach(record => {
    const key = `${record.person}-${record.date.toISOString().split('T')[0]}`;
    if (seen.has(key)) {
      duplicates.add(key);
    }
    seen.add(key);
  });

  if (duplicates.size > 0) {
    warnings.push(
      `Found ${duplicates.size} duplicate entries (same person and date). All records will be included in calculations.`
    );
  }

  // Check for very old or future dates
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const futureRecords = records.filter(r => r.date > now);
  const veryOldRecords = records.filter(r => r.date < oneYearAgo);

  if (futureRecords.length > 0) {
    warnings.push(`${futureRecords.length} records have future dates`);
  }

  if (veryOldRecords.length > 10) {
    warnings.push(`${veryOldRecords.length} records are older than 1 year`);
  }

  return warnings;
}