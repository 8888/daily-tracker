const angularAppUrl = 'http://localhost:4200/';
const cognitoUrl = 'https://auth.dailytracker.apphosting.link/';

const cognitoAuthUrl = `${cognitoUrl}oauth2/token`;

const userPoolClientId = '5o7drsppg73j3vu377vqnb6mat';
const userPoolClientRedirectUri = angularAppUrl;
const loginUrl = `${cognitoUrl}login?client_id=${userPoolClientId}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(userPoolClientRedirectUri)}`;

export const environment = {
  production: false,
  cognitoAuthUrl,
  userPoolClientId,
  userPoolClientRedirectUri,
  loginUrl,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
