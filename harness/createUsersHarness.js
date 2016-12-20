'use strict';

/**
 *  JUST FOR TESTING THE CORE LOGIC ONLY - NOT PART OF EXTENSION
 */

const request = require('request');

const path = "/dbconnections/signup";
const domain = 'tenantname.auth0.com';
const clientid = 'your client id';
const url = `https://${domain}${path}`;

console.log(`Creating users, clientid: ${clientid}, url: ${url}`);

// let current = 1;
// let current = 90;
let current = 180;
let responseCnt = 0;
let not200 = 0;
let errorUser = [];
let MAX_COUNT = 200;

process.on('exit', () => {
  console.log(`\n\nGot ${responseCnt} responses with ${not200} non-200 responses`);
  console.log(`Existing user count: ${errorUser.length}`);
  errorUser.sort((a, b) => {
    return a - b;
  });
  console.log('Completed checking for skipped users')
});

function createUser(n) {

  console.log('Creating user with index ' + n);

  let body = {
    client_id: clientid,
    email: `user${n}@gmail.com`,
    password: `user${n}`,
    connection: "DBConn1"
  };

  request.post({
      url: url,
      body: body,
      json: true
    },
    (err, response, body) => {
      responseCnt++;
      if (response.statusCode !== 200) {
        not200++;
        if (body.code !== 'user_exists') {
          console.log(response.statusCode, body);
        } else {
          errorUser.push(n);
        }
      }
      if (err) {
        console.log(`Error on user ${n} message: ${err}`);
      }
      current += 1;
      if (current <= MAX_COUNT) {
        createUser(current);
      }
    }
  );
}

createUser(current);
