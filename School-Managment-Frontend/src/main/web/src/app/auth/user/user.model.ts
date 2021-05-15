import { Role } from './../role/role.model';
import { HateoasEntity, IHateoasEntity } from 'src/app/_helper/spring-hateoas/hateoas-entity';
import { Privilege } from './../privilege.model';

export interface UserHateoas extends IHateoasEntity {
  readonly username: string;
  readonly email: string;
  readonly roles: Role[] | string[];
  readonly areas: [];
  readonly privileges: Privilege[];
  readonly password: string;
}


export class User extends HateoasEntity implements UserHateoas {
  public username: string;
  public email: string;
  public roles: Role[] | string[];
  public areas: [];
  public privileges: Privilege[];
  public password: string;
}
