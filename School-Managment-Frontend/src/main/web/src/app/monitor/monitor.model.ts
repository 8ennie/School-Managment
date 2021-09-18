import { ImageShow } from './../image-show/image-show.model';
import { PublicTransport } from "../addons/public-transport/public-transport.model";
import { HateoasEntity, IHateoasEntity } from "../_helper/spring-hateoas/hateoas-entity";



interface IMonitor {
    readonly _id?: number;
    readonly name?: string;
    readonly location: string;
    readonly ipAddress?: string;
    readonly imageShow?: ImageShow | string;
    readonly areas?: string[];
    readonly active: boolean;

    readonly imageShowLocked?: boolean;
    readonly status?: boolean;
    readonly serverIp?: string;

    readonly sleepTime?: Date;
    readonly wakeTime?: Date;
    readonly onStartResumeLastShow?: boolean;
    readonly startUrl: string;
    readonly currentUrl?: string;

    readonly publicTransportShowPart?: PublicTransport<string> | PublicTransport;
}


export interface MonitorHateoas extends IHateoasEntity, IMonitor {
    readonly _id?: number;
    readonly name?: string;
    readonly location: string;
    readonly ipAddress?: string;
    readonly imageShow?: string;
    readonly areas?: string[];
    readonly active: boolean;

    readonly imageShowLocked?: boolean;
    readonly status?: boolean;
    readonly serverIp?: string;

    readonly sleepTime?: Date;
    readonly wakeTime?: Date;
    readonly onStartResumeLastShow?: boolean;
    readonly startUrl: string;
    readonly currentUrl?: string;

    readonly publicTransportShowPart?: PublicTransport<string>;
}


export class Monitor extends HateoasEntity implements IMonitor {
    public _id?: number;
    public name?: string;
    public location: string;
    public ipAddress?: string;
    public imageShow;
    public areas?: string[];
    public imageShowLocked?: boolean;
    public status?: boolean;
    public serverIp?: string;
    public active: boolean;

    public sleepTime?: Date;
    public wakeTime?: Date;
    public onStartResumeLastShow?: boolean;
    public startUrl: string;
    public currentUrl?: string;

    public publicTransportShowPart?: PublicTransport = new PublicTransport();

    get imageShowUrl(): string | undefined {
        if (this.imageShow && this.imageShow._links && this.imageShow._links.self && this.imageShow._links.self.href) {
            return this.imageShow?._links.self.href.replace('{?projection}', '');
        } else {
            if (this._embedded?.imageShow?._links?.self?.href) {
                return this._embedded?.imageShow?._links?.self?.href?.replace('{?projection}', '');
            }
            return this.imageShow;
        }
    }

    set imageShowUrl(url: string) {
        this.imageShow = url;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get id(): number {
        if (this._id) {
            return this._id;
        } else {
            if (this._links?.self?.href) {
                return Number(this._links.self.href.split('/').slice(-1)[0]);
            }
            return undefined;
        }
    }
}
