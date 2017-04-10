const CryptoJS = require('crypto-js');
const print = require('json-colorz');

function hash(args) {
  var allValues = '';
  args.forEach((arg) => allValues += arg + ' ');
  console.log('hashing: ' + allValues);
  return CryptoJS.SHA256(allValues).toString();
}


class SimpleTx  {
  constructor(input, output1, amount1, output2, amount2) {
    this.hash = hash([input, output1, amount1, output2, amount2]);
    this.input = input;
    this.output1 = output1;
    this.amount1 = amount1;
    this.output2 = output2;
    this.amount2 = amount2;
  }
}

class SimpleMerkleTree {
  constructor() {
    this.root = '';
    this.txs = [];
  }
  add(tx) {
    this.txs.push(tx);
    var txHashes = [];
    this.txs.forEach(tx => txHashes.push(tx.hash));
    this.root = hash(txHashes);
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

class Blockchain {
  constructor() {
    this.chain = [];
  }
  add(block) {
    this.chain.push(block);
  }
}

function block0() {
  var tree = new SimpleMerkleTree();
  tree.add(new SimpleTx('1qqwexzrt', '1jdmcbsgd', 10, '1fbcswerg', 20));
  tree.add(new SimpleTx('1dakdhaks', '1ueiq3659', 15, '1ewrqtbcx', 27));
  return new Block(0, '2017-04-10 21:30', '0000000000000000000000000000000000000000000000000000000000000000', tree);
}

function block1(previous) {
  var tree = new SimpleMerkleTree();
  tree.add(new SimpleTx('1madm35da', '1jdmcbsgd', 3, '1n23kd6kn', 80));
  tree.add(new SimpleTx('1mmap56er', '1ueiq3659', 1, '1d1kda78a', 59));
  return new Block(1, '2017-04-10 21:40', previous, tree);
}

blockchain = new Blockchain();
block0 = block0();
blockchain.add(block0);
blockchain.add(block1(block0.hash));
console.log('Blockchain');
print(blockchain);
