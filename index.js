const core = require('@actions/core');
const github = require('@actions/github');
const { IncomingWebhook } = require('@slack/webhook');
const { WebClient } = require('@slack/web-api');

try {
  const slackchannel = core.getInput('slack-channel');
  console.log(`channel to send feedback: ${slackchannel}`);

  const message = core.getInput('message');
  
  //Web api option
  const token = core.getInput('slack-token');  

  //create an attachment to provide more details in a message
  (async () => {
    try {
        let attachment = {};
        attachment.fallback = core.getInput('fallback', {
            required: false
        });
        attachment.color = core.getInput('color', {
            required: false
        });
        attachment.pretext = core.getInput('pretext', {
            required: false
        });
        attachment.author_name = core.getInput('author_name', {
            required: false
        });
        attachment.author_link = core.getInput('author_link', {
            required: false
        });
        attachment.author_icon = core.getInput('author_icon', {
            required: false
        });
        attachment.title = core.getInput('title', {
            required: false
        });
        attachment.title_link = core.getInput('title_link', {
            required: false
        });
        attachment.text = core.getInput('text', {
            required: false
        });
        attachment.image_url = core.getInput('image_url', {
            required: false
        });
        attachment.thumb_url = core.getInput('thumb_url', {
            required: false
        });
        attachment.footer = core.getInput('footer', {
            required: false
        });
        attachment.footer_icon = core.getInput('footer_icon', {
            required: false
        });
        const channel = core.getInput('channel', {
        required: false
        });
        const icon_url = core.getInput('icon_url', {
        required: false
        });
        const username = core.getInput('username', {
        required: false
        });
        const conversationId = core.getInput('username', {
            required: false
        });
    
        const messageResult = await new WebClient(token).chat.postMessage({
            channel: slackchannel,
            username: "web api",
            text: `Github action (${process.env.GITHUB_WORKFLOW}) - ${message}\n`,
            attachments: [
                {
                  "title": `${process.env.GITHUB_REPOSITORY}`,
                  "title_link": `https://github.com/${process.env.GITHUB_REPOSITORY}`,
                  "color": attachment.color,
                  "text": `${process.env.GITHUB_REF}`,
                  "author_name": `${process.env.GITHUB_ACTOR}`,
                        "author_link": `https://github.com/${process.env.GITHUB_ACTOR}`,
                        "author_icon": `https://github.com/${process.env.GITHUB_ACTOR}.png`,
                  "footer": `action -> ${process.env.GITHUB_EVENT_NAME}`,
                },
                attachment
              ]
        });
        
        // The result contains an identifier for the message, `ts`.
        console.log(`Successfully sent message ${messageResult.ts} in conversation ${conversationId}`);
    }
    catch(error)
    {
        core.setFailed(error.message);
    }
  })();
   
  //Webhook option
  const webhookUrl = core.getInput('slack-channel-webhook');
  
  if (webhookUrl)
  {
    const webhook = new IncomingWebhook(webhookUrl);

    // Send the notification
    (async () => {
        try
        {
            await webhook.send({
                text: message,
            });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    })();
  }

  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}