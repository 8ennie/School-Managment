import { RoleStore } from './../role.store';
import { RoleService } from './../role.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Role } from '../role.model';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  constructor(
    private roleStore: RoleStore
  ) { }

  @Output() roleSelected = new EventEmitter<string>();

  roles: Role[] = [];
  selectedRole: Role;

  ngOnInit(): void {
    // this.roleStore.getRoles().then((roles: {_embedded}) => {
    //   console.log(roles);
    //   this.roles = roles._embedded.roles;
    // });

    this.roleStore.roles.subscribe(
      roles => {
        this.roles = roles.toArray();
      }
    );
  }

  onRowSelect(event) {
    this.selectedRole = event.data;
    this.roleSelected.emit(this.selectedRole.id);
  }

  getPrivileges(role) {
    return role.privileges.map(r => r.name);
  }
}
