import { Construct } from 'constructs';
import { OAuthScope, UserPool } from 'aws-cdk-lib/aws-cognito';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';

export class IdentityManagement extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const userPool = new UserPool(this, 'UserPool', {
      userPoolName: 'DailyTracker-UserPool',
      selfSignUpEnabled: false,
      userInvitation: {
        emailSubject: 'Invite to join Daily Tracker!',
        emailBody: 'Hello {username}, you have been invited to join Daily Tracker! Your temporary password is {####}',
      },
      signInAliases: {
        email: true,
        username: false,
      },
      autoVerify: { email: true },
      standardAttributes: {
        givenName: { required: true },
        familyName: { required: true },
        email: { required: true },
      },
    });

    userPool.addClient('customer-app-client', {
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [ OAuthScope.OPENID ],
        callbackUrls: [ 'https://dailytracker.apphosting.link' ],
      },
      preventUserExistenceErrors: true,
    });

    const certArn = 'arn:aws:acm:us-east-1:001812633811:certificate/9db653a2-71f6-4ec9-b6ea-da5ee1cbb99b';
    const certificate = Certificate.fromCertificateArn(this, 'certificate', certArn);

    userPool.addDomain('CognitoDomain', {
      customDomain: {
        domainName: 'auth.dailytracker.apphosting.link',
        certificate,
      },
    });
  }
}
