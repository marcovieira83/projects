const CryptoJS = require('crypto-js');
const print = require('json-colorz');

function hash(args) {
  var allValues = '';
  args.forEach((arg) => allValues += arg);
  return CryptoJS.SHA256(allValues).toString();
}

var SimpleTx = class {
  constructor(input, output1, amount1, output2, amount2) {
    this.hash = hash([input, output1, amount1, output2, amount2]);
    this.input = input;
    this.output1 = output1;
    this.amount1 = amount1;
    this.output2 = output2;
    this.amount2 = amount2;
  }
}

var input   = '1qqwexzrt';
var output1 = '1jdmcbsgd';
var amount1 = 10;
var output2 = '1fbcswerg';
var amount2 = 20;
console.log('SimpleTx');
print(new SimpleTx(input, output1, amount1, output2, amount2));
