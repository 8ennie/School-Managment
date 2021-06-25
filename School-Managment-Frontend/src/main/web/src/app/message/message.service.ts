import { Message } from './message.model';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MessageService implements OnDestroy {

  private _message: BehaviorSubject<string> = new BehaviorSubject('');

  public readonly message: Observable<string> = this._message.asObservable();

  webSocketEndPoint: string = environment.apiUrl + 'socket';
  topic: string = "/message/sent";
  stompClient: any;

  constructor(private readonly http: HttpClient,) {
    this.connect();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    this.stompClient.connect({}, (frame) => {
      _this.stompClient.subscribe(_this.topic, (sdkEvent) => {
        _this.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  };

  private disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  private errorCallBack(error) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  /**
   * Send message to sever via web socket
   * @param {*} message 
   */
  public send(message: Message): void {
    console.log("calling logout api via web socket");
    if (this.stompClient) {
      this.stompClient.send("/app/send/message", {}, JSON.stringify(message));
    } else {
      console.log("Couldnt send Message");
    }
  }

  private onMessageReceived(message: Message): void {
    console.log("Message Recieved from Server :: " + message);
    this._message.next(message.message);
  }
}
