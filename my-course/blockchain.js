const CryptoJS = require('crypto-js');

var hash = (value) => {
  return CryptoJS.SHA256(value).toString();
}

var validHash = (value) => {
  validHashStart = '000';
  result = '';
  nonce = 0;
  while (result.substring(0, validHashStart.length) != validHashStart) {
    result = hash(value + nonce).toString();
    nonce++;
  }
  return result;
}

var Block = class {
  constructor(previousBlock, timestamp, merkleRoot) {
    this.previousBlock = previousBlock;
    this.timestamp = timestamp;
    this.hash = validHash(previousBlock + timestamp + merkleRoot);
  }
}

var Blockchain = class {
  constructor() {
    this.blockchain = [];
  }
  addBlock(block) {
    // HOMEWORK: validar bloco
    // HOMEWORK: adicionar altura no bloco
    this.blockchain.push(block);
  }
}

var previous = '0000000000000000000000000000000000000000000000000000000000000000';
var timestamp = '2017-04-10 21:30';
var merkleRoot = 'eb61c3724d6da33605084d2d232bba0563cb82f4ad82c101b42f23c2e86277ef';

block = new Block(previous, timestamp, merkleRoot);
console.log(block.hash);
blockchain = new Blockchain();
blockchain.addBlock(block);
blockchain.addBlock(block);
blockchain.addBlock(block);
console.log(blockchain.blockchain);
