import { environment } from 'src/environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, filter, first } from 'rxjs/operators';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {

  private client: Client;
  private state: BehaviorSubject<SocketClientState>;


  private observers: { topic: string, observable: Observable<any> }[] = [];


  constructor() {
    this.client = new Client();

    var baseUrl;
    if (environment.production) {
      var getUrl = window.location;
      baseUrl = getUrl.protocol + "//" + getUrl.host;
    } else {
      baseUrl = 'http://localhost:8080';
    }

    this.client.webSocketFactory = () => { return new SockJS(baseUrl + '/api/socket') };

    this.client.onConnect = (frame) => {

      if (this.state.getValue() == SocketClientState.CONNECTED) {
        location.reload();
      }
      this.state.next(SocketClientState.CONNECTED);

    };
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.client.reconnectDelay = 10000;
    this.client.debug = (str) => {
      // console.log(str);
    }

    this.client.onDisconnect = () => {
      console.log("The Socket is closing");
    }

    this.client.onStompError = (frame) => {
      console.log('Broker reported error: ' + frame.headers['message']);
      console.log('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  ngOnDestroy(): void {
    this.client.deactivate();
    this.observers = [];
  }

  private connect(): Observable<Client> {
    return new Observable<Client>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
        observer.next(this.client);
      });
    });
  }

  private getMessageObservable(topic: string, handler = WebsocketService.jsonHandler): Observable<any> {
    return this.connect().pipe(first(), switchMap(inst => {
      return new Observable<any>(observer => {
        const subscription: StompSubscription = this.client.subscribe(topic, message => {
          observer.next(handler(message));
        });
        return () => inst.unsubscribe(subscription.id);
      });
    }));
  }

  public onMessage(topic: string, handler = WebsocketService.jsonHandler): Observable<any> {
    const observable = this.getMessageObservable(topic, handler);
    this.observers.push({ topic: topic, observable: observable });
    return observable;
  }

  public send(topic: string, payload: any): void {
    this.client.publish({ destination: topic, body: JSON.stringify(payload) })
  }

  public static jsonHandler(message: Message): any {
    return JSON.parse(message.body);
  }

  public static textHandler(message: Message): string {
    return message.body;
  }
}

export enum SocketClientState {
  ATTEMPTING, CONNECTED
}
