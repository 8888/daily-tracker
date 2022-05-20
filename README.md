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

## Local dev
* `docker-compose up -d`
* `npm --prefix ./lib/client/app run start`

### Angular App
The angular app is built in a container and served through nginx.
`docker build -t daily-tracker-client-image ./lib/client/app/`
It can be ran on its own using
`docker run --name daily-tracker-client-image -d -p 8888:80 daily-tracker-client-image`

### Cognito
This is using `cognito-local` in a docker container for local emulation of Cognito  
https://github.com/jagregory/cognito-local  
https://hub.docker.com/r/jagregory/cognito-local  
Command used to create local user pool:
```
aws --endpoint http://localhost:9229 cognito-idp create-user-pool --pool-name "DailyTracker-UserPool" --username-attributes email
```
