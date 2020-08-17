import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';
import { Role } from '../auth/role.model';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from './header.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  showHeader: boolean = true;

  user: User;
  isAuthenticated = false;
  roles: Role[];
  userSub: Subscription;
  headerSubscription : Subscription;
  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private headerService: HeaderService
  ) { }
  isMenuCollapsed;

  ngOnInit() {
    this.isAuthenticated = this.authService.isAthenticated();
    this.user = this.authService.getUser();
    if (this.authService.getUser()) {
      this.roles = this.authService.getUser().roles;
    }
    this.userSub = this.authService.userChanges.subscribe((user: User) => {
      this.isAuthenticated = this.authService.isAthenticated();
      if (user !== null) {
        this.user = user;
        this.roles = this.authService.getUser().roles;
      }
    });
    this.headerSubscription = this.headerService.showHeader.subscribe(hide => this.showHeader = hide);
  }

  onLogout() {
    this.authService.logout();
    this.isAuthenticated = false;
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.headerSubscription.unsubscribe();
  }

  isAdmin() {
    return this.roles.includes(Role.ROLE_ADMIN);
  }
  isTeacher() {
    return this.roles.includes(Role.ROLE_TEACHER);
  }
  isStudent() {
    return this.roles.includes(Role.ROLE_STUDENT);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  getCurrentLang(){
    return this.translate.currentLang;
  }

  getLangs(){
    return this.translate.getLangs();
  }
}
