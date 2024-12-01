import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonLabel, IonButton } from "@ionic/angular/standalone";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonInput, IonItem, IonContent, IonTitle, IonToolbar, IonHeader, FormsModule, HttpClientModule]
})
export class SignupComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const newUser = { username: this.username, password: this.password };

    this.http.post('http://localhost:3000/users', newUser).subscribe(
      (response) => {
        alert('Usuario registrado exitosamente');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error al registrar usuario:', error);
        alert('Hubo un problema al registrar el usuario.');
      }
    );
  }
}
