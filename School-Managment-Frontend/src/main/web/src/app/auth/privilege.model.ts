import { HateoasEntity, IHateoasEntity } from 'src/app/_helper/spring-hateoas/hateoas-entity';

export enum Privileges {
  READ_IMAGE_SHOW = 'READ_IMAGE_SHOW',
  WRITE_IMAGE_SHOW = 'WRITE_IMAGE_SHOW',

  READ_MONITORS = 'READ_MONITORS',
  WRITE_MONITORS = 'WRITE_MONITORS',

  READ_SUBSTITUTIONS = 'READ_SUBSTITUTIONS',
  WRITE_SUBSTITUTIONS = 'WRITE_SUBSTITUTIONS',

  READ_ADVERTISMENT = 'READ_ADVERTISMENT',
  WRITE_ADVERTISMENT = 'WRITE_ADVERTISMENT',

  READ_USER = 'READ_USER',
  WRITE_USER = 'WRITE_USER',

  WRITE_MESSAGES = 'WRITE_MESSAGES',
  READ_MESSAGES = 'READ_MESSAGES',

  TRANSPORT = 'TRANSPORT',
  CHANGE_SHOW = 'CHANGE_SHOW',
  LOCK_SHOW = 'LOCK_SHOW',
  REBOOT_PI = 'REBOOT_PI',
}

export interface PrivilegeHateoas extends IHateoasEntity {
  readonly name: Privileges;
}

export class Privilege extends HateoasEntity implements PrivilegeHateoas {
  name: Privileges;
}