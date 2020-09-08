import { Message } from './message.model';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MessageService {

  private _message: BehaviorSubject<string> = new BehaviorSubject('');

  public readonly message: Observable<string> = this._message.asObservable();

  constructor(
    private http: HttpClient,
  ) {
  }
  public stompClient;

  initializeWebSocketConnection() {
    const serverUrl = environment.apiUrl + 'socket';

    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.Stomp.over(ws);
    const _that = this;

    this.stompClient.connect({}, () => {
      _that.stompClient.subscribe('/message', (message) => {
        if (message.body) {
          _that._message.next(message.body);
        }
      });
    });
    this.http.get<any>(environment.apiUrl + 'message/current').toPromise().then(message => {
      if(message){
        console.log('The last Message was:' + message.message);
        _that._message.next(message.message);
      }
    });
  }

  sendMessage(message: Message) {
    this.stompClient.send('/app/send/message', {}, message);
  }

}
