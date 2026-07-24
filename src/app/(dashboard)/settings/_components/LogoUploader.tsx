"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogoUploaderProps {
  value?: string;
  onChange: (url: string | undefined) => void;
}

export function LogoUploader({ value, onChange }: LogoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, SVG)");
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    // Mock upload: create local object URL
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  const handleRemove = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {value ? (
        <div className="relative inline-flex h-32 w-32 items-center justify-center rounded-lg border border-border bg-muted p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Logo" className="max-h-full max-w-full object-contain" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/50 p-4 transition-colors hover:bg-muted",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          )}
        >
          <div className="rounded-full bg-background p-2 shadow-sm">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Click or drag and drop</p>
            <p className="text-xs text-muted-foreground">PNG, JPG or SVG (Max 2MB)</p>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/svg+xml"
        onChange={handleFileChange}
      />
    </div>
  );
}
