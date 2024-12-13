import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { XmlProcessorService } from '../../services/xml-processor.service';
import { ProcessingStats, ValidationResult } from '../../models/xml-processor.model';

@Component({
  selector: 'app-xml-processor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Procesador de XML</h2>
      
      <div class="form-group">
        <label for="fileInput">Seleccionar carpeta con archivos XML:</label>
        <input 
          type="file" 
          id="fileInput" 
          (change)="onFileSelect($event)"
          webkitdirectory 
          multiple
          class="form-control">
      </div>

      <div class="form-group">
        <label for="rfc">Nuevo RFC:</label>
        <input 
          type="text" 
          id="rfc" 
          [(ngModel)]="newRfc" 
          (blur)="validateRfc()"
          class="form-control">
        <div *ngIf="rfcValidation && !rfcValidation.isValid" class="error-message">
          {{ rfcValidation.message }}
        </div>
      </div>

      <div class="form-group">
        <label for="name">Nuevo Nombre:</label>
        <input 
          type="text" 
          id="name" 
          [(ngModel)]="newName"
          class="form-control">
      </div>

      <button 
        (click)="processFiles()" 
        [disabled]="!canProcess()"
        class="btn-process">
        Procesar Archivos
      </button>

      <div *ngIf="stats" class="results">
        <h3>Resultados del Procesamiento:</h3>
        <p>Total de archivos: {{ stats.totalFiles }}</p>
        <p>Archivos procesados exitosamente: {{ stats.successfulFiles }}</p>
        <p>Archivos con errores: {{ stats.errorFiles }}</p>
        
        <div *ngIf="stats.errors.length > 0" class="errors">
          <h4>Errores encontrados:</h4>
          <ul>
            <li *ngFor="let error of stats.errors">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-control {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .btn-process {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-process:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .error-message {
      color: red;
      font-size: 0.9em;
      margin-top: 5px;
    }

    .results {
      margin-top: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .errors {
      margin-top: 15px;
      color: red;
    }
  `]
})
export class XmlProcessorComponent {
  newRfc: string = '';
  newName: string = '';
  selectedFiles: FileList | null = null;
  stats: ProcessingStats | null = null;
  rfcValidation: ValidationResult | null = null;

  constructor(private xmlProcessor: XmlProcessorService) {}

  onFileSelect(event: any) {
    this.selectedFiles = event.target.files;
  }

  validateRfc() {
    this.rfcValidation = this.xmlProcessor.validateRfc(this.newRfc);
  }

  canProcess(): boolean {
    return !!(
      this.selectedFiles && 
      this.selectedFiles.length > 0 && 
      this.newRfc && 
      this.newName && 
      (!this.rfcValidation || this.rfcValidation.isValid)
    );
  }

  async processFiles() {
    if (!this.selectedFiles || !this.newRfc || !this.newName) {
      return;
    }

    this.stats = await this.xmlProcessor.processXmlFiles(
      this.selectedFiles,
      { newRfc: this.newRfc, newName: this.newName }
    );
  }
}