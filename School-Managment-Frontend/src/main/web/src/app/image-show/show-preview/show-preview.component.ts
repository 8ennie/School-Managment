import { ShowPartService } from './../show-part/show-part.service';
import { ImageShowService } from './../image-show.service';
import { ShowPart } from './../show-part/show-part.model';
import { ImageShow } from './../image-show.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-show-preview',
  templateUrl: './show-preview.component.html',
  styleUrls: ['./show-preview.component.scss']
})
export class ShowPreviewComponent implements OnInit {

  @Input()
  height: number;

  @Input()
  imageShowResorceUrl: string;

  imageShow: ImageShow;

  showParts: ShowPart[] = [];

  displayTime: number = 6000;

  constructor(
    private readonly imageShowService: ImageShowService,
    private readonly showPartService: ShowPartService,
  ) { }

  ngOnInit(): void {
    if (this.imageShowResorceUrl) {
      this.imageShowService
        .getImageShow(this.imageShowResorceUrl)
        .then((imageShow: ImageShow) => {
          this.imageShow = imageShow;
          this.showPartService
            .getShowPartsFromImageShow(imageShow.resourceUrl)
            .then((showParts: ShowPart[]) => {
              this.showParts = showParts.filter(sp => sp.active);
            });
        });
    }
  }

  public getImage(image: string) {
    return "data:image/JPEG;base64," + image;
  }

  public getHeight(): number {
    return this.height;
  }
}
