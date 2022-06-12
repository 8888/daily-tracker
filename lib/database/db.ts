const client = require('data-api-client');

export type DBConnection = {
  query: (sql: string, params?: [] | unknown) => Promise<any>,
}

export class DB implements DBConnection {
  private database = 'dailytracker';
  private resourceArn = 'arn:aws:rds:us-east-1:001812633811:cluster:dailytrackerappstage-dai-dailytrackerdbserverless-1ggazp1xm8n8d';
  private secretArn = 'arn:aws:secretsmanager:us-east-1:001812633811:secret:DailyTrackerDBServerlessAur-mdL2kArspLes-BnC2QY';
  private connection = client({
    database: this.database,
    resourceArn: this.resourceArn,
    secretArn: this.secretArn
  });

  public async query(sql: string, params?: [] | unknown) {
    return this.connection.query(sql, params);
  }
}
