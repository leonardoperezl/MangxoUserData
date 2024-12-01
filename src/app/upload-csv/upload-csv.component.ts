import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonItem, IonButton } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss'],
  standalone: true,
  imports: [IonButton, IonItem, CommonModule]
})
export class UploadCsvComponent {
  imageUrl: string | null = null;

  constructor(private http: HttpClient) {}

  async uploadCSV(fileInput: HTMLInputElement | null) {
    if (!fileInput?.files?.length) {
      alert('Por favor selecciona un archivo.');
      return;
    }
  
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response: any = await this.http.post('http://localhost:3001/generate-graph', formData).toPromise();
      this.imageUrl = `http://localhost:3001${response.imageUrl}`; // Ruta completa de la gráfica
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('No se pudo generar la gráfica.');
    }
  }
}
