import { OnChanges, SimpleChanges } from '@angular/core';
import { Message } from './../../message/message.model';
import { MessageService } from '../../message/message.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-banner',
  templateUrl: './message-banner.component.html',
  styleUrls: ['./message-banner.component.scss']
})
export class MessageBannerComponent implements OnInit, OnChanges {

  @Input()
  area: string;

  display: boolean = false;
  width: number = window.innerWidth;
  message = '';

  showDialog() {
    this.display = true;
  }

  constructor(
    private messageService: MessageService,
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.area) {
      console.log(changes.area);

      if (this.area) {
        this.messageService.getMessageForArea(this.area).then(
          (message: Message) => {
            if (message) {
              this.loadMessage(message.message);
            }
          }
        );
      }
    }
  }

  ngOnInit(): void {
    this.messageService.message.subscribe((message: Message) => {
      if (message) {
        if (message?.area == this.area) {
          this.loadMessage(message.message);
        }
      }
    });
  }

  private loadMessage(message: string): void {
    if (message) {
      this.display = true;
    } else {
      this.display = false;
    }
    this.message = message;
  }

}
