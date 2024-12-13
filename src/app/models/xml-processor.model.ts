export interface ProcessingStats {
  totalFiles: number;
  successfulFiles: number;
  errorFiles: number;
  errors: string[];
}

export interface ProcessingConfig {
  newRfc: string;
  newName: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}