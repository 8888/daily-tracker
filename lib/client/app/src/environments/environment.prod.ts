const angularAppUrl = 'https://dailytracker.apphosting.link/';
const cognitoUrl = 'https://auth.dailytracker.apphosting.link/';

const cognitoAuthUrl = `${cognitoUrl}oauth2/token`;

const userPoolClientId = '5o7drsppg73j3vu377vqnb6mat';
const userPoolClientRedirectUri = angularAppUrl;
const loginUrl = `${cognitoUrl}login?client_id=${userPoolClientId}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(userPoolClientRedirectUri)}`;

export const environment = {
  production: true,
  cognitoAuthUrl,
  userPoolClientId,
  userPoolClientRedirectUri,
  loginUrl,
};
