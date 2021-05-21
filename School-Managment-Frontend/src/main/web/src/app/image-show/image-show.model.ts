import {
  HateoasEntity,
  IHateoasEntity,
} from "../_helper/spring-hateoas/hateoas-entity";
import { ShowPart } from "./show-part/show-part.model";

export interface ImageShowHateoas extends IHateoasEntity {
  readonly name: string;
  readonly area: string;
  readonly document?: { fileName: string };
  readonly date?: Date;
  readonly imageCount?: number;
  readonly showParts?: string[] | ShowPart[];
  readonly createdAt?: Date;
}

export class ImageShow extends HateoasEntity implements ImageShowHateoas {
  name: string;
  area: string;
  document?: { fileName: string };
  date?: Date;
  imageCount?: number;
  showParts?: string[] | ShowPart[];
  createdAt?: Date;

  get id(): number {
    if (this._links?.self?.href) {
      return Number(this._links.self.href.split("/").slice(-1)[0]);
    }
    return undefined;
  }

  set id(id: number) { }
}
