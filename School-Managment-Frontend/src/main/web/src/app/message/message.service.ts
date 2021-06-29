import { WebsocketService } from 'src/app/_services/websocket.service';
import { Message } from './message.model';
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable(
  { providedIn: 'root' }
)
export class MessageService implements OnDestroy {

  private _message: BehaviorSubject<Message> = new BehaviorSubject(null);

  public readonly message: Observable<Message> = this._message.asObservable();

  sendTopic: string = "/app/send/message";
  reviceTopic: string = "/message";

  private websocketSub: Subscription;

  constructor(private readonly http: HttpClient, private readonly webSocketService: WebsocketService) {
    this.websocketSub = webSocketService.onMessage(this.reviceTopic).subscribe((message) => this._message.next(message));
  }

  ngOnDestroy(): void {
    if (this.websocketSub) {
      this.websocketSub.unsubscribe();
    }
  }

  /**
   * Send message to sever via web socket
   * @param {*} message 
   */
  public send(message: Message): void {
    this.webSocketService.send(this.sendTopic, message);
  }

  public getMessageForArea(area: string): Promise<Message | null> {
    return this.http.get<Message>(environment.apiUrl + 'areas/' + area + '/messages').toPromise();
  }
}
