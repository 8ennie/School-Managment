import { AreaService } from './../photo-show/area.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { AuthUser } from '../auth/auth-user.model';
import { Privilege } from '../auth/privilege.model';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from './header.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  showHeader = true;

  user: AuthUser;
  isAuthenticated = false;
  privilege = [];
  userSub: Subscription;
  headerSubscription: Subscription;


  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private headerService: HeaderService,
    private readonly areaService: AreaService,
  ) { }
  isMenuCollapsed;
  areas = [];

  ngOnInit() {
    this.isAuthenticated = this.authService.isAthenticated();
    this.user = this.authService.getUser();
    if (this.authService.getUser()) {
      this.privilege = this.authService.getUser().roles;
    }
    this.userSub = this.authService.userChanges.subscribe((user: AuthUser) => {
      this.isAuthenticated = this.authService.isAthenticated();
      if (user !== null) {
        this.user = user;
        this.privilege = this.authService.getUser().roles;
      }
      this.loadAreas();
    });
    this.headerSubscription = this.headerService.showHeader.subscribe(hide => this.showHeader = hide);
    this.loadAreas();
  }

  loadAreas() {
    this.areaService.getUserAreas().then(areas => {
      this.areas = areas;
    });
  }

  onLogout() {
    this.authService.logout();
    this.isAuthenticated = false;
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.headerSubscription.unsubscribe();
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  getCurrentLang() {
    return this.translate.currentLang;
  }

  getLangs() {
    return this.translate.getLangs();
  }

  hasPrivilege(privileges: string[]): boolean {
    for (const p of privileges) {
      if (this.privilege.includes(p)) {
        return true;
      }
    }
    return false;
  }
}
