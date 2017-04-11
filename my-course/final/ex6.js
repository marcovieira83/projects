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

class SimpleBlock {
  constructor(height, timestamp, previousBlock, txsTree, hash, nonce) {
    this.height = height;
    this.timestamp = timestamp;
    this.hash = hash;
    this.previousBlock = previousBlock;
    this.merkleRoot = txsTree.merkleRoot;
    this.nonce = nonce;
    this.txsTree = txsTree;
  }
}

class SimpleBlockchain {
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
    var merkleRoot = this.txsTree.merkleRoot;
    var validStart = '00';
    var validHash = '';
    var nonce = -1;
    while (validHash.substring(0, validStart.length) != validStart) {
      nonce++;
      validHash = hash([previousBlock, merkleRoot, nonce]);
    }
    return new SimpleBlock(height, timestamp, previousBlock, this.txsTree, validHash, nonce);
  }
}

function block0() {
  var coinbase = new SimpleTx();
  coinbase.addOutput('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 50);
  coinbase.hash();

  var secondTx = new SimpleTx();
  secondTx.addInput(coinbase.txHash, 0);
  secondTx.addOutput('13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP', 30);
  secondTx.addOutput('1GVW6vDdwdfqoswio1VQ8HaCRFQN3U9hqz', 20);
  secondTx.hash();

  var miner = new Miner();
  miner.receiveTxsToBeMined(coinbase);
  miner.receiveTxsToBeMined(secondTx);

  return miner.mine(0, '2017-04-10 21:30', '0000000000000000000000000000000000000000000000000000000000000000');
}

function block1(previous) {
  var coinbase = new SimpleTx();
  coinbase.addOutput('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 50);
  coinbase.hash();

  var secondTx = new SimpleTx();
  // consome bloco #0, transação 2, índice 0
  // tx: f0a839aada49dd48e3f66c5da606ac3df7e9f8b53bd238bbb4a4b76708c935cd
  // index: 0
  // value: 30
  secondTx.addInput('f0a839aada49dd48e3f66c5da606ac3df7e9f8b53bd238bbb4a4b76708c935cd', 0);
  secondTx.addOutput('19QRZDGDt6hXUYTULmse4CusWZCBvVg37R', 25);
  secondTx.addOutput('13wU6wmLoBshNqmBi9Ur8e92eF1eH3kxPP', 5);
  secondTx.hash();

  var miner = new Miner();
  miner.receiveTxsToBeMined(coinbase);
  miner.receiveTxsToBeMined(secondTx);

  return miner.mine(1, '2017-04-10 21:40', previous);
}

blockchain = new SimpleBlockchain();
block0 = block0();
blockchain.add(block0);
blockchain.add(block1(block0.hash));
print(blockchain);
