import { MessageService } from './../../../message/message.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-banner',
  templateUrl: './message-banner.component.html',
  providers: [MessageService],
  styleUrls: ['./message-banner.component.scss']
})
export class MessageBannerComponent implements OnInit {

  display: boolean;
  width: number = window.innerWidth;
  message = '';

  showDialog() {
    this.display = true;
  }

  constructor(
    private messageService: MessageService,
  ) { 
    this.showDialog();
  }

  ngOnInit(): void {
    this.messageService.message.subscribe((message) => {
      console.log("The Message is here");
      
      if (message.length > 0) {
        this.display = true;
      } else {
        this.display = false;
      }
      this.message = message;
    });
  }

  sendMessage(){
    this.messageService.send({category:"Test", message:"Test123"});
  }

}
