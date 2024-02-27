cd sam-app
npm install
node generate_template/generate.js
node register_commands/register.js
sam build
sam deploy