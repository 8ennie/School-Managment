
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

  roleResourceUrl: string;

  ngOnInit(): void {
  }

  public roleSelected(roleResourceUrl: string): void {
    this.roleResourceUrl = roleResourceUrl;
  }

}


