const CryptoJS = require('crypto-js');

function hash(value) {
  var args = [...arguments];
  var allValues = '';
  args.forEach((arg) => allValues += arg);
  return CryptoJS.SHA256(allValues).toString();
}

console.log(hash('1', '2', '2'));
