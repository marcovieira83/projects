var request = require('request');
const CryptoJS = require('crypto-js');

var public_key  = "b4049b30b35538b33f7da82b1efa53e5";
var private_key = "7969e8e946160cdbbed4707d56432bb6";
var user_id = "marco.vieira@gmail.com";  // user ID is your registered email
var nonce = Date.now();
var signature = CryptoJS.HmacSHA256("" + nonce + user_id + public_key, private_key).toString().toUpperCase();

console.log('"apiKey": "' + public_key + '",');
console.log('"apiNonce": ' + nonce + ',');
console.log('"apiSig": "' + signature + '"');

//(Time.now.to_f * 10000).to_isignature = OpenSSL::HMAC.hexdigest("sha256", private_key, "#{nonce}#{user_id}#{public_key}").upcase


// GET USER INFORMATION
// Returns first and last name
// /ajax/v1/GetUserInfo
//
// Headers
// Content-Type: application/json
// Body
// {
//    "apiKey": "704ef876d150bf0e024d2379d0e29274",
//    "apiNonce": 14225711230650,
//    "apiSig": "B8F30FFE8FB577A9A186842661521DAB3E0E3896349C78BCAE38482F4EBDD817"
// }

request.post(
    'https://api.flowbtc.com:8400/ajax/v1/GetUserInfo',
    { json:
       {
          "apiKey": public_key,
          "apiNonce": nonce,
          "apiSig": signature
       }
     },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);