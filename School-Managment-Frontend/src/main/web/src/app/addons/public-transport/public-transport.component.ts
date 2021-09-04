import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-public-transport',
  templateUrl: './public-transport.component.html',
  styleUrls: ['./public-transport.component.scss']
})
export class PublicTransportComponent implements OnInit {

  // https://www.rmv.de/auskunft/bin/jp/stboard.exe/dn?L=vs_anzeigetafel&cfgfile=FrankfurtM_3001544_1089016653&editorMode=edit
  // https://www.rmv.de/auskunft/bin/jp/stboard.exe/dn?L=vs_anzeigetafel&cfgfile=FrankfurtM_3002599_823575499&editorMode=edit
  // https://www.rmv.de/auskunft/bin/jp/stboard.exe/dn?L=vs_anzeigetafel&cfgfile=FrankfurtM_3001466_156133536&editorMode=edit

  @Input()
  public height: number;

  constructor() { }

  ngOnInit(): void {
  }

}
