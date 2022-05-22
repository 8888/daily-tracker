import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseClusterEngine, ParameterGroup, ServerlessCluster } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

export class AuroraDatabase extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new Vpc(this, 'VPC', {
      subnetConfiguration: [
        {
          name: 'Database',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    const dbName = 'dailytracker';
    const cluster = new ServerlessCluster(this, 'ServerlessAuroraCluster', {
      defaultDatabaseName: dbName,
      engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
      vpc,
      enableDataApi: true,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      parameterGroup: ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql10')
    });
  }
}
