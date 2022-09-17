# LetsUnstuck API
This is the api that powers the [Lets unstuck](https://letsunstuck.com) website.

## Tech
- backend: [Cloudflare workers](https://workers.cloudflare.com/)
- language: [TS](https://typescriptlang.org) 
- database: [Planetscale](https://planetscale.com/)

## How to setup
- Clone this repo first & install npm packages. Install node `16.17.0` and use it for this project.
```shell
git clone https://github.com/abhisekpadhi/letsunstuck-api.git

cd letsunstuck-api

nvm use 16.17.0

yarn
```
- Create API Token from cloudflare dashboard. [Click here](https://dash.cloudflare.com/profile/api-tokens) to create token.
```shell
0. Click on Create API token
1. Choose template "Edit Cloudflare Workers"
2. Account Resource: Include > All accounts
3. Zone Resouces: Include > All zones
4. Continue to summary & copy the token
```
- Setup wrangler. Install & paste the token from the previous step when prompted at config.  
```shell
npm install -g wrangler

wrangler config
```
- Create a `wrangler.toml` file in the project root, with the following content:
```toml
name = "---replace with name of worker project in cloudflare---" # todo
main = "./src/index.ts"
compatibility_date = "2022-05-03"
account_id = "---replace with cloudflare account id---"
```
- Add secrets
```shell
echo "-replace with planetscale host-" | wrangler secret put PSCALE_HOST
echo "-replace with planetscale username-" | wrangler secret put PSCALE_USERNAME
echo "-replace with planetscale password-" | wrangler secret put PSCALE_PASSWORD
```
- Run the project
```shell
wrangler dev
```
- Publish changes to cloudflare
```shell
wrangler publish
```

---

## Misc
- To initialise a fresh new project.
```shell
yarn create cloudflare letsunstuck-api worker-typescript

cd letsunstuck-api

yarn
```
