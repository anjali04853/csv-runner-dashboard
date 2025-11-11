// lib/csv-parser.ts

import Papa from 'papaparse';
import { ParseResult, RawCSVRow, RunRecord, ValidationError } from '@/types';
import { validateHeaders, validateRow, generateWarnings } from './data-validator';

/**
 * Main CSV parsing function with comprehensive validation
 * 
 * @param file - The CSV file to parse
 * @returns Promise resolving to ParseResult with data and errors
 */
export async function parseCSVFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const validRecords: RunRecord[] = [];
    const allErrors: ValidationError[] = [];
    let headerMap: Record<string, string> = {};
    let headersValidated = false;

    let currentRowIndex = 1;
    Papa.parse<RawCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // We handle type conversion manually
      transformHeader: (header: string) => header.trim(),
      
      complete: (results) => {
        // Final validation and warning generation
        const warnings = generateWarnings(validRecords);
        
        resolve({
          success: allErrors.length === 0,
          data: validRecords,
          errors: allErrors,
          warnings
        });
      },
      
      error: (error) => {
        resolve({
          success: false,
          data: [],
          errors: [{
            row: 0,
            field: 'file',
            value: file.name,
            message: `Failed to parse CSV: ${error.message}`,
            type: 'invalid'
          }],
          warnings: []
        });
      },
      
      beforeFirstChunk: (chunk) => {
        // Extract headers from first chunk
        const lines = chunk.split('\n');
        if (lines.length > 0) {
          const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
          const headerValidation = validateHeaders(headers);
          
          if (!headerValidation.isValid) {
            headerValidation.errors.forEach(errMsg => {
              allErrors.push({
                row: 0,
                field: 'headers',
                value: headers.join(', '),
                message: errMsg,
                type: 'invalid'
              });
            });
          } else {
            headerMap = headerValidation.normalizedHeaders;
            headersValidated = true;
          }
        }
        return chunk;
      },
      
      step: (row, parser) => {
        // Skip processing if headers are invalid
        if (!headersValidated) {
          return;
        }

        const rowIndex = currentRowIndex++;
        const validation = validateRow(row.data, rowIndex, headerMap);
        
        if (validation.record) {
          validRecords.push(validation.record);
        }
        
        if (validation.errors.length > 0) {
          allErrors.push(...validation.errors);
        }
      }
    });
  });
}

/**
 * Validates file before parsing
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
  const validExtensions = ['.csv', '.txt'];
  
  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidType && !hasValidExtension) {
    return {
      valid: false,
      error: 'Please upload a CSV file (.csv extension)'
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 10MB'
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty'
    };
  }

  return { valid: true };
}

/**
 * Formats validation errors for display
 */
export function formatErrors(errors: ValidationError[]): string[] {
  // Group errors by row
  const errorsByRow = errors.reduce((acc, error) => {
    if (!acc[error.row]) {
      acc[error.row] = [];
    }
    acc[error.row].push(error);
    return acc;
  }, {} as Record<number, ValidationError[]>);

  // Format grouped errors
  return Object.entries(errorsByRow).map(([row, rowErrors]) => {
    if (row === '0') {
      return rowErrors.map(e => e.message).join('; ');
    }
    const errorMessages = rowErrors.map(e => 
      `${e.field}: ${e.message}`
    ).join(', ');
    return `Row ${row}: ${errorMessages}`;
  });
}