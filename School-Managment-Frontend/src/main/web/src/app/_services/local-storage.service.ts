import { AuthUser } from './../auth/auth-user.model';
import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  private save(key: string, value) {
    window.sessionStorage.removeItem(key);
    window.sessionStorage.setItem(key, value);
  }

  private getValue(key: string): string {
    return sessionStorage.getItem(key);
  }

  public signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    this.save(TOKEN_KEY, token);
  }

  public getToken(): string {
    return this.getValue(TOKEN_KEY);
  }

  public saveUser(user): void {
    this.save(USER_KEY, JSON.stringify(user));
  }

  public getUser(): AuthUser {
      return JSON.parse(this.getValue(USER_KEY));
  }
}
