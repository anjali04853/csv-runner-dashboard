// components/error-display.tsx
'use client';

import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ValidationError } from '@/types';
import { formatErrors } from '@/lib/csv-parser';

interface ErrorDisplayProps {
  errors: ValidationError[];
  warnings: string[];
  onDismiss?: () => void;
}

export function ErrorDisplay({ errors, warnings, onDismiss }: ErrorDisplayProps) {
  if (errors.length === 0 && warnings.length === 0) {
    return null;
  }

  const formattedErrors = formatErrors(errors);
  const showDismiss = errors.length === 0 && warnings.length > 0;

  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between">
            <span>Validation Errors Found</span>
            <Badge variant="destructive">{errors.length} errors</Badge>
          </AlertTitle>
          <AlertDescription>
            <p className="mb-3">
              Please fix the following issues in your CSV file:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {formattedErrors.slice(0, 10).map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
            {formattedErrors.length > 10 && (
              <p className="mt-2 text-sm italic">
                ... and {formattedErrors.length - 10} more errors
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {warnings.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                Data Quality Warnings
              </span>
              {showDismiss && onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onDismiss}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
              {warnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}