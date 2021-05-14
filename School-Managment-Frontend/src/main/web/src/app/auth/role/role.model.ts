import { Privilege } from './../privilege.model';
import { HateoasEntity, IHateoasEntity } from './../../_helper/spring-hateoas/hateoas-entity';

export interface RoleHateoas extends IHateoasEntity {
  readonly name: string;
  readonly privileges: Privilege[] | string[];

}

export class Role extends HateoasEntity implements RoleHateoas {
  name: string;
  privileges: Privilege[] | string[];
}
