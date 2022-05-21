import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
  public idToken = '';
  public accessToken = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {}

  public logout(): void {
    localStorage.clear();
    this.document.location.href = environment.loginUrl;
  }

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
