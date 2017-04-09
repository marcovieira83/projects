const CryptoJS = require('crypto-js');
const print = require('json-colorz');

function hash(args) {
  var allValues = '';
  args.forEach((arg) => allValues += arg + ' ');
  console.log('hashing: ' + allValues);
  return CryptoJS.SHA256(allValues).toString();
}

class SimpleTx  {
  constructor() {
    this.txHash = '';
    this.inputs = [];
    this.outputs = [];
  }

  addInput(txHash, index) {
    this.inputs.push({txHash, index});
  }

  addOutput(recipient, value) {
    this.outputs.push({recipient, value});
  }

  hash() {
    var all = [];
    this.inputs.forEach(input => {
      all.push(input.txHash);
      all.push(input.index);
    });
    this.outputs.forEach(output => {
      all.push(output.recipient);
      all.push(output.value);
    });
    this.txHash = hash(all);
  }
}

var coinbase = new SimpleTx();
coinbase.addOutput('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 50);
coinbase.hash();

var secondTx = new SimpleTx();
secondTx.addInput(coinbase.txHash, 0);
secondTx.addOutput('13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP', 30);
secondTx.addOutput('1GVW6vDdwdfqoswio1VQ8HaCRFQN3U9hqz', 20);
secondTx.hash();

console.log('coinbase');
print(coinbase);
console.log('secondTx');
print(secondTx);
