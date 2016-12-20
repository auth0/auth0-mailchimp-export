'use strict';

var MailChimpAPI = require('mailchimp').MailChimpAPI;
var async = require('async');
var Q = require("q");

var syncWithMailChimp = function (config) {
  var MAILCHIMP_API_KEY = config.MAILCHIMP_API_KEY;
  try {
    var mailchimp = new MailChimpAPI(MAILCHIMP_API_KEY, {version: '2.0'});
  } catch (error) {
    return console.log(error.message);
  }
  var _getAuth0Users = require('./getAuth0Users')(config);
  var _getMailChimpListMatchingName = require('./getMailChimpListMatchingName')(config, mailchimp);
  var _mergeAuth0UsersIntoMailChimp = require('./mergeAuth0UsersIntoMailChimp')(config, mailchimp);

  var deferred = Q.defer();

  async.waterfall([
      _getAuth0Users,
      _getMailChimpListMatchingName,
      _mergeAuth0UsersIntoMailChimp
    ],
    function (err) {
      if (err) {
        console.error(err);
        return deferred.reject(new Error(err));
      }
      return deferred.resolve();
    }
  );
  return deferred.promise;
};

module.exports = syncWithMailChimp;
