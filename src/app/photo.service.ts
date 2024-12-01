import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor() {}

  // Método para capturar una foto
  async takePhoto(): Promise<{ dataUrl: string; fileName: string } | null> {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl, // Captura como base64
        source: CameraSource.Camera, // Usa la cámara
        quality: 90, // Calidad de la foto
      });

      const fileName = `photo_${new Date().getTime()}.jpg`;

      return {
        dataUrl: photo.dataUrl || '',
        fileName,
      };
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      return null;
    }
  }
}

