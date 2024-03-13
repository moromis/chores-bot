<h1 align='center'>
  Discord Chores Manager <br/>
</h1>

<p align='center'>
  <i>A Discord bot that keeps track of and notifies roommate chore responsibilities.</i> 
  </br></br>
  <a href='https://github.com/moromis/chores-bot/actions/workflows/test.yaml'>
    <img src='cov-badge.svg'>
  </a>
</p>

## Setup (instructions still in progress)
1. Fill out `.example_env` and rename to `.env`
2. Run `yarn` to install project dependencies
3. Run `yarn setup`
4. Modify `setup/tables/chores.json` as desired so it matches your chore list
5. Create an AWS account
5. NOT DONE: setup iam role for deployment - for now this can be done manually by creating a role and adding the policies mentioned in [this note](./setup/iam_user/NOTE.md) to it. Then login to the aws cli with that role.
6. Run `yarn setup-scheduler`
7. Deploy with `yarn deploy`
8. Upload the initial chores data with `yarn upload-chores-list`


## Features
- DynamoDB
- Lambda Functions with proxy Function for commands
- SAM stack, uses CloudFormation to setup app based on template yaml
- Automatic new chore assignments weekly
- Automatic chore reminders daily
- Easy new chore additions
