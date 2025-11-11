// components/csv-uploader.tsx
'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseCSVFile, validateFile, formatErrors } from '@/lib/csv-parser';
import { ParseResult } from '@/types';

interface CSVUploaderProps {
  onDataParsed: (result: ParseResult) => void;
}

export function CSVUploader({ onDataParsed }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setFileError(null);
    setFileName(file.name);
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setFileError(validation.error || 'Invalid file');
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await parseCSVFile(file);
      onDataParsed(result);
    } catch (error) {
      setFileError('An unexpected error occurred while processing the file');
      console.error('CSV parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onDataParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="rounded-full bg-primary/10 p-6 mb-4">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            ) : (
              <Upload className="h-12 w-12 text-primary" />
            )}
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {isProcessing ? 'Processing CSV...' : 'Upload Running Data'}
          </h3>
          
          <p className="text-muted-foreground text-center mb-6 max-w-sm">
            Drag and drop your CSV file here, or click to browse.
            File should contain: date, person, miles run
          </p>
          
          <label htmlFor="file-upload">
            <Button 
              variant="default" 
              disabled={isProcessing}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <FileText className="mr-2 h-4 w-4" />
              Choose File
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.txt"
              onChange={handleFileInput}
              className="hidden"
              disabled={isProcessing}
            />
          </label>
          
          {fileName && !fileError && (
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              {fileName}
            </div>
          )}
        </CardContent>
      </Card>

      {fileError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}