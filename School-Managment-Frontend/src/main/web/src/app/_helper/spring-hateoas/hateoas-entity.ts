

export interface IHateoasEntity {
    readonly _links: {
        readonly self: {
            readonly href: string;
            readonly templated?: true;
        }
    }
}

export class HateoasEntity implements IHateoasEntity {


    public get resourceUrl(): string {
        if (this._links?.self?.href) {
            return this._links.self.href;
        }
        return undefined;
    }

    public set resourceUrl(url: string) {
        this._links = {
            self: {
                href: url,
            }
        };
    }

    public _links: {
        self: {
            href: string;
        };
    };

}