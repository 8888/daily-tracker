import { Stack, StackProps } from 'aws-cdk-lib';
import { CnameRecord, HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

export class DnsRecordStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const zone = HostedZone.fromHostedZoneAttributes(this, 'DailyTrackerZone', {
      zoneName: 'apphosting.link',
      hostedZoneId: 'Z0262069TL55NP8Z6D9Z',
    });

    new CnameRecord(this, 'CnameRecord', {
      zone,
      recordName: 'dailytracker',
      domainName: 'https://d1vc8c1dwzab7i.cloudfront.net',
    });
  }
}
