import { CurrentlyShowing, TransportCpmponentConfiguration } from './public-transport.model';

import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-public-transport',
  templateUrl: './public-transport.component.html',
  styleUrls: ['./public-transport.component.scss']
})
export class PublicTransportComponent implements OnChanges {


  // https://www.rmv.de/auskunft/bin/jp/stboard.exe/dn?L=vs_anzeigetafel&cfgfile=FrankfurtM_3001544_1089016653&editorMode=edit
  // https://www.rmv.de/auskunft/bin/jp/stboard.exe/dn?L=vs_anzeigetafel&cfgfile=FrankfurtM_3002599_823575499&editorMode=edit
  // https://www.rmv.de/auskunft/bin/jp/stboard.exe/dn?L=vs_anzeigetafel&cfgfile=FrankfurtM_3001466_156133536&editorMode=edit

  @Input()
  public visible: boolean = true;

  @Input()
  public height: number;

  @Input()
  public page: number = 1;

  @Output()
  public readonly onPageChange: EventEmitter<CurrentlyShowing> = new EventEmitter<CurrentlyShowing>();

  @Output()
  public readonly onConfigChange: EventEmitter<TransportCpmponentConfiguration> = new EventEmitter<TransportCpmponentConfiguration>();

  public stations: Station[];

  constructor(sanitizer: DomSanitizer) {
    this.stations = [
      {
        name: 'Frankfurt (Main) Cassellastraße',
        url: 'https://www.rmv.de/auskunft/bin/jp/stboard.exe/dn?L=vs_anzeigetafel&cfgfile=FrankfurtM_3001544_1089016653&start=1',
        sanitizedUrl: sanitizer.bypassSecurityTrustResourceUrl('https://www.rmv.de/auskunft/bin/jp/stboard.exe/dn?L=vs_anzeigetafel&cfgfile=FrankfurtM_3001544_1089016653&start=1')
      },
      {
        name: 'Frankfurt (Main) Mainkur Bahnhof', url: 'https://www.rmv.de/auskunft/bin/jp/stboard.exe/dn?L=vs_anzeigetafel&cfgfile=FrankfurtM_3002599_823575499&start=1',
        sanitizedUrl: sanitizer.bypassSecurityTrustResourceUrl('https://www.rmv.de/auskunft/bin/jp/stboard.exe/dn?L=vs_anzeigetafel&cfgfile=FrankfurtM_3002599_823575499&start=1')
      },
      {
        name: 'Frankfurt (Main) Steinauer Straße', url: 'https://www.rmv.de/auskunft/bin/jp/stboard.exe/dn?L=vs_anzeigetafel&cfgfile=FrankfurtM_3001466_156133536&start=1',
        sanitizedUrl: sanitizer.bypassSecurityTrustResourceUrl('https://www.rmv.de/auskunft/bin/jp/stboard.exe/dn?L=vs_anzeigetafel&cfgfile=FrankfurtM_3001466_156133536&start=1')
      }
    ];
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.page && this.page) {
      this.onPageChange.emit({ total: this.stations.length, currentlyShowing: Array.from(Array(this.stations.length).keys()).filter(i => this.show(i)) });
    }
    if (changes.height && this.height) {
      this.onConfigChange.emit({ total: this.stations.length, showOnPage: Math.floor(this.height / 350) });
    }
  }

  public show(i: number): boolean {
    const canBeShown = Math.floor(this.height / 350);
    if (this.page * canBeShown > i && (this.page - 1) * canBeShown - 1 < i) {
      return true;
    }
    return false;
  }

}

class Station {
  name: string;
  url: string;
  sanitizedUrl: SafeResourceUrl;
}
