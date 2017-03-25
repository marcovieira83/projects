const CryptoJS = require('crypto-js');

function hash(value) {
  var args = [...arguments];
  var allValues = '';
  args.forEach((arg) => allValues += arg);
  return CryptoJS.SHA256(allValues).toString();
}

var SimpleTx = class {
  constructor(input, output1, amount1, output2, amount2) {
    this.hash = hash(input, output1, amount1, output2, amount2);
  }
}

var input   = '1qqwexzrt';
var output1 = '1jdmcbsgd';
var amount1 = 10;
var output2 = '1fbcswerg';
var amount2 = 20;
console.log(new SimpleTx(input, output1, amount1, output2, amount2));
