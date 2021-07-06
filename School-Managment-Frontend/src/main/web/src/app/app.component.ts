import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService, ConfirmationService, DynamicDialogConfig, DynamicDialogRef],
})
export class AppComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }


}
