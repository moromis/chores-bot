echo $DEV
echo $AWS_PROFILE
rm -rf .aws-sam
yarn
yarn generate-template
yarn register-commands
sam build
sam deploy