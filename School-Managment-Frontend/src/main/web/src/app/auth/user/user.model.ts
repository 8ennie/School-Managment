import { Privilege } from './../privilege.model';

export class User {
  public username: string;
  public email: string;
  public id: string;
  public roles: [];
  public areas: [];
  public privileges: Privilege[];
  public password: string;

  public _links;
}
