const angularAppUrl = 'http://0.0.0.0:8888/';
const cognitoUrl = 'http://0.0.0.0:9229/';

const cognitoAuthUrl = `${cognitoUrl}oauth2/token`;

const userPoolClientId = 'local_4Js6VY0h';
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
