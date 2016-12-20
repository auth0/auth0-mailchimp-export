'use strict';

var request = require('request');
var R = require('ramda');
var Q = require("q");


var getUsers = function (config, allUsers, perPage, pageNumber) {

  var TENANT_DOMAIN = config.TENANT_DOMAIN;
  var USER_SEARCH_MGMT_TOKEN = config.USER_SEARCH_MGMT_TOKEN;
  var AUTH0_CONNECTION_NAME = config.AUTH0_CONNECTION_NAME;

  var deferred = Q.defer();
  var searchCriteria = { q: 'identities.connection:"' + AUTH0_CONNECTION_NAME + '"', search_engine: 'v2', per_page: perPage, page: pageNumber, fields: 'email', include_fields: 'true' };

  var options = {
    method: 'GET',
    url: 'https://' + TENANT_DOMAIN + '/api/v2/users',
    qs: searchCriteria,
    headers: {
      'cache-control': 'no-cache',
      authorization: 'Bearer ' + USER_SEARCH_MGMT_TOKEN
    }
  };
  request(options, function (error, response, body) {
    if (error) {
      return deferred.reject(new Error(error));
    }
    var newUsers = JSON.parse(body);
    if (newUsers.length > 0) {
      allUsers = R.concat(allUsers, newUsers);
      return deferred.resolve(getUsers(config, allUsers, perPage, pageNumber + 1));
    }
    return deferred.resolve(allUsers);
  });
  return deferred.promise;
};

var getAuth0Users = function (config) {
  return function (callback) {
    getUsers(config, [], 20, 0).then(function (users) {
      var totalUsers = users.length;
      console.log('Total number of Auth0 users: ' + totalUsers);
      return callback(null, users);
    }, function (err) {
      console.error('ERROR: ' + err);
      callback(err);
    });
  };
};

module.exports = getAuth0Users;
