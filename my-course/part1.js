const CryptoJS = require('crypto-js');

var hash = (value) => {
  return CryptoJS.SHA256(value).toString();
}

console.log(hash('blockchain'));
