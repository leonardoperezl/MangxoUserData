import { Component, Input } from '@angular/core';
import { IonList, IonItem, IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonLabel, IonThumbnail, IonIcon } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { PhotoService } from '../photo.service';
import { documentOutline, downloadOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-user-files',
  templateUrl: './user-files.component.html',
  styleUrls: ['./user-files.component.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCard, IonButton, IonItem, IonList, CommonModule, HttpClientModule]
})
export class UserFilesComponent {
  @Input() selectedUser: string = '';
  @Input() files: string[] = [];

  constructor(private http: HttpClient, private photoService: PhotoService) {
    addIcons({ documentOutline, downloadOutline });
  }

  downloadFile(file: string) {
    const downloadUrl = `http://localhost:3001/download/${this.selectedUser}/${file}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file;
    a.click();
  }

  async loadFiles(user: string) {
    try {
      const response = await this.http.get<string[]>(`http://localhost:3001/files/${user}`).toPromise();
      this.files = response ?? []; // Actualiza la lista de archivos con los nuevos datos
    } catch (error) {
      console.error(`Error al cargar archivos del usuario ${user}:`, error);
      this.files = []; // Asegura que no haya datos antiguos en caso de error
    }
  }

  async uploadFile(file: File) {
    if (!file) {
      window.alert('Por favor selecciona un archivo.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      await this.http.post(`http://localhost:3001/upload/${this.selectedUser}`, formData).toPromise();
      window.alert('Archivo subido exitosamente.');
      await this.loadFiles(this.selectedUser); // Actualiza la lista de archivos
    } catch (error) {
      console.error('Error al subir archivo:', error);
      window.alert('No se pudo subir el archivo.');
    }
  }

  onFileSelect(fileInput: HTMLInputElement | null) {
    if (fileInput?.files?.length) {
      this.uploadFile(fileInput.files[0]); // Pasa el archivo seleccionado
    } else {
      alert('Por favor selecciona un archivo.');
    }
  }

  async takeAndSavePhoto() {
    const photo = await this.photoService.takePhoto();
    if (!photo) {
      window.alert('No se pudo tomar la foto.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.dataURLtoBlob(photo.dataUrl), photo.fileName);
  
    try {
      await this.http.post(`http://localhost:3001/upload/${this.selectedUser}`, formData).toPromise();
      window.alert('Foto guardada exitosamente.');
      await this.loadFiles(this.selectedUser); // Recargar la lista de archivos
    } catch (error) {
      console.error('Error al guardar la foto:', error);
      window.alert('No se pudo guardar la foto.');
    }
  }
  
  // Convierte la URL base64 a Blob
  private dataURLtoBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
}
