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

There are a few other containers that are no longer used. Cognito local doesn't support mocking hosted app sign in so we still need to use a real cognito instance making this unnecessary
* a Dockerfile to build and serve the angular app 
* a docker-compose to standup a dev environment for the angular app and a local cognito instance

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
