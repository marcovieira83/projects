const CryptoJS = require('crypto-js');
const print = require('json-colorz');

function hash(args) {
  var allValues = '';
  args.forEach((arg) => allValues += arg);
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

class Miner {
  constructor() {
    this.txsTree = new SimpleMerkleTree();
  }
  receiveTxsToBeMined(tx) {
    this.txsTree.add(tx);
  }
  mine(height, timestamp, previousBlock) {
    var merkleRoot = this.txsTree.root;
    var validStart = '00';
    var validHash = '';
    var nonce = 0;
    while (validHash.substring(0, validStart.length) != validStart) {
      validHash = hash([timestamp, previousBlock, merkleRoot, nonce]);
      nonce++;
    }
    return new Block(height, timestamp, previousBlock, this.txsTree, validHash, nonce);
  }
}

function block0() {
  var miner = new Miner();
  miner.receiveTxsToBeMined(new SimpleTx('1qqwexzrt', '1jdmcbsgd', 10, '1fbcswerg', 20));
  miner.receiveTxsToBeMined(new SimpleTx('1dakdhaks', '1ueiq3659', 15, '1ewrqtbcx', 27));
  return miner.mine(0, '2017-04-10 21:30', '0000000000000000000000000000000000000000000000000000000000000000');
}

function block1(previous) {
  var miner = new Miner();
  miner.receiveTxsToBeMined(new SimpleTx('1madm35da', '1jdmcbsgd', 3, '1n23kd6kn', 80));
  miner.receiveTxsToBeMined(new SimpleTx('1mmap56er', '1ueiq3659', 1, '1d1kda78a', 59));
  return miner.mine(1, '2017-04-10 21:40', previous);
}

blockchain = new Blockchain();
block0 = block0();
blockchain.add(block0);
blockchain.add(block1(block0.hash));
print(blockchain);
