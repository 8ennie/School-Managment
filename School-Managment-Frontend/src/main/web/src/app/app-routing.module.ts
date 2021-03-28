import { MonitorListComponent } from './monitor/monitor-list/monitor-list.component';
import { DocumentListComponent } from './document/document-list/document-list.component';
import { LoginComponent } from './auth/login/login.component';
import { UploadPhotoShowComponent } from './photo-show/upload-photo-show/upload-photo-show.component';
import { RoleComponent } from './auth/role/role.component';
import { UserComponent } from './auth/user/user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { Privilege } from './auth/privilege.model';
import { PhotoShowComponent } from './photo-show/photo-show.component';
import { SendMessageComponent } from './message/send-message/send-message.component';
import { EditImageShowComponent } from './photo-show/edit-image-show/edit-image-show.component';
import { AreaComponent } from './photo-show/area/area.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'auth', children: [
      { path: '', component: LoginComponent },
      { path: 'users', component: UserComponent, canActivate: [AuthGuard], data: { roles: [Privilege.READ_USER] } },
      { path: 'roles', component: RoleComponent, canActivate: [AuthGuard], data: { roles: [Privilege.READ_USER] } },
    ]
  },
  {
    path: 'photoshow', children: [
      { path: 'documents', component: DocumentListComponent, canActivate: [AuthGuard], data: { roles: [Privilege.WRITE_IMAGE_SHOW] } },
      { path: 'messages', component: SendMessageComponent, canActivate: [AuthGuard], data: { roles: [Privilege.WRITE_MESSAGES] } },
      { path: 'list', component: UploadPhotoShowComponent, canActivate: [AuthGuard], data: { roles: [Privilege.WRITE_IMAGE_SHOW] } },
      { path: 'monitors', component: MonitorListComponent, canActivate: [AuthGuard], data: { roles: [Privilege.READ_MONITORS] } },
      { path: 'areas/:area', component: AreaComponent, canActivate: [AuthGuard], data: { roles: [Privilege.READ_IMAGE_SHOW] } },
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
