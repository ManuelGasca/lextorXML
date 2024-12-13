import { Injectable } from '@angular/core';
import { ProcessingStats, ProcessingConfig, ValidationResult } from '../models/xml-processor.model';

@Injectable({
  providedIn: 'root'
})
export class XmlProcessorService {
  validateRfc(rfc: string): ValidationResult {
    if (!rfc) {
      return { isValid: false, message: 'RFC es requerido' };
    }

    const rfcRegex = /^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/;
    if (!rfcRegex.test(rfc)) {
      return { 
        isValid: false, 
        message: 'RFC inválido. Debe tener 12 caracteres para personas morales o 13 para personas físicas' 
      };
    }

    return { isValid: true, message: '' };
  }

  async processXmlFiles(files: FileList, config: ProcessingConfig): Promise<ProcessingStats> {
    const stats: ProcessingStats = {
      totalFiles: 0,
      successfulFiles: 0,
      errorFiles: 0,
      errors: []
    };

    // Verificar que haya archivos seleccionados
    if (!files || files.length === 0) {
      stats.errors.push('No se seleccionaron archivos');
      return stats;
    }

    stats.totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.name.toLowerCase().endsWith('.xml')) {
        stats.errorFiles++;
        stats.errors.push(`${file.name} no es un archivo XML`);
        continue;
      }

      try {
        const content = await this.readFile(file);
        const modifiedContent = this.modifyXmlContent(content, config);
        await this.saveModifiedFile(file.name, modifiedContent);
        stats.successfulFiles++;
      } catch (error:any) {
        stats.errorFiles++;
        stats.errors.push(`Error procesando ${file.name}: ${error.message}`);

      }
    }

    return stats;
  }

  private modifyXmlContent(content: string, config: ProcessingConfig): string {
    const receptorRegex = /(<cfdi:Receptor[^>]*)(Rfc="[^"]*")(.*?)(Nombre="[^"]*")(.*?>)/g;
    return content.replace(receptorRegex, 
      (match, start, oldRfc, middle, oldName, end) => 
        `${start}Rfc="${config.newRfc}"${middle}Nombre="${config.newName}"${end}`
    );
  }

  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error('Error leyendo archivo'));
      reader.readAsText(file);
    });
  }

  private async saveModifiedFile(fileName: string, content: string): Promise<void> {
    const blob = new Blob([content], { type: 'text/xml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `XML_Modificados/${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}