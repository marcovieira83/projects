const CryptoJS = require('crypto-js');

function hash(value) {
  var args = [...arguments];
  var allValues = '';
  args.forEach((arg) => allValues += arg);
  return CryptoJS.SHA256(allValues).toString();
}

var SimpleTx = class {
  constructor(input, output1, amount1, output2, amount2) {
    this.input = input;
    this.hash = hash(input, output1, amount1, output2, amount2);
  }
}

var SimpleMerkleTree = class {
  constructor() {
    this.txs = [];
  }
  add(tx) {
    this.txs.push(tx.hash);
  }
  merkleRoot() {
    return hash(this.txs);
  }
}

tree = new SimpleMerkleTree();
tree.add(new SimpleTx('1qqwexzrt', '1jdmcbsgd', 10, '1fbcswerg', 20));
tree.add(new SimpleTx('1dakdhaks', '1ueiq3659', 15, '1ewrqtbcx', 27));
console.log(tree.merkleRoot());
