var express = require('express');
var app = express();
var memoizer = require('lru-memoizer');
var Request = require('superagent');
var syncWithMailChimp = require('./scripts/syncWithMailChimp');
var metadata = require('./webtask.json');

function job (req, res) {

  var ctx = req.webtaskContext;

  var required_settings = [
    'AUTH0_DOMAIN',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'MAILCHIMP_API_KEY',
    'MAILCHIMP_LIST_NAME',
    'AUTH0_CONNECTION_NAME'
  ];

  var missing_settings = required_settings.filter(function (setting) {
    return !ctx.data[setting];
  });

  if (missing_settings.length) {
    return res.status(400).send({message: 'Missing settings: ' + missing_settings.join(', ')});
  }

  var config = {
    TENANT_DOMAIN: req.webtaskContext.data.AUTH0_DOMAIN,
    USER_SEARCH_MGMT_TOKEN: req.access_token,
    MAILCHIMP_API_KEY: ctx.data.MAILCHIMP_API_KEY,
    MAILCHIMP_LIST_NAME: ctx.data.MAILCHIMP_LIST_NAME,
    AUTH0_CONNECTION_NAME: ctx.data.AUTH0_CONNECTION_NAME,
  };

  requestMailChimpSync(config, function (err) {
    if (err) {
      return res.sendStatus(500).send('Error - please see logs for details');
    }
    return res.status(200).send('All done!');
  });
}

function requestMailChimpSync (config, cb) {
  syncWithMailChimp(config).then(function () {
    return cb();
  }, function (err) {
    return cb(err);
  } );
}

var getTokenCached = memoizer({
  load: function (apiUrl, audience, clientId, clientSecret, cb) {
    Request
      .post(apiUrl)
      .send({
        audience: audience,
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      })
      .type('application/json')
      .end(function (err, res) {
        if (err || !res.ok) {
          cb(null, err);
        } else {
          cb(res.body.access_token);
        }
      });
  },
  hash: function (apiUrl) { return apiUrl },
  max: 100,
  maxAge: 1000 * 60 * 60
});

app.use(function (req, res, next) {
  // Exclude /meta from authz
  if (req.path === '/meta') {
    return next();
  }

  var apiUrl       = 'https://' + req.webtaskContext.data.AUTH0_DOMAIN + '/oauth/token';
  var audience     = 'https://' + req.webtaskContext.data.AUTH0_DOMAIN + '/api/v2/';

  var clientId     = req.webtaskContext.data.AUTH0_CLIENT_ID;
  var clientSecret = req.webtaskContext.data.AUTH0_CLIENT_SECRET;

  getTokenCached(apiUrl, audience, clientId, clientSecret, function (access_token, err) {
    if (err) {
      console.error('Error getting access_token', err);
      return next(err);
    }

    req.access_token = access_token;
    // console.log(req.access_token);
    next();
  });
});

app.get ('/', job);
app.post('/', job);

app.get('/meta', function (req, res) {
  res.status(200).send(metadata);
});

module.exports = app;
