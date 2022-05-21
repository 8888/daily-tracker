import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
  public idToken = '';
  public accessToken = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
  ) {}

  public validateAccess(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fetchTokensFromLocal();
      if (this.idToken && this.accessToken) {
        resolve();
        return;
      }

      const code = this.extractCode();
      if (code) {
        this.exchangeCodeForTokens(code, resolve, reject);
      } else {
        this.logout();
        reject();
      }
    });
  }

  public logout(): void {
    localStorage.clear();
    this.document.location.href = environment.loginUrl;
  }

  private extractCode(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    return code || '';
  }

  private exchangeCodeForTokens(code: string, resolve: () => void, reject: () => void) {
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('client_id', environment.userPoolClientId);
    body.set('redirect_uri', environment.userPoolClientRedirectUri);

    const headers = { 'content-type': 'application/x-www-form-urlencoded' };

    this.http.post<any>(
      environment.cognitoAuthUrl,
      body.toString(),
      { headers },
    ).subscribe({
      next: response => {
        this.storeTokens(response.id_token, response.access_token);
        resolve();
      },
      error: () => {
        this.logout();
        reject();
      },
    });
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
