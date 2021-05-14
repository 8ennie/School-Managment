import { RoleStore } from './../role.store';
import { SelectItem } from 'primeng/api';
import { PrivilegeService } from './../privilege.service';
import { Privilege } from './../../privilege.model';

import { RoleService } from './../role.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Role } from '../role.model';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit, OnChanges {

  @Input()
  roleResourceUrl: string;

  @Output()
  roleDeleted = new EventEmitter<Role>();

  @Output()
  roleAdded = new EventEmitter<Role>();

  @Output()
  roleChanged = new EventEmitter<Role>();

  privileges: SelectItem[] = [];
  role: Role = new Role();
  isNew = true;
  errorMessage: string;



  constructor(
    private readonly roleStore: RoleStore,
    private readonly privilegeService: PrivilegeService,
  ) {
    this.newRole();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.roleResourceUrl) {
      if (this.roleResourceUrl) {
        this.roleStore.getRole(this.roleResourceUrl).then(
          (role: Role) => {
            this.isNew = false;
            this.errorMessage = '';
            this.role = role;
            this.role.name = this.role.name.substring(5, this.role.name.length);
            this.privilegeService.getPrivilegesForRole(this.role)
              .then((privileges: Privilege[]) => {
                this.role.privileges = privileges.map(p => p.resourceUrl);
              });
          });
      }
    }
  }

  ngOnInit(): void {
    this.privilegeService.getAllPrivileges().then((privileges: Privilege[]) => {
      this.privileges = privileges.map((p: Privilege) => { return { label: p.name, value: p.resourceUrl } });
    });
  }
  public save(): void {
    this.errorMessage = '';
    if (!this.role.name || this.role.name == '') {
      this.errorMessage = 'error.not-all-required-fields';
      return;
    }
    this.role.name = 'ROLE_' + this.role.name.toUpperCase();
    if (this.isNew) {

      this.roleStore.addRole(this.role).then((role: Role) => {
        this.role = role;
        this.newRole();
      }).catch(error => {
        this.role.name = this.role.name.substring(5, this.role.name.length);
        if (error == 'ConstraintViolationException') {
          this.errorMessage = 'error.constraint-violation-exception';
        }
      });
    } else {
      this.roleStore.updateRole(this.role).then((role: Role) => {
        this.newRole();
      }).catch(error => {
        this.role.name = this.role.name.substring(5, this.role.name.length);
        if (error == 'ConstraintViolationException') {
          this.errorMessage = 'error.constraint-violation-exception';
        }
      });
    }
  }

  public newRole(): void {
    this.role = new Role();
    this.isNew = true;
    this.errorMessage = '';
  }

  public delete(): void {
    this.roleStore.deleteRole(this.role);
    this.newRole();
  }
}
