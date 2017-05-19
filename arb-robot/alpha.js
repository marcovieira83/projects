var request = require('request');
const CryptoJS = require('crypto-js');

var public_key  = "97e568d8400102a920921bcc38041364";
var private_key = "cc0bb96de79da4099d7a55db5a429748";
var user_id = "test3@alphapoint.com";  // user ID is your registered email
var nonce = Date.now();
var signature = CryptoJS.HmacSHA256("" + nonce + user_id + public_key, private_key).toString().toUpperCase();

console.log('"apiKey": "' + public_key + '",');
console.log('"apiNonce": ' + nonce + ',');
console.log('"apiSig": "' + signature + '"');

const defaultBody = {
   "apiKey": public_key,
   "apiNonce": nonce,
   "apiSig": signature
};

function doPost(service, body) {
  request.post(
    'https://sim3.alphapoint.com:8400/ajax/v1/' + service,
    { json: body },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body)
      }
    }
  );
}

function getUserInfo() {
  doPost('GetUserInfo', defaultBody);
}

function createOrder() {
  doPost('CreateOrder', {
     "apiKey": public_key,
     "apiNonce": nonce,
     "apiSig": signature,
     "ins": "BTCUSD",
     "side": "buy",
     "orderType": 0,
     "qty": "1.0",
     "px": "340.99"
  });
}

function getAccountOpenOrders() {
  doPost('GetAccountOpenOrders', defaultBody);
}

createOrder();
getUserInfo();
getAccountOpenOrders();
