import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonList, IonItem, IonButton, IonInput, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonLabel, IonCard, IonThumbnail, IonIcon } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { UserFilesComponent } from '../user-files/user-files.component';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, personCircle, barChartOutline, addCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [IonCard, IonLabel, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonInput, IonButton, IonItem, IonList, IonThumbnail, IonIcon, HttpClientModule, CommonModule, UserFilesComponent], // Importamos HttpClientModule aquí
})
export class UserListComponent {
  users: string[] = [];
  files: string[] = [];
  selectedUser: string = '';
  showFiles: boolean = false;  // Para controlar la visibilidad

  constructor(private http: HttpClient) {
    addIcons({ personCircle, barChartOutline, addCircleOutline });
  }

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      const response = await this.http.get<{ name: string }[]>('http://localhost:3001/users').toPromise();
      this.users = response?.map(user => user.name) ?? []; // Extraer solo los nombres de las subcarpetas
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.users = [];
    }
  }

  async loadFiles(user: string) {
    try {
      const response = await this.http.get<string[]>(`http://localhost:3001/files/${user}`).toPromise();
      this.selectedUser = user;
      this.files = response ?? [];
      this.showFiles = true;
    } catch (error) {
      console.error(`Error al cargar archivos del usuario ${user}:`, error);
      this.files = [];
    }
  }

  closeFiles() {
    this.showFiles = false; // Ocultar el componente `user-files`
  }

  async createUser(username: any, inputElement: IonInput) {
    if (!username) {
      alert('El nombre del usuario no puede estar vacío.');
      return;
    }
  
    try {
      const response = await this.http.post('http://localhost:3001/users', { username }).toPromise();
      console.log('Usuario creado:', response);
      alert('Usuario creado exitosamente.');
      const htmlInput = await inputElement.getInputElement();
      htmlInput.value = '';
      await this.loadUsers(); // Actualiza la lista de usuarios
    } catch (error: any) {
      if (error.status === 201) {
        alert('Usuario creado exitosamente.'); // Aceptamos 201 como éxito
        await this.loadUsers(); // Actualiza la lista
      } else {
        console.error('Error al crear usuario:', error);
        alert('No se pudo crear el usuario.');
      }
    }
  }
}
