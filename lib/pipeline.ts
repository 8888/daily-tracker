import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { AppStage } from './app-stage';

export class Pipeline extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const pipeline = new CodePipeline(this, 'DailyTrackerCodePipeline', {
      pipelineName: 'DailyTrackerPipeline',
      crossAccountKeys: true,
      dockerEnabledForSynth: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection('8888/daily-tracker', 'main', {
          connectionArn: 'arn:aws:codestar-connections:us-east-1:293675922272:connection/63408913-2605-497c-94f6-0945b4152d8d',
        }),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    pipeline.addStage(new AppStage(this, 'DailyTrackerAppStage', {
      // prod account
      env: { account: '001812633811', region: 'us-east-1' },
    }));
  }
}
