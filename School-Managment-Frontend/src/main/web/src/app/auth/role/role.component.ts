import { RoleStore } from './role.store';

import { Component, OnInit } from '@angular/core';
import { Role } from './role.model';

@Component({
  selector: 'app-role',
  providers: [],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  constructor() { }

  roleID: Role;

  ngOnInit(): void {
  }

  roleSelected(event) {
    this.roleID = event;
  }

}


