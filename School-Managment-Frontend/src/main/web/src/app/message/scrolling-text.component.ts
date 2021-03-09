import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-scrolling-text',
    template: `
      <div class="con" [style]="{height: height} " >
        <div class="scrolling-text" [@scroll]="state" (@scroll.done)="scrollDone()">{{text}}</div>
      </div>
    `,
    styles: [`
      .con {
        overflow: hidden;
        position: relative;
        width:100%;
      }

      .scrolling-text {
        position: absolute;
        white-space: nowrap;
        font-size: 50px;
        font-family: "Trebuchet MS", Helvetica, sans-serif
      }
    `],
    animations: [
        trigger('scroll', [
            state('on', style({ right: '-100px' })),
            transition('* => *', [
                style({ right: '-100px' }),
                animate(20000, style({ right: '100%' }))
            ])
        ])
    ]
})
export class ScrollingTextComponent {
    state = 0;
    @Input() text = '';
    @Input() height = '80px';
    scrollDone() {
        this.state++;
    }
}
