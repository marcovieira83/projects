const CryptoJS = require('crypto-js');

function hash(args) {
  var allValues = '';
  args.forEach((arg) => allValues += arg);
  return CryptoJS.SHA256(allValues).toString();
}

console.log(hash(['blockchain', 'rocks!!!']));
