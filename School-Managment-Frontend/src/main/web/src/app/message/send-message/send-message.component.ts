import { MessageService } from './../message.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-send-message',
  providers: [MessageService],
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {


  messages = [];
  selectedMessage;
  rowGroupMetadata: any;

  constructor(
    private messageServicce: MessageService,
  ) { }

  ngOnInit(): void {
  }

  onRowSelect(event) {

  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.messages) {
      for (let i = 0; i < this.messages.length; i++) {
        let rowData = this.messages[i];
        let category = rowData.brand;
        if (i == 0) {
          this.rowGroupMetadata[category] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.messages[i - 1];
          let previousRowGroup = previousRowData.brand;
          if (category === previousRowGroup)
            this.rowGroupMetadata[category].size++;
          else
            this.rowGroupMetadata[category] = { index: i, size: 1 };
        }
      }
    }
  }
}
