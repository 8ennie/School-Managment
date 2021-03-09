
import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';

@Component({
  selector: 'app-message',
  providers: [MessageService],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  display: boolean;
  width: number = window.innerWidth;
  message = '';

  showDialog() {
      this.display = true;
  }

  constructor(
   private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.messageService.message.subscribe((message) => {
      if (message.length > 0) {
        this.display = true;
      } else {
        this.display = false;
      }
      this.message = message;
    });
  }

}
