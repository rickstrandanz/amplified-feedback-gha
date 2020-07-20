# amplified-feedback-gha
Summary:

Spike to explore Pipeline Feedback from Github Actions to various channels (ex: Slack) - https://jira.service.anz/browse/ABT-9744

This poc only explores Github Actions integration with Slack. Cloud Build appears to have slack integration built in: https://cloud.google.com/cloud-build/docs/configuring-notifications/configure-slack

There are 2 approaches, using webhooks or a bot to send the notifications. Web hooks are straight forward but you need to create a new webook for each channel that received notifications. The bot approach the user can specify a channel without the need for creating a webhook.

### Table of Contents

- Pre-requisites
- How to run
- Risk and Limitations
- Next Steps

### 1 Pre-requisites

- Node.js 12.x
- git    
- Slack Node SDK https://github.com/slackapi/node-slack-sdk
 - @slack/webapi @slack/webhook
- Github Actions Node Toolkit https://github.com/actions/toolkit
 - @actions/core @actions/github

### 2 How to run

2.1 Test on this repo

Clone and push up a change and review the output on the ANZx Slack channel `#cicd-feedback-poc` https://anzx.slack.com/archives/C017WDC1YMN

2.2 Test on your own repo with your own Slack app

Setup a Slack app in the ANZx organization, store a few secrets in your repo

- Add a new Slack app https://api.slack.com/apps
 - Provide a unique app name and select anzx as the Slack workspace
- Add `Incoming Webhooks` feature
 - Create a webhook for the desired channel and store the URL as a secret in your repository `CHANNEL_CHANNEL_NAME`. Make sure to update the [actions file](https://github.com/rickstrandanz/amplified-feedback-gha/blob/master/.github/workflows/main.yml) and specify this new secret.
- Add `Bots` feature:
 - Add the following [scopes](https://api.slack.com/scopes) to the bot 
  - `chat:write`
  - `chat:write:public`
 - Store the `Bot User OAuth Access Token` as the secret `SLACK_TOKEN`

2.3 Usage

In your [actions file](https://github.com/rickstrandanz/amplified-feedback-gha/blob/master/.github/workflows/main.yml) create notifications where required using the following syntax:

For the bot, you can specify any channel to send notifications to. To get the channel id, right click on the channel and copy the link. The id will be the last value in the url. For example: `cicd-feedback-poc` -> https://anzx.slack.com/archives/C017WDC1YMN

```
- name: Amplified Feedback action step
  uses: ./ # Uses an action in the root directory
  id: amplified-feedback
  with:
    slack-token: ${{ secrets.SLACK_TOKEN }} #token used by our app slack bot
    slack-channel: 'C017WDC1YMN' #cicd-feedback-poc where the slack bot posts the notification
    slack-channel-webhook: ${{ secrets.CHANNEL_CICD_FEEDBACK_POC }}
    message: 'Workflow triggered :nerd_face:' #send a notification that this step in the workflow had been triggered
```

### Risks and Limitations

### Next Steps

- Decide on the bot or webhook approach (or both)
- Further work to publish the action
- Feedback and approval for security
- Looking into any other potential integrations