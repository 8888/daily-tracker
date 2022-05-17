import { Stack, StackProps } from 'aws-cdk-lib';
import { AaaaRecord, ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

export class DnsRecordStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const zone = HostedZone.fromHostedZoneAttributes(this, 'DailyTrackerZone', {
      zoneName: 'apphosting.link',
      hostedZoneId: 'Z0262069TL55NP8Z6D9Z',
    });

    const recordProps = {
      zone,
      recordName: 'dailytracker',
      target: RecordTarget.fromValues('https://d1vc8c1dwzab7i.cloudfront.net'),
    };

    new ARecord(this, 'ARecord', recordProps);
    new AaaaRecord(this, 'AaaaRecord', recordProps);
  }
}
