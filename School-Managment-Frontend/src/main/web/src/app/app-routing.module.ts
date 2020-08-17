import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { Role } from './auth/role.model';
import { PhotoShowComponent } from './photo-show/photo-show.component';
import { MonitorComponent } from './photo-show/monitor/monitor.component';
import { SubstitutionComponent } from './photo-show/substitution/substitution.component';
import { AdvertismentComponent } from './photo-show/advertisment/advertisment.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  {
    path: 'photoshow', children: [
      { path: 'substitutions', component: SubstitutionComponent, canActivate: [AuthGuard], data: { roles: [Role.ROLE_ADMIN] } },
      { path: 'advertisments', component: AdvertismentComponent, canActivate: [AuthGuard], data: { roles: [Role.ROLE_ADMIN] } },
      { path: 'monitors', component: MonitorComponent, canActivate: [AuthGuard], data: { roles: [Role.ROLE_ADMIN] } },
      { path: 'show/:id', component: PhotoShowComponent, canActivate: [AuthGuard], data: { roles: [Role.ROLE_MONITOR] } }
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
