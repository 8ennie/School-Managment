import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { AuthUser } from '../auth/auth-user.model';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from './header.service';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  showHeader: boolean = true;

  user: AuthUser;
  isAuthenticated: boolean = false;

  userSub: Subscription;
  headerSubscription: Subscription;

  public areas: MenuItem[] = [];

  public adminMenu: MenuItem[] = [];

  public userMenu: MenuItem[] = [];

  constructor(
    public readonly authService: AuthService,
    private readonly translate: TranslateService,
    private readonly headerService: HeaderService,
    public readonly router: Router,
  ) { }


  ngOnInit() {
    this.loadUser();
    this.reloadMenuesForTransaltion();
    this.userSub = this.authService.userChanges.subscribe(() => {
      this.loadUser();
    });
    this.translate.onLangChange.subscribe(() => {
      this.reloadMenuesForTransaltion();
    });
    this.headerSubscription = this.headerService.showHeader.subscribe(hide => this.showHeader = hide);
  }

  loadUser(): void {
    this.isAuthenticated = this.authService.isAthenticated();
    this.user = this.authService.getUser();
    this.loadAreas();
  }

  loadAreas(): void {
    if (this.user) {
      this.areas = this.user.areas.map((a: string) => {
        return {
          label: this.translate.instant(a),
          routerLink: [`photoshow/areas/${a}`],
        }
      });
    }
  }

  reloadMenuesForTransaltion(): void {
    this.loadAreas();
    this.adminMenu = [
      {
        label: this.translate.instant('header.users'),
        routerLink: ['auth/users'],
      },
      {
        label: this.translate.instant('header.roles'),
        routerLink: ['auth/roles'],
      }
    ];
    this.userMenu = [
      {
        label: this.translate.instant('header.logout'),
        command: () => this.onLogout(),
        routerLink: ['auth']
      },
    ];
  }

  onLogout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.headerSubscription) {
      this.headerSubscription.unsubscribe();
    }
  }

}