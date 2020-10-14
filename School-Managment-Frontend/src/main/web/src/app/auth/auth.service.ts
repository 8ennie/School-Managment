import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthUser } from './auth-user.model';
import { environment } from 'src/environments/environment';
import { Monitor } from '../photo-show/monitor/monitor.model';

const AUTH_API = environment.apiUrl + 'auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class AuthService {

  userChanges = new Subject<AuthUser>();

  constructor(private http: HttpClient, private router: Router, private tokenStorage: TokenStorageService) { }

  login(credentials) {
    return this.http.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions).toPromise().then(
      (data:{token}) => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);
        this.updateUser();
        return data;
      }
    );
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    }, httpOptions);
  }


  isAthenticated() {
    return !!this.tokenStorage.getToken();
  }

  logout() {
    this.tokenStorage.signOut();
  }

  getUser() {
    return this.tokenStorage.getUser();
  }

  getRoles(): string[] {
    return this.tokenStorage.getUser().roles;
  }

  updateUser() {
    this.userChanges.next(this.getUser());
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasPrivilege(privileges: string[]): boolean {
    const userPrivilages = this.getUser().roles;
    for (let p of privileges) {
      if (userPrivilages.includes(p)) {
        return true;
      }
    }
    return false;
  }

  signUpMonitor(monitor:Monitor){
    console.log(monitor);
    return this.http.post(AUTH_API + "signup/monitor", monitor).toPromise();
  }
}
