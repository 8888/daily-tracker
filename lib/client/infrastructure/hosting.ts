import { CloudFrontAllowedMethods, CloudFrontWebDistribution, OriginAccessIdentity, ViewerCertificate } from 'aws-cdk-lib/aws-cloudfront';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';

export class Hosting extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const hostingBucket = new Bucket(this, 'DailyTrackerHostingBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    const cloudfrontOAI = new OriginAccessIdentity(this, 'cloudfront-OAI', {
      comment: `OAI for ${id}`,
    });

    // grant access to CloudFront
    hostingBucket.addToResourcePolicy(new PolicyStatement({
      actions: [ 's3:GetObject' ],
      resources: [ hostingBucket.arnForObjects('*') ],
      principals: [ new CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId) ],
    }));

    const certArn = 'arn:aws:acm:us-east-1:001812633811:certificate/6499df28-33f7-428a-8889-5005991a49aa';
    const certificate = Certificate.fromCertificateArn(this, 'certificate', certArn);
    const viewerCertificate = ViewerCertificate.fromAcmCertificate(certificate, {
      aliases: [ 'dailytracker.apphosting.link' ],
    });

    const distribution = new CloudFrontWebDistribution(this, 'SiteDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: hostingBucket,
            originAccessIdentity: cloudfrontOAI,
          },
          behaviors: [{
            isDefaultBehavior: true,
            compress: true,
            allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
          }],
        },
      ],
      viewerCertificate,
    });

    new BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [ Source.asset('./lib/client/app/dist/daily-tracker') ],
      destinationBucket: hostingBucket,
      distribution,
      distributionPaths: ['/*'], // this invalidates the cloudfront distribution
    });
  }
}
