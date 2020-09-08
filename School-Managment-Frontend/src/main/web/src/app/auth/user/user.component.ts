import { RoleStore } from './../role/role.store';
import { UserStore } from './user.store';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  providers: [],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userID: string;
  constructor() { }

  ngOnInit(): void {
  }

  userSelected(event){
    this.userID = event
  }
}
