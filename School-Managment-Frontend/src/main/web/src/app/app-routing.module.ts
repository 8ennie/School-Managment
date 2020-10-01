import { UploadPhotoShowComponent } from './photo-show/upload-photo-show/upload-photo-show.component';
import { RoleComponent } from './auth/role/role.component';
import { UserComponent } from './auth/user/user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { Privilege } from './auth/privilege.model';
import { PhotoShowComponent } from './photo-show/photo-show.component';
import { MonitorComponent } from './photo-show/monitor/monitor.component';
import { SendMessageComponent } from './message/send-message/send-message.component';
import { EditImageShowComponent } from './photo-show/edit-image-show/edit-image-show.component';
import { AreaComponent } from './photo-show/area/area.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'auth', children: [
      { path: '', component: AuthComponent },
      { path: 'users', component: UserComponent, canActivate: [AuthGuard], data: { roles: [Privilege.READ_USER] } },
      { path: 'roles', component: RoleComponent, canActivate: [AuthGuard], data: { roles: [Privilege.READ_USER] } },
    ]
  },
  {
    path: 'photoshow', children: [
      { path: 'messages', component: SendMessageComponent, canActivate: [AuthGuard], data: { roles: [Privilege.WRITE_MESSAGES] } },
      { path: 'list', component: UploadPhotoShowComponent, canActivate: [AuthGuard], data: { roles: [Privilege.WRITE_IMAGE_SHOW] } },
      { path: 'monitors', component: MonitorComponent, canActivate: [AuthGuard], data: { roles: [Privilege.READ_MONITORS] } },
      { path: 'areas/:area', component: AreaComponent, canActivate: [AuthGuard], data: { roles: [Privilege.WRITE_IMAGE_SHOW] } },
      { path: 'edit/:id', component: EditImageShowComponent, canActivate: [AuthGuard], data: { roles: [Privilege.WRITE_IMAGE_SHOW] } },
      { path: 'show/:id', component: PhotoShowComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
