import { Role } from './../../role/role.model';
import { RoleService } from './../../role/role.service';
import { AreaService } from '../../../area/area.service';
import { UserStore } from './../user.store';
import { UserService } from './../user.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnChanges {

  @Input() userResourceUrl: string;

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



  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userResourceUrl) {
      if (this.userResourceUrl) {
        this.userService.getUser(this.userResourceUrl).then(
          (user: User) => {
            this.isNew = false;
            this.errorMessage = '';
            this.user = user;
            this.roleService.getRolesForUser(this.user).then((roles: Role[]) => {
              this.user.roles = roles.map(r => r.resourceUrl);
            });

          }
        );
      }
    }
  }

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

  public save(): void {
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

  public delete(): void {
    this.userStore.deleteUser(this.user).then(d => this.newUser());
  }

  public newUser(): void {
    this.user = new User();
    this.isNew = true;
    this.userResourceUrl = null;
  }

}
