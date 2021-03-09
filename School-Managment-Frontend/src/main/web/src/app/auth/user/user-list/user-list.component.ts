import { UserStore } from './../user.store';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Output() userSelected = new EventEmitter<string>();

  useres: User[];
  selectedUser: User;

  constructor(
    private userStore: UserStore,
  ) { }

  ngOnInit(): void {
    this.userStore.users.subscribe(users => {
      this.useres = users.toArray();
    });
  }


  onRowSelect(event) {
    this.selectedUser = event.data;
    this.userSelected.emit(this.selectedUser.id);
  }

  getRoles(user) {
    return user.roles.map(r => r.name);
  }
}
