import { map, share } from 'rxjs/operators';
import { Subscription, timer } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { clockEvents, ClockEvent } from './clock.event';


@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
})
export class ClockComponent implements OnInit, OnDestroy {

  public display = true;
  public rxTime = new Date();

  public message: string = '';
  private subscription: Subscription;

  private clockEvents = clockEvents;

  width: number = window.innerWidth;

  constructor() { }

  ngOnInit(): void {
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        this.rxTime = time;

        if (this.rxTime.getSeconds() == 0) {
          let setMessage = false;
          clockEvents.forEach((event: ClockEvent) => {
            if (event.time.minutes == this.rxTime.getMinutes() && event.time.hours == this.rxTime.getHours()) {
              this.message = event.message;
              setMessage = true;
            }
          })
          if (!setMessage) {
            this.message = null;
          }
        }




      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
