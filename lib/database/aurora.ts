import { Duration } from 'aws-cdk-lib';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
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

    // By default, the construct will use the name of the defining file and the construct's id to look up the entry file.
    // this will find aurora.migration.ts
    // hanlder method will default to 'handler'
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
    const migrationHandler = new NodejsFunction(this, 'migration', {
      timeout: Duration.seconds(6),
    });

    migrationHandler.addToRolePolicy(PolicyStatement.fromJson({
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "rds-data:BatchExecuteStatement",
        "rds-data:BeginTransaction",
        "rds-data:CommitTransaction",
        "rds-data:ExecuteStatement",
        "rds-data:RollbackTransaction"
      ],
      "Resource": "*",
    }));
  }
}
