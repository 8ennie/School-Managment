import { HateoasEntity, IHateoasEntity } from "../_helper/spring-hateoas/hateoas-entity";


export interface MonitorHateoas extends IHateoasEntity {
    readonly _id?: number;
    readonly name?: string;
    readonly location: string;
    readonly ipAddress?: string;
    readonly imageShow?;
    readonly areas?: string[];
    readonly active: boolean;

    readonly imageShowLocked?: boolean;
    readonly status?: boolean;
    readonly serverIp?: string;

    readonly sleepTime?: Date;
    readonly wakeTime?: Date;
    readonly onStartResumeLastShow?: boolean;
    readonly startUrl: string;
}


export class Monitor extends HateoasEntity implements MonitorHateoas {
    _id?: number;
    name?: string;
    location: string;
    ipAddress?: string;
    imageShow;
    areas?: string[];
    imageShowLocked?: boolean;
    status?: boolean;
    serverIp?: string;
    active: boolean;

    sleepTime?: Date;
    wakeTime?: Date;
    onStartResumeLastShow?: boolean;
    startUrl: string;

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
