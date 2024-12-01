import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, HttpClientModule, FormsModule],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      (users) => {
        const user = users.find(
          (u) => u.username === this.username && u.password === this.password
        );
  
        if (user) {
          alert('Inicio de sesión exitoso');
          this.router.navigate(['/tabs']); // Navega a Tabs
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      },
      (error) => {
        console.error('Error al conectarse al servidor:', error);
        alert('Hubo un problema al conectarse al servidor.');
      }
    );
  }
}