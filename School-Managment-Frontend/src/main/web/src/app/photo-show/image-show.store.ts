import { ImageShow } from './image-show.model';
import { ImageShowService } from './image-show.service';
import { List } from 'immutable';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({providedIn:'root'})
export class ImageShowStore {
    private _imageShows: BehaviorSubject<List<ImageShow>> = new BehaviorSubject(List([]));
    public readonly imageShows: Observable<List<ImageShow>> = this._imageShows.asObservable();

    private _imageShowsFiltered: BehaviorSubject<List<ImageShow>> = new BehaviorSubject(List([]));
    public readonly imageShowsFiltered: Observable<List<ImageShow>> = this._imageShowsFiltered.asObservable();

    constructor(private imageShowService: ImageShowService) {
        this.loadInitialData();
    }

    loadInitialData() {
        this.imageShowService.getAllImageShows()
            .then(
                (res) => {
                    let imageShows = res;
                    this._imageShows.next(List(imageShows));
                },
                err => console.log("Error retrieving ImageShowes")
            );
    }

    filterForArea(area:string){
        this.imageShowService.getImageShowsFiltered(area).then(
            (res: {_embedded}) => {
                let imageShows = res._embedded.imageShows;
                this._imageShowsFiltered.next(List(imageShows));
            },
            err => console.log("Error retrieving ImageShowes")
        );
    }


    addImageShow2(file) {
        let obs = this.imageShowService.saveImageShow2(file);

        obs.then(
            res => {
                if(res){
                    var id: number = res.id;
                    this.imageShowService.getImageShow(id.toString()).then((imageShow: ImageShow) => {
                        let imageShows: List<ImageShow> = this._imageShows.getValue();
                        let index = imageShows.findIndex((i) => i.id === imageShow.id);
                        this._imageShows.next(imageShows.update(index, () => imageShow));
                    });
                }
            });

        return obs;
    }


    addImageShow(newImageShow: ImageShow) {
        let obs = this.imageShowService.saveImageShow(newImageShow);

        obs.then(
            res => {
                if(res){
                    var id: number = res._links.self.href.split('/').pop();
                    this.imageShowService.getImageShow(id.toString()).then((imageShow: ImageShow) => {
                        this._imageShows.next(this._imageShows.getValue().push(imageShow));
                    });
                }
            });

        return obs;
    }

    deleteImageShow(deleted: ImageShow) {
        let obs = this.imageShowService.deleteImageShow(deleted);
        obs.then(
            res => {
                let imageShows: List<ImageShow> = this._imageShows.getValue();
                let index = imageShows.findIndex((imageShow) => imageShow.id === deleted.id);
                this._imageShows.next(imageShows.delete(index));
            }
        );

        return obs;
    }

    updateImageShow(updateRole: ImageShow) {
        let obs = this.imageShowService.updateImageShow(updateRole);

        obs.then(
            (res: ImageShow) => {
                var id: number = res._links.self.href.split('/').pop();
                this.imageShowService.getImageShow(id.toString()).then((imageShow: ImageShow) => {
                    let imageShows: List<ImageShow> = this._imageShows.getValue();
                    let index = imageShows.findIndex((i) => i.id === imageShow.id);
                    this._imageShows.next(imageShows.update(index, () => imageShow));
                });
            }
        );
        return obs;
    }

    get(id){
        return this.imageShowService.getImageShow(id);
    }
}