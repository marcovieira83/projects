var request = require('request');
const CryptoJS = require('crypto-js');

var public_key  = "85f381d871d29eae5cfeda88095f5901";
var private_key = "a8e5a42c0b60f13e3473531fede34264";
var user_id = "marco.vieira@gmail.com";
var nonce = Date.now();
var signature = CryptoJS.HmacSHA256("" + nonce + user_id + public_key, private_key).toString().toUpperCase();

const defaultBody = {
   "apiKey": public_key,
   "apiNonce": nonce,
   "apiSig": signature
};

function refreshSignature() {
  nonce = Date.now();
  signature = CryptoJS.HmacSHA256("" + nonce + user_id + public_key, private_key).toString().toUpperCase();
  // console.log('"apiKey": "' + public_key + '",');
  // console.log('"apiNonce": ' + nonce + ',');
  // console.log('"apiSig": "' + signature + '"');
}

function doPost(service, body) {
  request.post(
    'https://api.flowbtc.com:8400/ajax/v1/' + service,
    { json: body },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("=== " + service + " ===");
        console.log(body)
      } else {
        console.error("ERROR: " + body);
      }
    }
  );
  refreshSignature();
}

function getUserInfo() {
  doPost('GetUserInfo', defaultBody);
}

function getAccountTrades() {
  doPost('GetAccountTrades', {
     "apiKey": public_key,
     "apiNonce": nonce,
     "apiSig": signature,
     "ins": "BTCBRL",
     "startIndex": 0,
     "count": 30
  });
}

getUserInfo();
// getAccountTrades();
