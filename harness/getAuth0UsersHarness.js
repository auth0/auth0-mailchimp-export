'use strict';

/**
 *  JUST FOR TESTING THE CORE LOGIC ONLY - NOT PART OF EXTENSION
 */

var TENANT_DOMAIN = 'YOUR_TENANT.auth0.com';
var USER_SEARCH_MGMT_TOKEN = 'YOUR_USER_SEARCH_MANAGEMENT_TOKEN';
var AUTH0_CONNECTION_NAME = 'YOUR_AUTH0_CONNECTION_NAME';

var config = {
  TENANT_DOMAIN: TENANT_DOMAIN,
  USER_SEARCH_MGMT_TOKEN: USER_SEARCH_MGMT_TOKEN,
  AUTH0_CONNECTION_NAME: AUTH0_CONNECTION_NAME
};

var getAuth0Users = require('./../scripts/getAuth0Users')(config);

getAuth0Users(function (err, users) {
  if (err) {
    console.error('Error occurred');
    console.error(err);
    return;
  }
  console.log('all good, working');
  console.log('users count: ' + users.length);
});
