'use strict';

/**
 *  JUST FOR TESTING THE CORE LOGIC ONLY - NOT PART OF EXTENSION
 */

var syncWithMailChimp = require('./../scripts/syncWithMailChimp');

var TENANT_DOMAIN = 'YOUR_TENANT.auth0.com';
var USER_SEARCH_MGMT_TOKEN = 'YOUR_USER_SEARCH_MANAGEMENT_TOKEN';
var MAILCHIMP_API_KEY = 'YOUR_MAILCHIMP_API_KEY';
var MAILCHIMP_LIST_NAME = 'YOUR_MAILCHIMP_LIST_NAME';
var AUTH0_CONNECTION_NAME = 'YOUR_AUTH0_CONNECTION_NAME';

var config = {
  TENANT_DOMAIN: TENANT_DOMAIN,
  USER_SEARCH_MGMT_TOKEN: USER_SEARCH_MGMT_TOKEN,
  MAILCHIMP_API_KEY: MAILCHIMP_API_KEY,
  MAILCHIMP_LIST_NAME: MAILCHIMP_LIST_NAME,
  AUTH0_CONNECTION_NAME: AUTH0_CONNECTION_NAME
};

syncWithMailChimp(config).then(function () {
  console.log('Completed successfully');
}, function (err) {
  console.error('Error occurred');
  console.error(err);
} );
