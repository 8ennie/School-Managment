import { Component, OnInit } from '@angular/core';
import { PhotoShowService } from './photo-show.service';
import { HeaderService } from 'src/app/header/header.service';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-photo-show',
  templateUrl: './photo-show.component.html',
  styleUrls: ['./photo-show.component.css']
})
export class PhotoShowComponent implements OnInit {

  id;
  showParts  = [];

  constructor(
    private showService: PhotoShowService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe((parms: Params) => {
      this.id = parms['id'];
    });
    this.headerService.showHeader.next(false);

    if(this.id == 'sub'){
      this.showService.getCurrentSubstitutionShow().then((showParts:any) => {
        console.log(showParts);
        this.showParts = showParts;
        console.log(this.showParts);
      });;
    } else {
      this.showService.getShowShowParts(this.id).subscribe((showParts:any) => {
        console.log(showParts);
        this.showParts = showParts._embedded.showParts;
        console.log(this.showParts);
      });
    }
  }

  getImage(showPart){
    return 'data:image/JPEG;base64,' + showPart.image;
  }


  getHeight(){
    return window.innerHeight - 50;
  }

}