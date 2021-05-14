import { Subscription } from 'rxjs';
import { RoleStore } from './../role.store';
import { Privilege } from './../../privilege.model';
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { Role } from '../role.model';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit, OnDestroy {

  constructor(
    private readonly roleStore: RoleStore,
  ) { }


  @Output()
  roleSelected = new EventEmitter<string>();

  private roleSubscription: Subscription;

  roles: Role[] = [];
  selectedRole: Role;

  ngOnInit(): void {
    this.roleSubscription = this.roleStore.roles.subscribe((roles: Role[]) => {
      this.roles = roles;
    });
  }
  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }


  public onRowSelect(event: { data: Role }): void {
    this.selectedRole = event.data;
    this.roleSelected.emit(this.selectedRole.resourceUrl);
  }

  public getPrivileges(role: Role): Privilege[] {
    return (role.privileges as Privilege[]).map((p: any) => p.name);
  }
}
