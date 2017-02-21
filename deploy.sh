#!/usr/bin/env bash

echo "stopping running application"
ssh $DEPLOY_USER@$DEPLOY_HOST 'docker stop ngage-socket'
ssh $DEPLOY_USER@$DEPLOY_HOST 'docker rm ngage-socket'

echo "pulling latest version of the code"
ssh $DEPLOY_USER@$DEPLOY_HOST 'docker pull nanongage/ngage-socket:latest'

echo "starting the new version"
ssh $DEPLOY_USER@$DEPLOY_HOST 'docker run -d --restart=always --name ngage-socket -p 5500:5500 nanongage/ngage-socket:latest'

echo "success!"

exit 0