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
    this.inputs.forEach(i => all.push(i.txHash, i.index));
    this.outputs.forEach(o => all.push(o.recipient, o.value));
    this.txHash = hash(all);
  }
}

class SimpleMerkleTree {
  constructor() {
    this.merkleRoot = '';
    this.txs = [];
  }
  add(tx) {
    this.txs.push(tx);
    var txHashes = [];
    this.txs.forEach(tx => txHashes.push(tx.txHash));
    this.merkleRoot = hash(txHashes);
  }
}

class Block {
  constructor(height, timestamp, previousBlock, txsTree, hash, nonce) {
    this.height = height;
    this.timestamp = timestamp;
    this.hash = hash;
    this.previousBlock = previousBlock;
    this.merkleRoot = txsTree.root;
    this.nonce = nonce;
    this.txsTree = txsTree;
  }
}

tree = new SimpleMerkleTree();
tree.add(new SimpleTx('1qqwexzrt', '1jdmcbsgd', 10, '1fbcswerg', 20));
tree.add(new SimpleTx('1dakdhaks', '1ueiq3659', 15, '1ewrqtbcx', 27));

block = new Block(0, '2017-04-10 21:30', '0000000000000000000000000000000000000000000000000000000000000000', tree);
console.log('Block');
print(block);
