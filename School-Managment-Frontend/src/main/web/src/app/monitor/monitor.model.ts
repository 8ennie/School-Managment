import { HateoasEntity, IHateoasEntity } from "../_helper/spring-hateoas/hateoas-entity";


export interface MonitorHateoas extends IHateoasEntity {
    readonly id: number;
    readonly name?: string;
    readonly location: string;
    readonly ipAddress?: string;
    readonly imageShow?;
    readonly areas?: string[];

    readonly imageShowLocked?: boolean;
    readonly status?: boolean;
    readonly serverIp?: string;

    readonly sleepTime?: Date;
    readonly wakeTime?: Date;
    readonly onStartResumeLastShow?: boolean;
    readonly startUrl: string;
}


export class Monitor extends HateoasEntity implements MonitorHateoas {
    id: number;
    name?: string;
    location: string;
    ipAddress?: string;
    imageShow?;
    areas?: string[];
    imageShowLocked?: boolean;
    status?: boolean;
    serverIp?: string;

    sleepTime?: Date;
    wakeTime?: Date;
    onStartResumeLastShow?: boolean;
    startUrl: string;

    get imageShowUrl(): string | undefined {
        if (this.imageShow && this.imageShow._links && this.imageShow._links.self && this.imageShow._links.self.href) {
            return this.imageShow?._links.self.href.replace('{?projection}', '');
        } else {
            return this.imageShow;
        }
    }

    set imageShowUrl(url: string) {
        this.imageShow = url;
    }
}
