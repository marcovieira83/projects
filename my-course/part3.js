const CryptoJS = require('crypto-js');

var hash = (value) => {
  return CryptoJS.SHA256(value).toString();
}

var Block = class {
  constructor(height, timestamp, previousBlock, merkleRoot) {
    this.previous = previousBlock;
    this.hash = hash(height + timestamp, previousBlock, merkleRoot);
  }
}

var Blockchain = class {
  constructor() {
    this.chain = [];
  }

  addBlock(block) {
    this.chain.push(block);
  }
}

var block0 = () => {
  var height = 0;
  var timestamp = '2017-04-10 21:30';
  var previous = '0000000000000000000000000000000000000000000000000000000000000000';
  var merkleRoot = 'eb61c3724d6da33605084d2d232bba0563cb82f4ad82c101b42f23c2e86277ef';
  return new Block(height, timestamp, previous, merkleRoot);
}

var block1 = (previous) => {
    var height = 1;
    var timestamp = '2017-04-10 21:30';
    var merkleRoot = 'eb61c3724d6da33605084d2d232bba0563cb82f4ad82c101b42f23c2e86277ef';
    return new Block(height, timestamp, previous, merkleRoot);
}

block0 = block0();
block1 = block1(block0.hash);

blockchain = new Blockchain();
blockchain.addBlock(block0);
blockchain.addBlock(block1);

console.log(blockchain);
