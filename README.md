<h1 align='center'>
  Discord Chores Manager <br/>
</h1>

<p align='center'>
  <i>A Discord bot that keeps track of and notifies roommate chore responsibilities.</i> 
  </br></br>
  <img src='cov-badge.svg'>
  <a href='https://github.com/moromis/chores-bot/actions/workflows/test.yaml'>
    <img src='https://github.com/moromis/chores-bot/actions/workflows/test.yaml/badge.svg'>
  </a>
</p>

## NOTE
Best practice: make two AWS accounts and then configure each with `aws configure --profile <PROFILE_NAME>`, then use `AWS_PROFILE=<PROFILE_NAME>` before yarn commands, e.g. `AWS_PROFILE=cb-dev yarn setup-scheduler`

Also, specifically for generating the SAM template, use `DEV=true yarn generate-template` for your dev environment. It will use a file called `.dev.env` in the root environment if you've created one. You can place your dev AWS credentials there.

Make sure to slide the slider for your Discord bot under `Bot > Privileged Gateway Intents > SERVER MEMBERS INTENT`

## Setup (instructions still in progress)
1. Create a Discord channel for the Chore Bot, and enable developer mode so you can copy IDs from Discord
2. Fill out `.example_env` and rename to `.env`
3. Run `yarn install-deps` to install project dependencies
4. Run `yarn setup`
5. Modify `setup/tables/example_chores.json` as desired so it matches your chore list, then rename it to `chores.json`
6. Create an AWS account
7. Run `yarn setup-iam` (in-progress feature, use created `Bot` user for cli)
8. In the AWS console, navigate to iam/users/Bot, then create an access key for the user. Run `aws configure --profile default` and use the access key and secret access key.
9. Run `yarn setup-scheduler`
10. Deploy with `yarn deploy`
11. Upload the initial chores data with `yarn upload-chores-list`
12. Create a role in your Discord called `chore-boy` and assign it to each user that will be part of the chore rotation
13. There will now be daily, weekly, and monthly scheduled jobs that will take care of all chore assignments etc., and slash commands will be registered in your Discord guild


## Features
- DynamoDB
- Lambda Functions with proxy Function for commands
- SAM stack, uses CloudFormation to setup app based on template yaml
- Automatic new chore assignments weekly
- Automatic chore reminders daily
- Easy new chore additions (in progress)
