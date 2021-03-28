import { IHateoasEntity, HateoasEntity } from '../_helper/spring-hateoas/hateoas-entity';



export interface DocumentHateoas extends IHateoasEntity {
    readonly area?: string;
    readonly filename: string;
}


export class Document extends HateoasEntity implements DocumentHateoas {
    public area?: string;
    public filename: string;
}
