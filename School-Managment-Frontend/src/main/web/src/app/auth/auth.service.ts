import { Privileges } from './privilege.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { LocalStorageService } from '../_services/local-storage.service';
import { AuthUser } from './auth-user.model';
import { environment } from 'src/environments/environment';


const AUTH_API = environment.apiUrl + 'auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class AuthService {

  public userChanges: ReplaySubject<AuthUser> = new ReplaySubject<AuthUser>();

  constructor(
    private readonly http: HttpClient,
    private readonly localStorage: LocalStorageService,
  ) { }

  login(credentials: { username: string, password: string }): Promise<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions).toPromise().then(
      (data: { token: string, roles: [] }) => {
        if (data['roles']) {
          data['privileges'] = data.roles;
          delete data.roles;
        }
        this.localStorage.saveToken(data.token);
        this.localStorage.saveUser(data);
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

  isAthenticated(): boolean {
    return !!this.localStorage.getToken();
  }

  logout(): void {
    this.localStorage.signOut();
  }

  getUser(): AuthUser {
    return this.localStorage.getUser();
  }

  getPrivileges(): Privileges[] {
    return this.getUser().privileges;
  }

  updateUser(): void {
    this.userChanges.next(this.getUser());
  }

  hasPrivilege(privilege: Privileges | string): boolean {
    return this.getPrivileges().includes(Privileges[privilege]);
  }

  hasPrivileges(privileges: Privileges[] | string[]): boolean {
    const userPrivilages = this.getUser().privileges;
    for (const p of privileges) {
      if (userPrivilages.includes(Privileges[p])) {
        return true;
      }
    }
    return false;
  }

  signUpMonitor(monitorId: number): Promise<any> {
    return this.http.post(AUTH_API + 'signup/monitor', monitorId).toPromise();
  }
}
