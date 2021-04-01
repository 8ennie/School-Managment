import { ImageShow } from 'src/app/image-show/image-show.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-show',
  templateUrl: './edit-show.component.html',
  styleUrls: ['./edit-show.component.scss']
})
export class EditShowComponent implements OnInit {

  public imageShowResourceUrl: string;

  constructor(
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.imageShowResourceUrl = params.imageShowRessource;
    });
  }

  public editImageShow(resourceUrl: string): void {
    this.router.navigate([], {
      queryParams: { imageShowRessource: resourceUrl },
      relativeTo: this.activeRoute
    });
  }

  public onImageShowSaved(imageShow: ImageShow) {
    this.imageShowResourceUrl = imageShow.resourceUrl
    this.router.navigate(['photoshow', 'edit'], { queryParams: { imageShowRessource: imageShow.resourceUrl } });
  }


}
