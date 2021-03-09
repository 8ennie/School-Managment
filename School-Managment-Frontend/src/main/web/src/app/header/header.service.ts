import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class HeaderService {

    showHeader: BehaviorSubject<boolean> = new BehaviorSubject(true);


}
