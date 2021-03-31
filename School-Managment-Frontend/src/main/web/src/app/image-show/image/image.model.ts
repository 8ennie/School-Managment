import { HateoasEntity, IHateoasEntity } from "src/app/_helper/spring-hateoas/hateoas-entity";



export interface ImageHateoas extends IHateoasEntity {
    readonly id?: number;
    readonly image: string;
    readonly parentDocument: string;
}


export class Image extends HateoasEntity implements ImageHateoas {
    public id?: number;
    public image: string;
    public parentDocument: string;
}
