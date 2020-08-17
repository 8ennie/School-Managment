export class Monitor {

    id?: number;

    name?: string;

    showGroup?: string;

    location?: string;

    ipAddress?: string;

    status?: boolean;

    imageShow?;

    get imageShowUrl(): string | undefined {        
        if(this.imageShow && this.imageShow._links && this.imageShow._links.self && this.imageShow._links.self.href){
            return this.imageShow?._links.self.href.replace("{?projection}", "");
        }else{
            return this.imageShow;
        }
    }

    set imageShowUrl(url: string) {
        this.imageShow = url;
    }

    showType?: string;

    _links?;

    serverIp?;

}