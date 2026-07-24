"use client";

import { useCallback, useState } from "react";
import { useImport } from "../_hooks/useImport";
import { UploadCloud, File, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImportDropzone() {
  const { phase, handleFileUpload, file, reset } = useImport();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    setError(null);
    const validTypes = [
      "text/csv", 
      "application/vnd.ms-excel", 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ""
    ];
    
    const isValidExt = file.name.endsWith('.csv') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx');

    if (!isValidExt) {
      setError("Please upload a valid CSV or Excel file.");
      return false;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("File size exceeds the 25MB maximum.");
      return false;
    }

    return true;
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      if (validateFile(selectedFile)) {
        handleFileUpload(selectedFile);
      }
    }
  }, [handleFileUpload]);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        handleFileUpload(selectedFile);
      }
    }
  };

  if (phase !== "SELECT_FILE") {
    return (
      <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <File className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">{file?.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file?.size ? file.size / 1024 : 0).toFixed(2)} KB
            </p>
          </div>
        </div>
        <button
          onClick={reset}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors duration-200",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
        )}
      >
        <input
          type="file"
          accept=".csv, .xls, .xlsx"
          onChange={onFileInputChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="rounded-full bg-muted p-4">
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="font-semibold tracking-tight">Click or drag file to this area to upload</h3>
          <p className="text-sm text-muted-foreground">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other band files.
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
          <span>CSV or XLSX</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>Maximum 25MB</span>
        </div>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
