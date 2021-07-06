import { Observable } from 'rxjs';
import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition, query, AnimationBuilder, AnimationPlayer } from '@angular/animations';

@Component({
  selector: 'app-scrolling-text',
  template: `
      <div #mainContainer class="container" [style]="{height: height + 'vw'}">
        <div  class="scrolling-text"  [style]="{height: height + 'vw', 'font-size': getFontSize()}">
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
export class ScrollingTextComponent implements AfterViewInit, OnChanges {


  @ViewChild('textContainer')
  public textContainer;

  @ViewChild('mainContainer')
  public mainContainer;

  public player: AnimationPlayer;

  constructor(public builder: AnimationBuilder) {

  }

  ngAfterViewInit(): void {
    if (this.textContainer) {
      this.start();
    }

  }

  private start(): void {

    if (this.player) {
      this.player.destroy();
    }

    // this makes instructions on how to build the animation
    const factory = this.builder.build([
      style({ transform: 'translateX(' + this.mainContainer?.nativeElement.clientWidth + 'px)' }),
      animate('12000ms', style({ transform: 'translateX(-' + this.textContainer?.nativeElement.clientWidth + 'px)' }))
    ]);

    // this creates the animation
    this.player = factory.create(this.textContainer?.nativeElement, {});
    // start it off
    this.player.play();
    this.player.onDone(() => this.start());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.text) {
      if (this.textContainer) {
        this.start();
      }
    }
  }
  @Input() text = '';

  @Input() height: number;

  getFontSize() {
    const fontSize: number = this.height - this.height / 8;
    return fontSize + 'vw';
  }


}
