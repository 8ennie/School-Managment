

export class Monitor {

    constructor() {}


    id?: number;
    name?: string;
    showGroup?: string;
    location?: string;
    ipAddress?: string;
    imageShow?;
    areas?: string[];
    _links?;
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
