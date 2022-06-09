import { Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';

const s3 = new S3();

const client = require('data-api-client');

const database = 'dailytracker';
const resourceArn = 'arn:aws:rds:us-east-1:001812633811:cluster:dailytrackerappstage-dai-dailytrackerdbserverless-1ggazp1xm8n8d';
const secretArn = 'arn:aws:secretsmanager:us-east-1:001812633811:secret:DailyTrackerDBServerlessAur-mdL2kArspLes-BnC2QY';

const bucketName = process.env.BUCKET;

const headers = { 'Access-Control-Allow-Origin': '*' };

exports.handler = async function(event: any, context: Context) {
  const schemaVersion = 0; // fetch from DB

  if (bucketName) {
    const migrationFiles = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    const fileKeys = migrationFiles.Contents?.map(f => f.Key);

    if (fileKeys && fileKeys.length > schemaVersion) {
      // run schema migrations
      const keys = fileKeys.slice(schemaVersion);
      const files = [];

      keys.forEach(async key => {
        const file = await s3.getObject({ Bucket: bucketName, Key: key! }).promise();
        console.log('*** file contents ***')
        console.log(file.Body?.toString());
        files.push(file.Body?.toString());
      });

      const db = client({ database, resourceArn, secretArn });
      const { records } = await db.query('select schema_name from information_schema.schemata;');
      const body = { records, fileKeys };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(body),
      };
    } else {
      // no migrations to run
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'No migrations to run!' }),
      };
    }
  } else {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'No migrations bucket found!' }),
    };
  }

}
