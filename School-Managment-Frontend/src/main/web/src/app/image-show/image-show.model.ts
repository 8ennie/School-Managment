import { HateoasEntity, IHateoasEntity } from "../_helper/spring-hateoas/hateoas-entity";

export interface ImageShowHateoas extends IHateoasEntity {
    readonly name: string;
    readonly area: string;
    readonly document?: { fileName: string };
    readonly date?: Date;
    readonly imageCount?: number;
    readonly showParts?;
}


export class ImageShow extends HateoasEntity implements ImageShowHateoas {
    name: string;
    area: string;
    document?: { fileName: string };
    date?: Date;
    imageCount?: number;
    showParts?;
}
