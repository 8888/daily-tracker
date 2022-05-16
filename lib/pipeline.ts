import { LinuxBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { AppStage } from './app-stage';

export class Pipeline extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const repo = CodePipelineSource.connection('8888/daily-tracker', 'main', {
      connectionArn: 'arn:aws:codestar-connections:us-east-1:293675922272:connection/63408913-2605-497c-94f6-0945b4152d8d',
    });

    const buildAngularAction = new CodeBuildStep('Build', {
      input: repo,
      // working directory is the project root
      installCommands: [
        'cd lib/client/app',
        'npm ci',
        'wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb --no-verbose',
        'apt -q install ./google-chrome-stable_current_amd64.deb',
      ],
      // working directory remains the same from the state of installCommands
      commands: [
        'npm run test:ci',
        'npm run build',
      ],
      buildEnvironment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
      },
      primaryOutputDirectory: './',
    });

    const synthAction = new ShellStep('Synth', {
      input: buildAngularAction,
      // working directory is the project root
      commands: [
        'npm ci',
        'npm run build',
        'npx cdk synth',
      ],
      primaryOutputDirectory: 'cdk.out',
    });

    const pipeline = new CodePipeline(this, 'DailyTrackerCodePipeline', {
      pipelineName: 'DailyTrackerPipeline',
      crossAccountKeys: true,
      dockerEnabledForSelfMutation: true,
      synth: synthAction,
    });

    pipeline.addStage(new AppStage(this, 'DailyTrackerAppStage', {
      // prod account
      env: { account: '001812633811', region: 'us-east-1' },
    }));
  }
}
