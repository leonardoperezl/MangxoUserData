import { Component } from '@angular/core';
import { UserListComponent } from '../user-list/user-list.component';
import { IonHeader, IonTitle, IonToolbar, IonContent } from "@ionic/angular/standalone";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonContent, IonToolbar, IonTitle, IonHeader, UserListComponent, HttpClientModule],
})
export class Tab1Page {}
