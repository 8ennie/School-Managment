import { Message } from './../message.model';
import { MessageService } from './../message.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-send-message',
  providers: [MessageService],
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnChanges {

  @Input()
  area: string;

  messageForArea: string;
  initalMessage: string;

  constructor(
    private messageService: MessageService,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.area) {
      this.messageService.getMessageForArea(this.area).then(
        (message: Message) => {
          if (message) {
            this.messageForArea = message.message;
            this.initalMessage = message.message;
          } else {
            this.messageForArea = '';
            this.initalMessage = '';
          }
        }
      );
    }
  }

  sendMessage() {
    const message = this.initalMessage == this.messageForArea ? '' : this.messageForArea;

    this.messageService.send({ "message": message, "area": this.area });
    this.messageForArea = message;
    this.initalMessage = message;

  }

}
