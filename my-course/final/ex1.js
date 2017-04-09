const CryptoJS = require('crypto-js');

function hash(args) {
  var allValues = '';
  args.forEach((arg) => allValues += arg + ' ');
  console.log('hashing: ' + allValues);
  return CryptoJS.SHA256(allValues).toString();
}

console.log(hash( ['Hello', 'BLOCKCHAIN', 'world!'] ));
