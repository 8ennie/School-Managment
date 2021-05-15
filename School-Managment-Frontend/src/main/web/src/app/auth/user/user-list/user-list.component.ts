import { Subscription } from 'rxjs';
import { Role } from './../../role/role.model';
import { UserStore } from './../user.store';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  @Output() selectedUserResourceUrl = new EventEmitter<string>();

  allUseres: User[];

  filteredUsers: User[];
  selectedUser: User;
  showMonitors: boolean;

  private userSubscription: Subscription;

  constructor(
    private userStore: UserStore,
  ) { }


  ngOnInit(): void {
    this.userSubscription = this.userStore.users.subscribe((users: User[]) => {
      this.allUseres = users;
      this.filteredUsers = users.filter(u => !u.username.includes("Monitor"));
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  showMonitorAccounts(event: { checked: boolean }) {
    if (event.checked) {
      this.filteredUsers = this.allUseres;
    } else {
      this.filteredUsers = this.allUseres.filter(u => !u.username.includes("Monitor"));
    }
  }


  public onRowSelect(event: { data: User }): void {
    this.selectedUser = event.data;
    this.selectedUserResourceUrl.emit(this.selectedUser.resourceUrl);
  }

  public getRoles(user: User): string[] {
    return (user.roles as Role[]).map(r => r.name);
  }
}
