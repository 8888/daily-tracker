import { Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';

const s3 = new S3();

const client = require('data-api-client');

const database = 'dailytracker';
const resourceArn = 'arn:aws:rds:us-east-1:001812633811:cluster:dailytrackerappstage-dai-dailytrackerdbserverless-1ggazp1xm8n8d';
const secretArn = 'arn:aws:secretsmanager:us-east-1:001812633811:secret:DailyTrackerDBServerlessAur-mdL2kArspLes-BnC2QY';

const bucketName = process.env.BUCKET;

exports.handler = async function(event: any, context: Context) {
  if (bucketName) {
    const migrationFiles = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    const fileKeys = migrationFiles.Contents?.map(f => f.Key);

    if (fileKeys) {
      const file = await s3.getObject({
        Bucket: bucketName,
        Key: fileKeys[0]!,
      });
      console.log(file);
    }

    const db = client({ database, resourceArn, secretArn });
    const { records } = await db.query('select schema_name from information_schema.schemata;');
    const body = { records, fileKeys };

    return {
      statusCode: 200,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify(body),
    };
  } else {
    return {
      statusCode: 500,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify({ message: 'No migrations bucket found!' }),
    };
  }

}
