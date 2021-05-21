import { MonitorDashboardComponent } from './monitor/monitor-dashboard/monitor-dashboard.component';
import { EditShowComponent } from './image-show/edit-show/edit-show.component';
import { MonitorListComponent } from './monitor/monitor-list/monitor-list.component';
import { DocumentListComponent } from './document/document-list/document-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RoleComponent } from './auth/role/role.component';
import { UserComponent } from './auth/user/user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { Privileges } from './auth/privilege.model';
import { SendMessageComponent } from './message/send-message/send-message.component';
import { AreaOverviewComponent } from './area/area-overview/area-overview.component';
import { ShowComponent } from './image-show/show/show.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'auth', children: [
      { path: '', component: LoginComponent },
      { path: 'users', component: UserComponent, canActivate: [AuthGuard], data: { roles: [Privileges.READ_USER] } },
      { path: 'roles', component: RoleComponent, canActivate: [AuthGuard], data: { roles: [Privileges.READ_USER] } },
    ]
  },
  {
    path: 'imageshow', children: [
      { path: 'documents', component: DocumentListComponent, canActivate: [AuthGuard], data: { roles: [Privileges.WRITE_IMAGE_SHOW] } },
      { path: 'messages', component: SendMessageComponent, canActivate: [AuthGuard], data: { roles: [Privileges.WRITE_MESSAGES] } },
      { path: 'monitors', component: MonitorListComponent, canActivate: [AuthGuard], data: { roles: [Privileges.READ_MONITORS] } },
      { path: 'monitors/dashboard', component: MonitorDashboardComponent, canActivate: [AuthGuard], data: { roles: [Privileges.READ_MONITORS] } },
      { path: 'areas/:area', component: AreaOverviewComponent, canActivate: [AuthGuard], data: { roles: [Privileges.READ_IMAGE_SHOW] } },
      { path: 'edit', component: EditShowComponent, canActivate: [AuthGuard], data: { roles: [Privileges.WRITE_IMAGE_SHOW] } },
      { path: 'show/:id', component: ShowComponent }
    ]
  },
  { path: 'photoshow/show/:id', component: ShowComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
