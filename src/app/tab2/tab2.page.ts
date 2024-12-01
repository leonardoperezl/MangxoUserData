import { Component } from '@angular/core';
import { UploadCsvComponent } from '../upload-csv/upload-csv.component';
import { HttpClientModule } from '@angular/common/http';
import { IonHeader, IonTitle, IonToolbar, IonContent, IonItem, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonContent, IonToolbar, IonTitle, IonHeader, UploadCsvComponent, HttpClientModule],
})
export class Tab2Page {

}
