import { Stack, StackProps } from 'aws-cdk-lib';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { AaaaRecord, ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

export class DnsRecordStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const zone = HostedZone.fromHostedZoneAttributes(this, 'DailyTrackerZone', {
      zoneName: 'apphosting.link',
      hostedZoneId: 'Z0262069TL55NP8Z6D9Z',
    });

    const distribution = Distribution.fromDistributionAttributes(this, 'ExistingClientDistribution', {
      domainName: 'd1vc8c1dwzab7i.cloudfront.net',
      distributionId: 'E3CW8OEI7O2EGK',
    });

    const recordProps = {
      zone,
      recordName: 'dailytracker',
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    };

    new ARecord(this, 'ARecord', recordProps);
    new AaaaRecord(this, 'AaaaRecord', recordProps);
  }
}
