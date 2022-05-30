import { Context } from 'aws-lambda';

const client = require('data-api-client');

const database = 'dailytracker';
const resourceArn = 'arn:aws:rds:us-east-1:001812633811:cluster:dailytrackerappstage-dai-dailytrackerdbserverless-1ggazp1xm8n8d';
const secretArn = 'arn:aws:secretsmanager:us-east-1:001812633811:secret:DailyTrackerDBServerlessAur-mdL2kArspLes-BnC2QY';

exports.handler = async function(event: any, context: Context) {
  const db = client({ database, resourceArn, secretArn });

  const { records } = await db.query('select column_name from information_schema.columns;');

  const body = { records };

  return {
    statusCode: 200,
    headers: {'Access-Control-Allow-Origin': '*'},
    body: JSON.stringify(body),
  };
}
