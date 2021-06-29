import { OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Message } from './../../message/message.model';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'src/app/message/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-banner',
  templateUrl: './message-banner.component.html',
  styleUrls: ['./message-banner.component.scss']
})
export class MessageBannerComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  public area: string;

  public display: boolean = false;
  public width: number = window.innerWidth;
  public message = '';

  private messageSub: Subscription;

  showDialog(): void {
    this.display = true;
  }

  constructor(
    private readonly messageService: MessageService,
  ) {

  }
  ngOnDestroy(): void {
    if (this.messageSub) {
      this.messageSub.unsubscribe();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.area) {
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
    this.messageSub = this.messageService.message.subscribe((message: Message) => {
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
