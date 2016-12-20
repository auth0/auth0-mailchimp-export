# Auth0 MailChimp Export 

[![Auth0 Extensions](http://cdn.auth0.com/extensions/assets/badge.svg)](https://sandbox.it.auth0.com/api/run/auth0-extensions/extensions-badge?webtask_no_cache=1)

This extension allows Auth0 Customers to synchronize their Auth0 User base (those that have an email) with a MailChimp List.
From within MailChimp, it is then possible to leverage all the benefits of marketing emails, automated messages and targeted campaigns.

More than 14 million people and businesses around the world use MailChimp. 
The MailChimp features and integrations allow you to send marketing emails, automated messages, and targeted campaigns. 
And the detailed reports help you keep improving over time.

For further information on MailChimp - please see https://mailchimp.com/about/
This extension was inspired by this [mailchimp forum post](https://auth0.com/forum/t/synching-auth0-users-to-mailchimp/831) by Eugenio.

## TODO 

Review and address the Issues raised as part of code review.

## Configure Webtask

If you haven't configured Webtask on your machine run this first:

```
npm i -g wt-cli
wt init
```

> Requires at least node 4.2.2 - if you're running multiple version of node make sure to load the right version, e.g. "nvm use 4.2.2"

## Running locally

To run the sample locally:

1. Create an application (client) in [Auth0](https://manage.auth0.com/#/applications)
2. Go to [Auth0 API Management](https://auth0.com/docs/api/management/v2#!/Client_Grants/post_client_grants) and create a Client Grant.

```javascript
{
	"audience": "https://YOUR_TENANT.auth0.com/api/v2/",
	"client_id":"YOUR_CLIENT_ID",
	"scope": ["read:users", "read:user_idp_tokens"]
}
```
3. Run `npm install`
4. Run 

```bash
webpack && \
wt serve build/bundle.js --port 3000 --no-merge \
--secret AUTH0_DOMAIN="YOUR_TENANT.auth0.com" \
--secret AUTH0_CLIENT_ID="YOUR_CLIENT_ID" \
--secret AUTH0_CLIENT_SECRET="YOUR_CLIENT_SECRET" \
--secret MAILCHIMP_API_KEY="YOUR_MAILCHIMP_API_KEY" \
--secret MAILCHIMP_LIST_NAME="YOUR_MAILCHIMP_LIST_NAME" \
--secret AUTH0_CONNECTION_NAME="YOUR_AUTH0_CONNECTION_NAME" 
```

Then, in separate terminal, just `curl 0.0.0.0:3000` to execute.


Note: The client and client grant creating will be automatically when deploying though [Auth0 Extensions](https://manage.auth0.com/#/extensions).

Note: For more information about how to get `your_tenant_profile`, click [here](https://manage.auth0.com/#/account/webtasks).

## Deploying to Auth0 Extensions

1. Go to [Auth0 Extensions](https://manage.auth0.com/#/extensions)
2. Click on `+ Create Extension`
3. Fill in the textbox with your GitHub repository URL
4. Click on `continue`
5. Finally, click on `install`

## Usage

Go to your mailchimp account and inspect the List (Lists -> List Name).
Here you will see a synchronized list of email users that correspond to those defined in your Auth0 Connection (that have email addresses)

You can retrieve your MailChimp API key from (Account -> Extras -> API Keys)

For information on getting started with MailChimp API documentation, please refer to:

[MailChimp Documentation](http://developer.mailchimp.com/documentation/mailchimp/)


## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section.


