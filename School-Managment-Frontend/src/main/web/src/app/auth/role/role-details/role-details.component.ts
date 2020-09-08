import { catchError } from 'rxjs/operators';
import { RoleStore } from './../role.store';
import { RoleService } from './../role.service';
import { Component, OnInit, Input } from '@angular/core';
import { Role } from '../role.model';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.css']
})
export class RoleDetailsComponent implements OnInit {

  @Input() set roleId(value: string) {
    if(value != undefined){
      this.roleService.getRole(value).then(
        (role:Role) => {
          this.isNew = false;
          this.errorMessage = '';
          this.role = role;
          this.role.name = this.role.name.substring(5, this.role.name.length);
          this.roleService.getPrivileges(role).then((privileges: {_embedded}) => {
            this.role.privileges = privileges._embedded.privileges.map(p => p._links.self.href);
          });
        }
      );
    }
  }
  privileges = [];
  role: Role = new Role();
  isNew = true;
  errorMessage:string;

  constructor(
    private roleService: RoleService,
    private roleStore: RoleStore,
  ) { 
    this.newRole();
  }

  ngOnInit(): void {
    this.roleService.getAllPrivileges().then((privileges: {_embedded}) => {
      this.privileges = privileges._embedded.privileges.map(p => {return {"label": p.name, "value":p._links.self.href}});
    });
  }
  save(){
    this.errorMessage = ''
    if(!this.role.name || this.role.name == ''){
      this.errorMessage = 'error.not-all-required-fields'
      return;
    }
    this.role.name = 'ROLE_' + this.role.name.toUpperCase();
    if(this.isNew){
      this.roleStore.addRole(this.role).then(p => {
        this.newRole();
      }).catch(error => {
        this.role.name = this.role.name.substring(5, this.role.name.length);
        if(error == 'ConstraintViolationException'){
          console.log('Error');
          
          this.errorMessage = 'error.constraint-violation-exception';
        }
      });
    } else {
      this.roleStore.updateRole(this.role).then(p => {
        this.newRole();
      }).catch(error => {
        this.role.name = this.role.name.substring(5, this.role.name.length);
        if(error == 'ConstraintViolationException'){
          this.errorMessage = 'error.constraint-violation-exception';
        }
      });
    }
  }

  newRole(){
    this.role = new Role();
    this.isNew = true;
    this.errorMessage = '';
  }

  delete(){
    this.roleStore.deleteRole(this.role);
    this.newRole();
  }
}
