import { IHateoasEntity } from './hateoas-entity';



export interface Embeddeds<T = any> {
    [entityNames: string]: T[];
}

export interface HateoasCollection<T extends Embeddeds> extends IHateoasEntity {
    readonly _embedded: T;

    readonly _links: {
        readonly self: {
            readonly href: string;
            readonly templated?: true;
        },
        readonly profile?: {
            readonly href: string;
        },
        readonly search?: {
            readonly href: string;
        }
    }
}

export interface HateosPage<T extends Embeddeds> extends HateoasCollection<T> {
    readonly page: {
        readonly size: number;
        readonly totalElements: number;
        readonly toalPages: number;
        readonly number: number;
    }
}

export class Page<T extends Embeddeds> implements HateosPage<T>{
    readonly _embedded: T;

    public readonly _links: {
        readonly self: {
            readonly href: string;
            readonly templated?: true;
        },
        readonly profile?: {
            readonly href: string;
        },
        readonly search?: {
            readonly href: string;
        }
    }

    public readonly page: {
        readonly size: number;
        readonly totalElements: number;
        readonly toalPages: number;
        readonly number: number;
    }

    constructor(hateosPage: HateosPage<any>, elements: T) {
        this._links = hateosPage._links;
        this.page = hateosPage.page;

        this._embedded = elements;
    }
}