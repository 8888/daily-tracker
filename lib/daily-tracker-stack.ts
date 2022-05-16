import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Hosting } from './client/infrastructure/hosting';
import { IdentityManagement } from './identity-management';

export class DailyTrackerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new IdentityManagement(this, 'DailyTrackerIdM');
    new Hosting(this, 'DailyTrackerClientHosting');
  }
}
