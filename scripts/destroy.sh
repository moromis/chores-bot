echo $AWS_PROFILE

# from https://stackoverflow.com/questions/1885525/how-do-i-prompt-a-user-for-confirmation-in-bash-script
read -p "This will delete EVERYTHING and you will have to re-deploy. All your data will be GONE. Are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd ..
    sam delete
    echo "Done with sam delete"
    aws cloudformation delete-stack --stack-name sam-app
    echo "Done with cloudformation delete-stack"
fi