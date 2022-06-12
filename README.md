# Daily Tracker

## App URL:
https://dailytracker.apphosting.link/

## Sign in URL:
https://auth.dailytracker.apphosting.link/login?client_id=5o7drsppg73j3vu377vqnb6mat&response_type=code&scope=openid&redirect_uri=https%3A%2F%2Fdailytracker.apphosting.link

## Useful CDK commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Docker
PSQL is in a docker container, start this by running `docker-compose up -d --remove-orphans`  

### Some useful commands
- Start all containers  
`docker-compose up -d --remove-orphans`
- Stop all containers, but preserve the data  
`docker-compose stop`  
- Stop all containers and tear them down, removing the data  
`docker-compose down`  
- View running containers  
`docker ps -a`  
- Run a shell in the container  
`docker exec -t -i <container ID or name> /bin/sh`  
- Dump the PSQL schema  
`pg_dump -U postgres -s dailytracker`  
- Combine to dump the schema from the container to your local machine  
`docker exec daily-tracker-database-1 pg_dump -U postgres -s dailytracker > lib/database/schema.sql` 
- Create a database  
`docker exec daily-tracker-database-1 psql -U postgres -c 'create database dailytracker'`   
- Restore the database from the schema file  
`cat ./lib/database/schema.sql | docker exec -i daily-tracker-database-1 psql -U postgres -d dailytracker`  

## Aurora Serverless Data API
Start an SQL transaction by requesting a transaction identifier. Without this, all changes are executed immedieatly. With this, you must end the transaction session to commit changes.  
`aws rds-data begin-transaction --resource-arn "arn:aws:rds:us-east-1:001812633811:cluster:dailytrackerappstage-dai-dailytrackerdbserverless-1ggazp1xm8n8d" --database "dailytracker" --secret-arn "arn:aws:secretsmanager:us-east-1:001812633811:secret:DailyTrackerDBServerlessAur-mdL2kArspLes-BnC2QY" --profile 001812633811_AWSAdministratorAccess`

Run a SQL statement  
`aws rds-data execute-statement --resource-arn "arn:aws:rds:us-east-1:001812633811:cluster:dailytrackerappstage-dai-dailytrackerdbserverless-1ggazp1xm8n8d" --database "dailytracker" --secret-arn "arn:aws:secretsmanager:us-east-1:001812633811:secret:DailyTrackerDBServerlessAur-mdL2kArspLes-BnC2QY" --sql "select column_name from information_schema.columns" --profile 001812633811_AWSAdministratorAccess`

### Migrations
There is a lambda to handle any schema migrations. This is currently kicked off manually. All migration files should be in /lib/database/migrations and follow the format of `{version}_description_of_changes.sql`. Versions are simply incrementing integers.  

### Local DB
See above in Docker for how to get the local db running.  

Connect psql to the container (password is in docker-compose.yml)  
`psql -h localhost -p 5432 -U postgres -d dailytracker`

Create the database  
`psql -h localhost -p 5432 -U postgres -c 'create database dailytracker;'`

Run a specific migration file  
`psql -h localhost -p 5432 -U postgres -d dailytracker -f ./lib/database/migrations/0_create_db_version_table.sql`

Dump the schema file  
`pg_dump -h localhost -p 5432 -U postgres -d dailytracker -s > lib/database/schema.sql`

Restore from the dump  
`psql -h localhost -p 5432 -U postgres -d dailytracker -f ./lib/database/schema.sql`

## Local dev for API services
The services are defined in `lib/service` and are written in TypeScript. To run this locally, we need to compile the TS to JS, and then ensure we have a connection to the local PSQL database instead of serverless Aurora.  
- Run `npm run watch-service` to compile
- Run a new node REPL `node`
- Import the local wrapper `let main; import('./lib/service/dist/out-tsc/service/local.js').then(m => { main = m.main });`
- Now interact with the services. For example, to create a new note: `main.note.createNote('some new note', main.db)`

# Deprecated
Below is no longer used, but useful for learnings  

## Docker
There are a few other containers that are no longer used. Cognito local doesn't support mocking hosted app sign in so we still need to use a real cognito instance making this unnecessary
* a Dockerfile to build and serve the angular app 
* a docker-compose to standup a dev environment for the angular app and a local cognito instance

### Local Cognito
This is using `cognito-local` in a docker container for local emulation of Cognito  
https://github.com/jagregory/cognito-local  
https://hub.docker.com/r/jagregory/cognito-local  
Command used to create local user pool:
```
aws --endpoint http://localhost:9229 cognito-idp create-user-pool --pool-name "DailyTracker-UserPool" --username-attributes email
```

### Angular App
The angular app is built in a container and served through nginx.  
`docker build -t daily-tracker-client-image ./lib/client/app/`  

It can be ran on its own using  
`docker run --name daily-tracker-client-image -d -p 8888:80 daily-tracker-client-image`  

### Local dev
* `docker-compose up -d`
* Client: [localhost:8888](http://localhost:8888)
