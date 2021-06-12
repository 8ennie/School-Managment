import { HateoasEntity, IHateoasEntity } from "src/app/_helper/spring-hateoas/hateoas-entity";


export interface ShowPartHateoas extends IHateoasEntity {
    readonly id?: number;
    readonly position: number;
    readonly active: boolean;
    readonly showPartId?: number;
    readonly showPartImage: string;
}


export class ShowPart extends HateoasEntity implements ShowPartHateoas {
    public id?: number;
    public position: number;
    public displayTime: number;
    public active: boolean;
    public showPartId?: number;
    public showPartImage: string;

    public changed?: boolean;
}
