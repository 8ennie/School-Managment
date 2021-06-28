import { Observable } from 'rxjs';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-scrolling-text',
  template: `
      <div class="container" [style]="{height: height + 'vw'}">
        <div class="scrolling-text" [@scroll]="state" (@scroll.done)="scrollDone()" [style]="{height: height + 'vw', 'font-size': getFontSize()}">
          <div #textContainer class="p-grid p-ai-center p-nogutter" style="height: 100%;">
               {{text}}
          </div>
        </div>
      </div>
    `,
  styles: [`
     .container {
       overflow: hidden;
       position: relative;
       width: 100%;
     }
 
     .scrolling-text {
       position: absolute;
       white-space: nowrap;
     }
   `],
  animations: [
    trigger('scroll', [
      state('on', style({ right: '-100%' })),
      transition('* => *', [
        style({ right: '-100%' }),
        animate(20000, style({ right: '100%' }))
      ])
    ])
  ]
})
export class ScrollingTextComponent  {
  state = 0;
  @Input() text = '';

  @Input() height: number;

  scrollDone() {
    this.state++;
  }

  getFontSize() {
    const fontSize: number = this.height - this.height / 8;
    return fontSize + 'vw';
  }

 
}
