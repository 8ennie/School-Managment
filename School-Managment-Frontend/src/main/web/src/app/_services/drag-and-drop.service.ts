import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class DragAndDropService {

    private items: { [key: string]: any } = {};

    public drag(key: string, object: any): void {
        this.items[key] = object;
    }

    public drop(key: string): any {
        const item = this.items[key];
        return item;
    }
}