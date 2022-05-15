import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Pipeline } from './pipeline';

export class DailyTrackerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new Pipeline(this, 'DailyTrackerPipeline');
  }
}
