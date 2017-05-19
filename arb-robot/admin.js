var request = require('request');

// user: marco
// pass: 1234

request.post(
  'https://sim3.alphapoint.com:8451/ajax/v1/Login',
  { json: {
    "adminUserId":"marco",
    "password":"1234"}
   },
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body)
    } else {
      console.error("ERROR: " + body);
    }
  }
);
