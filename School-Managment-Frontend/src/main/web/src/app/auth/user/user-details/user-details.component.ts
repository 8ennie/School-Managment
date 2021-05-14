import { Role } from './../../role/role.model';
import { RoleService } from './../../role/role.service';
import { AreaService } from '../../../area/area.service';
import { UserStore } from './../user.store';
import { UserService } from './../user.service';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  @Input() set userId(value: string) {
    if (value !== undefined) {
      this.userService.getUser(value).then(
        (user: User) => {
          this.isNew = false;
          this.errorMessage = '';
          this.user = user;
          this.userService.getRoles(this.user).then((roles: { _embedded }) => {
            this.user.roles = roles._embedded.roles.map(r => r._links.self.href);
          });

        }
      );
    }
  }
  user: User = new User();
  isNew = true;
  errorMessage: string;
  roles = [];
  areas = [];

  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly userStore: UserStore,
    private readonly areaService: AreaService,
  ) { }

  ngOnInit(): void {
    this.roleService.getAllRoles().then(
      (roles: Role[]) => {
        this.roles = roles.map(r => {
          return { label: r.name, value: r._links.self.href };
        });
      }
    );
    this.areaService.getAllAreas().then((areas: string[]) => {
      this.areas = areas.map(a => {
        return { label: a, value: a };
      });
    });
  }

  save() {
    this.errorMessage = '';
    if (!this.user.username || this.user.username == '') {
      this.errorMessage = 'error.not-all-required-fields';
      return;
    }
    if (this.isNew) {
      if (this.user.password.length < 7) {
        this.errorMessage = 'error.password-to-short';
        return;
      }
      this.userStore.addUser(this.user).then(p => {
        this.newUser();
      }).catch(error => {
        if (error == 'EmailExists') {
          this.errorMessage = 'error.email-exists';
        }
        if (error == 'UsernameExists') {
          this.errorMessage = 'error.username-exists';
        }
      });
    } else {
      this.userStore.updateUser(this.user).then(p => {
        this.newUser();
      }).catch(error => {
        if (error == 'EmailExists') {
          this.errorMessage = 'error.email-exists';
        }
        if (error == 'UsernameExists') {
          this.errorMessage = 'error.username-exists';
        }
      });
    }
  }

  delete() {
    this.userStore.deleteUser(this.user).then(d => this.newUser());
  }

  newUser() {
    this.user = new User();
    this.isNew = true;
    this.userId = null;
  }

}
