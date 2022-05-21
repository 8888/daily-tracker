import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthService {
  public idToken = '';
  public accessToken = '';

  private storeTokens(id: string, access: string): void {
    this.idToken = id;
    this.accessToken = access;
    localStorage.setItem('idToken', id);
    localStorage.setItem('accessToken', access);
  }

  private fetchTokensFromLocal(): void {
    this.idToken = localStorage.getItem('idToken') || '';
    this.accessToken = localStorage.getItem('accessToken') || '';
  }
}
