import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class HeaderService {
    public showHeaderSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);

    public hideHeader(){
        this.showHeaderSubject.next(false);
    }

    public showHeader(){
        this.showHeaderSubject.next(true);
    }

}
