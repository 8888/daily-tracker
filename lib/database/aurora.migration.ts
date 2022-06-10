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
  const db = client({ database, resourceArn, secretArn });

  const lastVersion = await db.query('select version from db_version order by id desc limit 1;');
  const schemaVersion = parseInt(lastVersion[0].version);
  console.log(`schemaVersion ${schemaVersion}`);

  if (bucketName) {
    const migrationFiles = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    const fileKeys = migrationFiles.Contents?.map(f => f.Key!);

    if (fileKeys && fileKeys.length > schemaVersion) {
      // run schema migrations
      const keys = fileKeys.slice(schemaVersion + 1);
      console.log('s3 bucket keys:');
      console.log(keys);
      const results: {key:string, records: string}[] = [];

      for (const key of keys) {
        const file = await s3.getObject({ Bucket: bucketName, Key: key! }).promise();
        const contents = file.Body?.toString();

        console.log(`running migration ${key}`);
        console.log(contents);

        // don't anyone do this anywhere real please =)
        const { records } = await db.query(contents);
        console.log(records);
        results.push({ key, records });

        const version = key.split('_')[0];
        await db.query(
          `insert into db_version (version, updated_at) values (:version, current_timestamp)`,
          { version },
        );
      }

      const body = { results };

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
