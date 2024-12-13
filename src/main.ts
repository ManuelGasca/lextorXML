import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { XmlProcessorComponent } from './app/components/xml-processor/xml-processor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [XmlProcessorComponent],
  template: `
    <div class="app-container">
      <h1>Procesador de XML CFDI</h1>
      <app-xml-processor></app-xml-processor>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 30px;
    }
  `]
})
export class App {}

bootstrapApplication(App);